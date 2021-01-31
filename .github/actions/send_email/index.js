const core = require("@actions/core");
const nodemailer = require("nodemailer");

const user = core.getInput("user");
const pass = core.getInput("pass");

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
  to: "tono.iestacio@gmail.com",
  subject: "Design Your Model S | Tesla",
  html:
    "<h1>Have the most fun you can in a car!</h1><p>Get your <b>Tesla</b> today!</p>",
  attachments: [],
};

transporter.sendMail(message, function (error, info) {
  error
    ? core.setOutput("error", error)
    : core.setOutput("message", info.response);
});
