const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Customer = require('./models/Customer');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5500;

mongoose.connect(
  'mongodb://admin:password123@ds257648.mlab.com:57648/customer-services',
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log('db connected')
);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'This is our main endpoint'
  });
});

app.post('/customer', async (req, res) => {
  try {
    const { name, age, address } = req.body;
    const createCustomer = await new Customer({
      name,
      age,
      address
    });
    createCustomer.save();

    res.status(201).json({
      status: 201,
      message: 'Customer Created',
      data: createCustomer
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong'
    });
  }
});

app.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);

    res.status(201).json({
      status: 201,
      message: 'Get Customer',
      data: customer
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong'
    });
  }
});

app.get('/customers', async (req, res) => {
  try {
    const allCustomers = await Customer.find({});
    res.status(200).json({
      status: 200,
      message: 'All Customers',
      data: allCustomers
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong'
    });
  }
});

app.delete('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const deleteCustomer = await Customer.findOneAndRemove(customerId);
    deleteCustomer.save();

    res.status(200).json({
      status: 200,
      message: 'Customer deleted'
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong'
    });
  }
});

app.listen(PORT, () =>
  console.log(`Customers server started at port: ${PORT}`)
);
