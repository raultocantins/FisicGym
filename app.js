const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const ObjectId = require("objectid");
const cors = require("cors");
const connection = require("./connection");
const Aluno = require("./alunoSchema");
const sendCobranca = require("./cobrar");
const client = require("twilio")(
  process.env.TWILIO_ACCOUT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  {
    lazyLoading: true,
  }
);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.listen(4000, () => {
  console.log("Server on.");
  setInterval(() => {
    sendCobranca();
  }, 10010000);
});

//Adicionar aluno
app.post("/alunos", (req, res) => {
  const aluno = req.body;
  const id = aluno.id;
  var options = { mes: 2628000000, trimestre: 10512000000, anual: 31536000000 };
  var newExp;
  if (!id) {
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
  }

  var newAluno = {
    name: aluno.name,
    number: aluno.number,
    age: aluno.age,
    fat: aluno.fat,
    weight: aluno.weight,
    pressure: aluno.pressure,
    height: aluno.height,
  };
  if (id) {
    newAluno.id = id;
  } else {
    newAluno.exp = new Date().getTime() + newExp;
    newAluno.dateregister = aluno.dateregister;
  }

  if (id) {
    Aluno.updateOne({ _id: { $in: id } }, newAluno, (err, doc) => {
      if (err) {
        res.send(err);
      } else {
        res.json(doc);
      }
    });
  } else {
    Aluno.create(newAluno)
      .then((value) => {
        res.json(value.id);
      })
      .catch((err) => {
        res.send("Houve um erro ao adicionar usuario " + err);
      });
  }
});
//Buscar todos os alunos
app.get("/alunos", (req, res) => {
  Aluno.find((err, docs) => {
    if (err) {
      res.send(err);
    } else {
      if (docs.length <= 0) {
        res.send("");
      } else {
        res.json(
          docs.map((e) => {
            return e;
          })
        );
      }
    }
  });
});
//Buscar todos os alunos expirados
app.get("/mensalidades/expiradas", (req, res) => {
  Aluno.find((err, docs) => {
    if (err) {
      res.send(err);
    } else {
      res.json(
        docs
          .map((e) => {
            return e.exp < new Date().getTime() ? e : undefined;
          })
          .filter((e) => {
            return e;
          })
      );
    }
  });
});
//Buscar quantidade de alunos expirados
app.get("/quantidade/expiradas", (req, res) => {
  Aluno.find((err, docs) => {
    if (err) {
      res.send(err);
    } else {
      res.json(
        docs.map((e) => e.exp < new Date().getTime()).filter((e) => e == true)
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

//Deletar Aluno
app.delete(`/aluno/:id/remove`, (req, res) => {
  var id = req.params.id;

  Aluno.findById(id, (err, aluno) => {
    if (err) {
      res.send(err);
    }
    Aluno.deleteOne({ _id: ObjectId(id) }, (err, doc) => {
      if (err) {
        res.send(err);
      }

      res.json(doc);
    });
  });
});

app.get("/quantity/alunos", (req, res) => {
  var quantity = [12, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  res.send(quantity);
});

app.post("/whatsapp", (req, res) => {
  client.messages
    .create({
      from: "whatsapp:+14155238886",
      body: `Resposta do contato ${req.body.WaId} = ${req.body.Body}`,
      to: `whatsapp:+556392086480`,
    })
    .then((message) => console.log(message.sid))
    .catch((err) => {
      console.log(err);
    });
});
