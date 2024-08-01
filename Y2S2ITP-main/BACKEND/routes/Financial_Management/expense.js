 const express = require('express');
const Expense = require('../models/expense'); // Import Expense model
const bodyParser = require('body-parser');
const pdfkit = require('pdfkit');
//const mongoose = require('mongoose');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

async function generateCustomId() {
  let isUnique = false;
  let customId;

  while (!isUnique) {
    // Generate the custom ID based on the count
    customId = `EXP${(await Expense.countDocuments() + 1).toString().padStart(6, '0')}`; // EXP1, EXP2, EXP3, ...

    // Check if the generated expense_id already exists in the database
    const existingExpense = await Expense.findOne({ expense_id: customId });

    if (!existingExpense) {
      isUnique = true;
    }
  }

  return customId;
}

// Route to add an expense
router.post('/add', async (req, res) => {
  try {
    const customId = await generateCustomId();
    
    console.log('Received date:', req.body.date);
    const dateOnly = new Date(req.body.date).toISOString().split('T')[0];

    const newExpense = new Expense({...req.body, date: dateOnly, expense_id: customId});
    
    await newExpense.save();
    
    res.status(201).json({ message: 'Expense added successfully!' });
  } catch (err) {
    if (err.code === 11000) { // MongoDB duplicate key error code
      res.status(400).json({ message: 'Duplicate expense_id. Please try again.' });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Error adding expense' });
    }
  }
});

// Route to display all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({expense_id:-1});
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});
 

// Route to update an exsiting record

router.route("/update/:expense_id").put(async (req, res) => {
  try {
      let expenseId = req.params.expense_id;
      const { date, category, amount, payment_method, description, receipt_no, name, location } = req.body;
      console.log('Received date:', req.body.date);
      const dateOnly = new Date(req.body.date).toISOString().split('T')[0];
      const updateExpense = {
          date: dateOnly,
          category,
          amount,
          payment_method,
          description,
          receipt_no,
          name,
          location
      }

      const update = await Expense.updateOne({ expense_id: expenseId }, updateExpense);
      res.status(200).send({ status: "Record Updated" });
  } catch (err) {
      console.log(err);
      res.status(500).send({ status: "Error Occurred while Updating" });
  }
});


// Route to delete an expense
router.route("/delete/:expense_id").delete(async (req, res) => {
    try {
      const expenseId = req.params.expense_id;

      // Delete using the custom expense_id
      const deleteResult = await Expense.deleteOne({ expense_id:expenseId });
  
      if (deleteResult.deletedCount > 0) {
        res.status(200).send({ status: "Record Deleted" });
      } else {
        res.status(404).json({ message: "Expense not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ status: "Error Occurred while Deleting" });
    }
  });
  
  //route display only one record
  router.route("/get/:expense_id").get(async (req, res) => {
    let expenseId = req.params.expense_id;
    const expense = await Expense.findOne({ expense_id: expenseId })
       .then(expense => {
         res.status(200).send({ status: "Expense fetched", expense });
       })
       .catch(err => {
         console.log(err.message);
         res.status(500).send({ status: "Error with fetching data", error: err.message });
       });
   });


   async function fetchDataFromDatabase(startDate, endDate) {
    try {
      const expenses = await Expense.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: 1 }); // Sort expenses based on date in ascending order
  
      return expenses;
    } catch (err) {
      console.error('Error fetching data:', err);
      throw err;
    }
  }


   //report generation endpoit 
   router.get('/generate-report', async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Fetch data from the database based on the date range
      const data = await fetchDataFromDatabase(startDate, endDate);

      // Calculate total number of expenses and net amount
    const totalExpenses = data.length;
    const netAmount = data.reduce((acc, item) => acc + item.amount, 0).toFixed(2);
  
      // Initialize PDF document
      const pdf = new pdfkit();
  
      // Set PDF title and metadata
      pdf.info.Title = 'Expense Report';
      pdf.info.Author = 'Finance Manager';
      pdf.info.Subject = `Date Range: ${startDate} to ${endDate}`;
  
      // Set PDF font and size
      pdf.font('Helvetica-Bold').fontSize(20).text('Expense Report', { align: 'center' });
      pdf.moveDown();
      pdf.font('Helvetica-Bold').fontSize(20).text(`Date Range: ${startDate} to ${endDate}`, { align: 'center' });
      pdf.moveDown();
      pdf.font('Helvetica-Bold').fontSize(12).text(`Total Number of Expenses: ${totalExpenses}`, { align: 'left' });
      pdf.font('Helvetica-Bold').fontSize(12).text(`Net Amount: ${netAmount}`, { align: 'left' });
      pdf.moveDown();
      
      // Define table headers and columns (you can add more columns here)
      const headers = ['Date', 'Category', 'Amount'];
      const columnWidths = [100, 200, 100]; // Widths of columns
  
      // Set initial position for table
      let yPos = pdf.y; // Initial y position
  
      // Draw table headers with visible lines
      let xPos = pdf.x+35;
      headers.forEach((header, index) => {
        pdf.rect(xPos, yPos, columnWidths[index], 30).stroke(); // Draw cell boundary
        pdf.font('Helvetica-Bold').fontSize(12).text(header, xPos + 5, yPos + 10, { align: 'center', width: columnWidths[index] - 10 }); // Add header text
        xPos += columnWidths[index];
      });
  
      // Move to next row
      yPos += 30;
  
      // Draw table content with visible lines
      data.forEach((item) => {
        xPos = pdf.x-305; // Reset x position for each row
  
        // Formatting date (example)
        const formattedDate = new Date(item.date).toLocaleDateString(); // Adjust formatting as needed
  
        pdf.rect(xPos, yPos, columnWidths[0], 20).stroke(); // Draw cell boundary
        pdf.font('Helvetica').fontSize(12).text(formattedDate, xPos + 5, yPos + 7, { align: 'center', width: columnWidths[0] - 10  }); // Add date text
        xPos += columnWidths[0];
  
        pdf.rect(xPos, yPos, columnWidths[1], 20).stroke(); // Draw cell boundary
        pdf.text(item.category, xPos + 5, yPos + 7, { align: 'center', width: columnWidths[1] - 10  }); // Add category text
        xPos += columnWidths[1];
  
        // Formatting amount (example)
        const formattedAmount = item.amount.toFixed(2); // Format to two decimal places, adjust as needed
  
        pdf.rect(xPos, yPos, columnWidths[2], 20).stroke(); // Draw cell boundary
        pdf.text(formattedAmount, xPos + 5, yPos + 7, { align: 'left', width: columnWidths[2] - 10  }); // Add amount text (right-aligned)
  
        // Move to next row
        yPos += 20;
      });
  
      // Set content type and send PDF as response
      res.setHeader('Content-Type', 'application/pdf');
      pdf.pipe(res);
      pdf.end();
  
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).send({ error: 'Error generating report' });
    }
  });
  

//route for search function
router.get('/search', async (req, res) => {
  try {
    const { query, minAmount, maxAmount } = req.query;

    let amountQuery = {};

    // Check if minAmount and/or maxAmount are provided and convert them to numbers
    if (minAmount) {
      const min = parseFloat(minAmount);
      if (!isNaN(min)) {
        amountQuery.$gte = min;
      }
    }

    if (maxAmount) {
      const max = parseFloat(maxAmount);
      if (!isNaN(max)) {
        amountQuery.$lte = max;
      }
    }

    // Perform search
    const expenses = await Expense.find({
      $or: [
        { 'expense_id': { $regex: query, $options: 'i' } },
        { 'category': { $regex: query, $options: 'i' } },
        { 'payment_method': {$regex: query, $options: 'i'}},
        { 'description': { $regex: query, $options: 'i' } },
        { 'receipt_no': {$regex: query, $options: 'i'}},
        { 'name': { $regex: query, $options: 'i' } },
        { 'location': { $regex: query, $options: 'i' } }
      ],
      ...amountQuery // Add amount query if applicable
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error searching expenses:", error);
    res.status(500).json({ message: "Error searching expenses" });
  }
});



module.exports = router;
