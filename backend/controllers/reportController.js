const asyncHandler = require("express-async-handler");
const Report = require("../model/reportModel");

const submitReport = asyncHandler(async (req, res) => {
  const report = await Report.create({
    user: req.body.id,
    house: req.body.houseId,
    reportType: req.body.reportType,
    message: req.body.message
  })

  res.status(200).json(report)

});

const getAllReportsForHouse = asyncHandler(async (req, res) => {
  const houseId = req.params.houseId;
  const reports = await Report.find({ houseEntity: houseId });
  res.json(reports);
});

const getReportById = asyncHandler(async (req, res) => {
  const reportId = req.params.id;

  const report = await Report.findById(reportId);
  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  res.json(report);
});

module.exports = {
  submitReport,
  getAllReportsForHouse,
  getReportById,
};
