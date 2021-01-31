const core = require("@actions/core");
const nodemailer = require("nodemailer");

const user = core.getInput("user");
const pass = core.getInput("pass");
const email_destination = core.getInput("email_destination");
const data = core.getInput("syntax_check_job");
console.log(data);

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: user,
    pass: pass,
  },
});

const message = {
  from: user,
  to: email_destination,
  subject: "Resultado del workflow ejecutado",
  html: `
    <p>Se ha realizado un push en la rama githubActions_improvement que ha provocado la ejecución del workflow Bingo_Workflow con los siguientes resultados:</p>
    <br>
    <p>- syntax_check_job: ${prueba}</p>
    <p>- test_execution_job: resultado asociada</p>
    <p>- build_statics_job: resultado asociada</p>
    <p>- deploy_job: resultado asociada</p>
  `,
  attachments: [],
};

transporter.sendMail(message, function (err, info) {
  err ? console.log(err) : console.log(info);
});
