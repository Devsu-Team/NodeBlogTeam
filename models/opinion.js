let mongoose = require('mongoose');

// Opinion Schema
let opinionSchema = mongoose.Schema({
  article:{
    type: String,
    required: true
  },
  opinion:{
    type: String,
    required: true
  }
});

let Opinion = module.exports = mongoose.model('Opinion', opinionSchema);
