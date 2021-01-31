const core = require("@actions/core");
const nodemailer = require("nodemailer");

const user = core.getInput("user");
const pass = core.getInput("pass");
const to = core.getInput("to");

console.log(user + "s");
console.log(to + "s");

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
  to: to,
  subject: "Resultado del workflow ejecutado",
  html: `
    <p>Se ha realizado un push en la rama githubActions_improvement que ha provocado la ejecución del workflow Bingo_Workflow con los siguientes resultados:</p>
    <br>
    <p>- syntax_check_job: resultado asociada</p>
    <p>- test_execution_job: resultado asociada</p>
    <p>- build_statics_job: resultado asociada</p>
    <p>- deploy_job: resultado asociada</p>
  `,
  attachments: [],
};

transporter.sendMail(message, function (error, info) {
  error
    ? core.setOutput("error", error)
    : core.setOutput("message", info.response);
});
