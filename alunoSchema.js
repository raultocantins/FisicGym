const mongoose = require("mongoose");

const alunoSchema = mongoose.Schema({
  name: String,
  number: String,
  age: Date,
  fat: Number,
  weight: Number,
  pressure: Number,
  exp: Number,
  height: Number,
  dateregister: Date,
  historic: Object,
});

module.exports = mongoose.model("Aluno", alunoSchema);
