const nodemailer = require('nodemailer')
const {resetPasswordFail} = require('./error_handler')

const sendEmail = (email,userName,token,res)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.in",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset Request From Yantram Devices',
        html:   `<div> \
                    <h3>Yantram Devices</h2> \
                    <h5>Reset Password</h5> \
                    <p>Hi ${userName}</p> \
                    <p>Forgot your password ?</p>\
                    <p>We received a request to reset the password for your account</p>\
                    <p>Token for password reset is</p>\
                    <h2>${token}</h2>\
                    <p>With Regards</p>\
                    <p>Yantram Team</p>\
                </div>`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          // console.log(error);
          resetPasswordFail(res,error)
        } else {
          // console.log('Email sent: ' + info.response);
          res.status(201).send({
            message:info.response
          })
        }
      });
}

module.exports = sendEmail