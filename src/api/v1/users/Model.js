const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const userSchema = Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true  },
  email: { type: String, trim: true },
  password: {
    type: String,
    required: true,
  },
  city: { type: String },
  avater: {type : String , default : "avater"},
  address: {
    country:  { type: String , default : undefined },  
    regionName:  { type: String , default : undefined },  
    zipCode:  { type: String , default : undefined },  
    city:  { type: String , default : undefined }, 
  },
  isDelete : { type : Boolean , default: false },
},
{ timestamps: true }
);


module.exports = model('User', userSchema);
