const core = require("@actions/core");
const nodemailer = require("nodemailer");

const user = core.getInput("user");
const pass = core.getInput("pass");
const email_destination = core.getInput("email_destination");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  ignoreTLS: false,
  secure: false,
  auth: {
    user: user,
    pass: pass,
  },
});

const message = {
  from: user,
  to: email_destination,
  subject: "Design Your Model S | Tesla",
  html:
    "<h1>Have the most fun you can in a car!</h1><p>Get your <b>Tesla</b> today!</p>",
  attachments: [],
};

transporter.sendMail(message, function (err, info) {
  if (err) console.log(err);
  else console.log(info);
});
