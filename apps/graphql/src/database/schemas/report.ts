import mongoose from "mongoose";

const report = new mongoose.Schema({
  id: String,
  source: String,
  sourceIdentityId: String,
  reference: {
    referenceId: String,
    referenceType: String,
  },
  state: String,
  payload: {
    source: String,
    reportType: String,
    message: String,
    reportId: String,
    referenceResourceId: String,
    referenceResourceType: String,
  },
  created: String,
});

const Reports = mongoose.model("Report", report, "reports");
export default Reports;
