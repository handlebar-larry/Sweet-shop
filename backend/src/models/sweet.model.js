const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
  },
  price: {
    type: Number,
    required: true,
    min: 1 
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  sweetpic:{
    type:String,
  }
});


const Sweet = mongoose.model("Sweet", sweetSchema);

module.exports = Sweet;
