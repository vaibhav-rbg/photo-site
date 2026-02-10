const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com",
    pass: "your-app-password"
  }
});

const mailOptions = {
  from: "yourgmail@gmail.com",
  to: "yourgmail@gmail.com",
  subject: "Test email from Node",
  text: "Hello! If you get this, Gmail is working."
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) console.log("Error:", err);
  else console.log("Email sent:", info.response);
});

