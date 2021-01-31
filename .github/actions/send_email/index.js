const core = require("@actions/core");
const nodemailer = require("nodemailer");

const user = core.getInput("user");
const pass = core.getInput("pass");
const to = core.getInput("to");

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
  html: "sssss",
  attachments: [],
};

transporter.sendMail(message, function (error, info) {
  console.log("ostia puta que asco");
  error
    ? core.setOutput("error", error)
    : core.setOutput("message", info.response);
});
