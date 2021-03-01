require("dotenv").config();
const client = require("twilio")(
  process.env.TWILIO_ACCOUT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  {
    lazyLoading: true,
  }
);
const connection = require("./connection");
const Aluno = require("./alunoSchema");

function step1(name) {
  return `Olá ${name} muito obrigado por fazer parte da Fisic Academia, Sua mensalidade venceu e essa mensagem é enviada automaticamente pelo sistema, caso tenha feito o pagamento então é só desconsiderar a mensagem e partir para o treino.`;
}

function step2(name) {
  return `Olá ${name} muito obrigado por fazer parte da Fisic Academia, Sua mensalidade venceu e essa mensagem
    é enviada automaticamente pelo sistema, caso tenha feito o pagamento então é só desconsiderar a mensagem e partir para o treino.`;
}

function SendCobranca() {
  Aluno.find((err, docs) => {
    if (err) {
      console.log(err);
    } else {
      //selecionando alunos expirados
      var alunosExpirados = docs.map((e) => {
        return e.exp < new Date().getTime() ? e : null;
      });

      // enviando mensagem para aluno
      alunosExpirados.map((aluno) => {
        if (aluno.stepcobranca === 0) {
          client.messages
            .create({
              from: "whatsapp:+14155238886",
              body: step1(aluno.name),
              to: `whatsapp:+${aluno.number}`,
            })
            .then((message) => console.log(message.sid));

          Aluno.updateOne(
            { _id: ObjectId(aluno._id) },
            { stepcobranca: 1 },
            (err, doc) => {
              if (err) {
                console.log(err);
              }
              console.log("Deu tudo certo stepcobrança 1" + doc);
            }
          );
        }
      });
    }
  });
}

 function teste(){

  client.messages
            .create({
              from: "whatsapp:+14155238886",
              body: step1('alex raul'),
              to: `whatsapp:+556391201458`,
            })
            .then((message) => console.log(message))
            .catch((err)=>{
              console.log(err)
            })
}




module.exports=teste;