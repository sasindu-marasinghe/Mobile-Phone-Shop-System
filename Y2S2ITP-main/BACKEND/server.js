const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8175;

app.get("/", (req, res) => {
  res.send("welcome api>>>");
});
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware
app.use(express.json({ extended: false, limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 })
);
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
const path = require('path');



// MongoDB connection
const URL = process.env.MONGODB_URL;
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });



// Routes
const productRouter = require('./routes/Inventory_Management/products.js');
const userRouter = require('./routes/User/Employees.js');
const appointmentRouter = require("./routes/appointment/appointments.js");

const feedbackRouter = require('./routes/feedback management/feedbacks.js');

const expenseRoutes = require('./routes/Financial_Management/expense');
const salaryRoutes = require('./routes/Financial_Management/salary');

//Models
//const Expense = require('./models/expense');//Finance
//const Salary = require('./models/salary');//Finance




app.use(express.static('uploads/images'));
app.use(express.json());

app.use('/product', productRouter);//Product
app.use('/user', userRouter);//User
app.use('/appointment', appointmentRouter);//Appointment 
//order 
app.use('/feedback',feedbackRouter);//feedback 
//leave
//promotion
app.use('/expenses', expenseRoutes);//Finance
app.use('/salaries', salaryRoutes);//Finance
//payment

// Start server
app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});
