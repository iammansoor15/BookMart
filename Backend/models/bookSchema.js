const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:true
  },
  isbn: { 
    type: String, 
    required: true,
    unique: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    required: true 
  },
  genre: { 
    type: String,
    required: true
  },
  location: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  owner: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: { 
    type: String, 
    required: true,
    match: [/^\d{10}$/, "Phone number must contain exactly 10 digits"]
  },
  status:{
    type:String,
    enum:['active','rented','sold'],
    default:'active'
  }

});

module.exports = mongoose.model("Book", bookSchema);