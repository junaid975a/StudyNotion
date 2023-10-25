const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
    try{
        // mail send krne ke liye transporter use hota h
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });
        // console.log(body);
        // console.log(transporter);

        // prepare the email and send
        let info = await transporter.sendMail({
            from: "StudyNotion --by Junaid",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        });

        return info;

    } catch(err) {
        console.log("Mail Sender failed.")
        console.log(err.message);
    }
}

module.exports = mailSender;