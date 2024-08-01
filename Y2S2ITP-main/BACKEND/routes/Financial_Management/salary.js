const express = require('express');
const Salary = require('../models/salary'); // Import Salary model
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//function to generate employee id
async function generateCustomId() {
  // Get the count of existing salary records
  const count = await Salary.countDocuments();
  
  // Generate the custom ID based on the count
  const customId = `EMP${(count + 1).toString().padStart(4, '0')}`; // EXP1, EXP2, EXP3, ...

  return customId;
}


//function to calculate net salary

function calculateNetSalary(base_salary, ot_payment, bonus, deduction) {
  
  const baseSalaryNum = parseFloat(base_salary);
  const otPaymentNum = parseFloat(ot_payment);
  const bonusNum = parseFloat(bonus);
  const deductionNum = parseFloat(deduction);
  
  const grossSalary = baseSalaryNum + otPaymentNum + bonusNum;
  const netSalary = grossSalary - deductionNum;
  return netSalary;
}


// Route to add a salary
router.post('/add', async (req, res) => {
  try {


    //calculate net salary
    const netSalary = calculateNetSalary(req.body.base_salary, req.body.ot_payment, req.body.bonus, req.body.deduction);
  
    //generate id for the record
    const customId = await generateCustomId();

    const newSalary = new Salary({...req.body,employee_id:customId,net_salary:netSalary});
    await newSalary.save();
    res.status(201).json({ message: 'Salary added successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding salary' });
  }
});

// Route to display all salaries
router.get('/', async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.status(200).json(salaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching salaries' });
  }
});

// Route to update an exsiting record
router.route("/update/:employee_id").put(async (req, res) => {
  let employeeId = req.params.employee_id;
  const {name,position,base_salary,ot_payment,bonus,deduction,/*net_salary doubt should concern*/pay_period} = req.body;

  //calculate net salary
  const netSalary = calculateNetSalary(req.body.base_salary, req.body.ot_payment, req.body.bonus, req.body.deduction);

  const updateSalary = {
    name,
    position,
    base_salary,
    ot_payment,
    bonus,
    deduction,
    net_salary:netSalary,
    pay_period
  }

  try {
    const update = await Salary.updateOne({ employee_id: employeeId }, updateSalary);
    if (update.nModified > 0) {
      res.status(200).send({ status: "Record Updated" });
    } else {
      res.status(404).json({ message: "Salary record not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error Occurred while Updating" });
  }
})


// Route to delete an salary record
router.route("/delete/:employee_id").delete(async (req, res) => {
  try {
    const employeeId = req.params.employee_id;

    // Validation for employee_id
    const validExpenseId = /^EMP\d{4}$/; // Regex to match format "EXP1234"
    if (!validExpenseId.test(employeeId)) {
      res.status(400).json({ message: "Invalid employee ID format" });
      return;
    }

    // Delete using the custom expense_id
    const deleteResult = await Salary.deleteOne({ employee_id:employeeId });

    if (deleteResult.deletedCount > 0) {
      res.status(200).send({ status: "Record Deleted" });
    } else {
      res.status(404).json({ message: "Salary record not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "Error Occurred while Deleting" });
  }
});

 //route display only one record
 router.route("/get/:employee_id").get(async (req, res) => {
  let employeeId = req.params.employee_id;
  const salary = await Salary.findOne({ employee_id: employeeId })
     .then(salary => {
       res.status(200).send({ status: "Expense fetched", salary });
     })
     .catch(err => {
       console.log(err.message);
       res.status(500).send({ status: "Error with fetching data", error: err.message });
     });
 });
 

 // Route to filter salaries by position and pay period - not implemented in frontend
router.get('/filter', async (req, res) => {
  try {
    const { position, pay_period } = req.query;

    let filter = {};

    if (position) {
      filter.position = position;
    }

    if (pay_period) {
      filter.pay_period = pay_period;
    }

    const salaries = await Salary.find(filter);

    if (salaries.length > 0) {
      res.status(200).json(salaries);
    } else {
      res.status(404).json({ message: 'No salaries found matching the criteria' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching filtered salaries' });
  }
});


//search function route
router.get('/search', async (req, res) => {
  try {
    const { query} = req.query;

    let amountQuery = {};

    // Perform search
    const salaries = await Salary.find({
      $or: [
        { 'employee_id': { $regex: query, $options: 'i' } },
        { 'name': { $regex: query, $options: 'i' } },
        { 'position': {$regex: query, $options: 'i'}},
        { 'pay_period': { $regex: query, $options: 'i' } },
      ],
      ...amountQuery // Add amount query if applicable
    });

    res.status(200).json(salaries);
  } catch (error) {
    console.error("Error searching salaries:", error);
    res.status(500).json({ message: "Error searching salaries" });
  }
});



module.exports = router;
