const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expense_id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },  
  payment_method: { type: String, required: true },
  description: { type: String, required: true },
  receipt_no: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
});

module.exports = mongoose.model('Expense', expenseSchema);
