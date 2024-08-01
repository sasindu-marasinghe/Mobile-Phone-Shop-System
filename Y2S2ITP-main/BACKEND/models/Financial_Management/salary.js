const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employee_id: { type: String, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },  
  base_salary: { type: Number, required: true },
  ot_payment: { type: Number, required: true },
  bonus: { type: Number, required: true },  
  deduction: { type: Number, required: true },
  net_salary: { type: Number, required: true },
  pay_period: { type: String, required: true },
});

module.exports = mongoose.model('Salary', salarySchema);
