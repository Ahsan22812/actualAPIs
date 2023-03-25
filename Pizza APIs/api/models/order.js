const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Delivery', 'Takeaway'], required: true },
  status: { type: String, enum: ['In progress', 'Ready', 'Delivered', 'Cancelled'], required: true },
  amount: { type: Number, required: true },
  items: {
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity: { type: Number, required: true, default: 1 },
    subtotal: { type: Number, required: true }
  }
},
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema);
