const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")


exports.contactUsController = async(req, res) => {
    const {email, firstname, lastname, message, phone, countrycode} = req.body;
    console.log(req.body);
    try {
        const emailRes = await mailSender(
            email,
            "Your Data sent successfully",
            contactUsEmail(email,firstname,lastname,message,phone,countrycode)
        )

        console.log("Email Result: ", emailRes)
        return res.json({
            success: true,
            message: "Email Sent successfully"
        })
    } catch(err) {
        console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })

    }
}