const core = require("@actions/core");
const nodemailer = require("nodemailer");

// Credentials
const user = core.getInput("user");
const pass = core.getInput("pass");
const email_destination = core.getInput("email_destination");

// Jobs
const syntax_check_job = core.getInput("syntax_check_job");
const test_execution_job = core.getInput("test_execution_job");
const build_statics_job = core.getInput("build_statics_job");
const deploy_job = core.getInput("deploy_job");

function prueba(job) {
  if (job == "") {
    return "skiped";
  }
  return job;
}
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
    <p>- syntax_check_job: ${
      syntax_check_job == "" ? "SKIPPED" : syntax_check_job
    }</p>
    <p>- test_execution_job: ${
      test_execution_job == "" ? "SKIPPED" : test_execution_job
    }</p>
    <p>- build_statics_job: ${
      build_statics_job == "" ? "SKIPPED" : build_statics_job
    }</p>
    <p>- deploy_job: ${prueba(deploy_job)}</p>
  `,
  attachments: [],
};

transporter.sendMail(message, function (err, info) {
  err ? console.log(err) : console.log(info);
});
