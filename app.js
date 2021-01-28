const express = require("express");
const bodyParser = require("body-parser");
const ObjectId = require("objectid");
const cors = require("cors");
const connection = require("./connection");
const Aluno = require("./alunoSchema");
const dummy = require("./alunoDummy");
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.listen(4000, () => {
  console.log("Server on.");
});

//Adicionar aluno
app.post("/alunos", (req, res) => {
  const aluno = req.body;
  console.log(aluno);
  var options = { mes: 2628000000, trimestre: 10512000000, anual: 31536000000 };
  var newExp;
  switch (aluno.option) {
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

  var newAluno = {
    name: aluno.name,
    number: aluno.number,
    age: aluno.age,
    fat: aluno.fat,
    weight: aluno.weight,
    pressure: aluno.pressure,
    exp: new Date().getTime() + newExp,
    height: aluno.height,
    dateregister: aluno.dateregister,
  };
  console.log("chegando aqui");
  Aluno.create(newAluno)
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
          /* if (e.exp >= new Date().getTime()) {
            return { pagas: e };
          } else {
            return { vencidas: e };
          }*/
          return e;
        })
      );
    }
  });
});

//Buscar aluno por id
app.get("/alunos/:id", (req, res) => {
  var id = req.params.id;

  Aluno.findById(ObjectId(id), (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
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
