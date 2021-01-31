const core = require("@actions/core");
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var transport = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: core.getInput("user"),
      pass: core.getInput("pass"),
    },
  })
);

const message = {
  from: "tonomollag6@gmail.com",
  to: "tono.iestacio@email.com",
  subject: "Design Your Model S | Tesla",
  html:
    "<h1>Have the most fun you can in a car!</h1><p>Get your <b>Tesla</b> today!</p>",
  attachments: [],
};

transport.sendMail(message, function (error, info) {
  error
    ? core.setOutput("error", error)
    : core.setOutput("message", info.response);
});
