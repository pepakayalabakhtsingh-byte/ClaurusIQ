const PDFGenerator = require('./PDFGenerator');
const WordGenerator = require('./WordGenerator');
const PowerPointGenerator = require('./PowerPointGenerator');
const { Parser } = require('json2csv');

class ExportEngine {
  static async exportReport(format, report, res) {
    try {
      switch (format.toLowerCase()) {
        case 'pdf':
          await PDFGenerator.generate(report, res);
          break;
        case 'docx':
          await WordGenerator.generate(report, res);
          break;
        case 'ppt':
        case 'pptx':
          await PowerPointGenerator.generate(report, res);
          break;
        case 'json':
          res.setHeader('Content-disposition', `attachment; filename=Report-${report._id}.json`);
          res.setHeader('Content-type', 'application/json');
          res.send(JSON.stringify(report, null, 2));
          break;
        case 'csv':
          const parser = new Parser();
          const csv = parser.parse(report.keyFindings?.topDiscoveries || []);
          res.setHeader('Content-disposition', `attachment; filename=Findings-${report._id}.csv`);
          res.setHeader('Content-type', 'text/csv');
          res.send(csv);
          break;
        case 'markdown':
        case 'md':
          res.setHeader('Content-disposition', `attachment; filename=Report-${report._id}.md`);
          res.setHeader('Content-type', 'text/markdown');
          res.send(`# ${report.title || 'Research Report'}\n\n**Query:** ${report.query}\n\n## Executive Summary\n${report.content?.executiveSummary || ''}\n\n## Key Findings\n${(report.content?.keyFindings || []).map(k => `- **${k.finding}**: ${k.implication}`).join('\n')}\n\n## Sources\n${(report.sources || []).map(s => `- [${s.title}](${s.url}) (Credibility: ${s.credibilityScore})`).join('\n')}`);
          break;
        case 'html':
          res.setHeader('Content-disposition', `attachment; filename=Report-${report._id}.html`);
          res.setHeader('Content-type', 'text/html');
          res.send(`<!DOCTYPE html><html><head><title>${report.title}</title><style>body{font-family:sans-serif;line-height:1.6;padding:2rem;max-width:800px;margin:auto}</style></head><body><h1>${report.title || 'Research Report'}</h1><p><strong>Query:</strong> ${report.query}</p><h2>Executive Summary</h2><p>${report.content?.executiveSummary || ''}</p><h2>Key Findings</h2><ul>${(report.content?.keyFindings || []).map(k => `<li><strong>${k.finding}</strong>: ${k.implication}</li>`).join('')}</ul><h2>Sources</h2><ul>${(report.sources || []).map(s => `<li><a href="${s.url}">${s.title}</a> (Credibility: ${s.credibilityScore})</li>`).join('')}</ul></body></html>`);
          break;
        default:
          throw new Error('Unsupported format');
      }
      
      // Update report metadata to track exports
      if (report.exports) {
        report.exports.push({ format, timestamp: new Date(), success: true });
        await report.save();
      }

    } catch (error) {
      console.error('ExportEngine Error:', error);
      res.status(500).json({ success: false, error: 'Export failed' });
    }
  }
}

module.exports = ExportEngine;
