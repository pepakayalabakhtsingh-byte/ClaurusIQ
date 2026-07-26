const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('./config/config');
const connectDB = require('./config/db');
const ExportEngine = require('./services/ExportEngine/ExportEngine');

async function runExportTest() {
  const dummyReport = {
    title: 'Executive Summary: Microplastics',
    query: 'What are the effects of microplastics?',
    content: {
      executiveSummary: 'Microplastics are a growing concern in marine ecosystems.',
      keyFindings: [
        { finding: 'Microplastics are everywhere.', implication: 'Ecosystem damage.' }
      ],
      comprehensiveAnalysis: 'This is a long analysis of microplastics...',
      methodology: 'Literature review.'
    },
    sources: [
      { url: 'https://example.com', title: 'A Study on Plastics', credibilityScore: 90 }
    ],
    metadata: {
      biasScore: 2.5,
      reliabilityScore: 88,
      timestamp: new Date()
    }
  };

  const outDir = path.join(__dirname, 'export_test_output');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  // We mock a Response object
  const createMockRes = (format) => {
    return {
      setHeader: () => {},
      json: (data) => {
        fs.writeFileSync(path.join(outDir, `test_report.${format}`), JSON.stringify(data, null, 2));
      },
      send: (data) => {
        const ext = format === 'markdown' ? 'md' : format;
        fs.writeFileSync(path.join(outDir, `test_report.${ext}`), data);
      }
    };
  };

  const formats = ['json', 'markdown', 'html'];
  
  console.log('Testing Export Generation...');
  for (const format of formats) {
    try {
      await ExportEngine.exportReport(format, dummyReport, createMockRes(format));
      console.log(`✅ Export successful: ${format.toUpperCase()}`);
    } catch (err) {
      console.error(`❌ Export failed: ${format.toUpperCase()} -`, err.message);
    }
  }

  console.log('\nVerifying File Integrity...');
  for (const format of formats) {
    const ext = format === 'markdown' ? 'md' : format;
    const file = path.join(outDir, `test_report.${ext}`);
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      if (stats.size > 0) {
        console.log(`✅ Integrity verified: ${file} (${stats.size} bytes)`);
      } else {
        console.log(`❌ Integrity failed: ${file} is empty.`);
      }
    } else {
      console.log(`❌ Integrity failed: ${file} not found.`);
    }
  }

  process.exit(0);
}

runExportTest();
