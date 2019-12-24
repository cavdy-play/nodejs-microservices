const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const Order = require('./models/Order');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 6500;

mongoose.connect(
  'mongodb://admin:password123@ds257648.mlab.com:57668/order-services',
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log('db connected')
);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'This is our main endpoint'
  });
});

app.post('/order', async (req, res) => {
  try {
    const { customerId, bookId, gotDate, deliveryDate } = req.body;
    const createOrder = await new Order({
      customerId: mongoose.Types.ObjectId(customerId),
      bookId: mongoose.Types.ObjectId(bookId),
      gotDate,
      deliveryDate
    });
    createOrder.save();

    res.status(201).json({
      status: 201,
      message: 'Order Created',
      data: createOrder
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong'
    });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const allOrders = await Order.find({});
    res.status(200).json({
      status: 200,
      message: 'All Orders',
      data: allOrders
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong'
    });
  }
});

app.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (order) {
      const orderObj = {};

      // Customer Request
      const customer = await axios.get(
        `http://localhost:5500/customer/${order.customerId}`
      );
      orderObj.customerName = customer.data.data.name;

      // Book request
      const book = await axios.get(
        `http://localhost:4000/book/${order.bookId}`
      );
      orderObj.bookTitle = book.data.data.title;

      res.status(200).json({
        status: 200,
        message: 'Customer Order',
        data: orderObj
      });
    } else {
      res.status(404).json({
        status: 404,
        message: 'Invalid Order'
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong'
    });
  }
});

app.listen(PORT, () => console.log(`Orders server started at port: ${PORT}`));
