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
  stepcobranca:{ type: Number, default: 0 }
});

module.exports = mongoose.model("Aluno", alunoSchema);
