const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60,
    }
});


// mail sending function
async function sendVerificationEmail(email, otp) {
    try{
        // mail le liya--> from utils.mailSender
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp);
        console.log("Email sent Successfully: ", mailResponse);

    } catch(err) {
        console.log("Error occured while sending mail.")
        console.log(err.message);
        throw err;
    }
}

// this will run, before saving data to the DB
OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})


module.exports = mongoose.model("OTP", OTPSchema);