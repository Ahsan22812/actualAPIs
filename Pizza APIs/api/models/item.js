const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type : String , required: true} ,
  description: { type : String , required: true},
  price: { type : Number , required: true},
  category: { type : String , enum : ['Pizza','Pasta','Salad','Beverage'], required: true} 
})

module.exports = mongoose.model('Item', itemSchema);