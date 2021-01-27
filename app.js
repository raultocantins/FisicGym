const express = require("express");
const bodyParser = require("body-parser");
const ObjectId = require("objectid");

const connection = require("./connection");
const Aluno = require("./alunoSchema");

const app = express();
app.use(bodyParser.json());
app.listen(3000, () => {
  console.log("Server on.");
});

//Adicionar aluno
app.post("/alunos", (req, res) => {
  const aluno = req.body.aluno;
  Aluno.create(aluno)
    .then((value) => {
      res.json(value.id);
    })
    .catch((err) => {
      res.send("Houve um erro ao adicionar usuario " + err);
    });
});
//Buscar todos os alunos
app.get("/alunos", (req, res) => {
  Aluno.find((err, docs) => {
    if (err) {
      res.send(err);
    } else {
      res.json(
        docs.map((e) => {
          if (e.exp >= new Date().getTime()) {
            return { pagas: e };
          } else {
            return { vencidas: e };
          }
        })
      );
    }
  });
});
//Renovar matricula do aluno
app.patch(`/aluno/:id/renovar`, (req, res) => {
  var id = req.params.id;
  var option = req.body.option;
  var options = { mes: 2628000000, trimestre: 10512000000, anual: 31536000000 };
  var newExp;
  switch (option) {
    case "1":
      newExp = options.mes;
      break;
    case "2":
      newExp = options.trimestre;
      break;
    case "3":
      newExp = options.anual;
      break;
    default:
      newExp = options.mes;
  }
  Aluno.findById(id, (err, aluno) => {
    if (err) {
      res.send(err);
    }
    Aluno.updateOne(
      { _id: ObjectId(id) },
      { exp: (aluno.exp += newExp) },
      (err, doc) => {
        if (err) {
          res.send(err);
        }
        res.json(doc);
      }
    );
  });
});
