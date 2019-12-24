const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customerId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  bookId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  gotDate: {
    type: Date,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
