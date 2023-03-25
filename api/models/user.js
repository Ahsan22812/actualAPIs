const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type : String , required: true },
  email: { type : String , required: true, unique: true, 
    match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/} ,
  passwordHash: { type : String , required: true},
  con_num: { type : Number , required: true},
  address: {type : String , required: true},
  isAdmin:{type : Boolean , required: true, default: false}
  
})

module.exports = mongoose.model('User', userSchema);