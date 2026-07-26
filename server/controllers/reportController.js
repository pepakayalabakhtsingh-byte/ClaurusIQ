const ReportSession = require('../models/ReportSession');
const ExportEngine = require('../services/ExportEngine/ExportEngine');

exports.getReportByWorkflowId = async (req, res) => {
  try {
    const { workflowId } = req.params;
    const report = await ReportSession.findOne({ workflowId, ownerId: req.user.id }).sort({ createdAt: -1 });

    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found for this workflow.' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.exportReport = async (req, res) => {
  try {
    const { workflowId, format } = req.params;
    const report = await ReportSession.findOne({ workflowId, ownerId: req.user.id }).sort({ createdAt: -1 });
    
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found.' });
    }

    await ExportEngine.exportReport(format, report, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
