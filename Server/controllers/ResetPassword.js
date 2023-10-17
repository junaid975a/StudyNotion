const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");


// resetPasswordToken
exports.resetPasswordToken = async(req, res) => {
    try {
        // get email from req body
        const email = req.body.email;

        // check email, email validation etc.
        const user = await User.findOne({email: email});

        if(!user) {
            return res.status(401).json({
                success: false,
                massage: "User does not exist.",
            });
        }

        // generate token 
        const token = crypto.randomUUID();

        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email: email},
                                    {
                                        token: token,
                                        resetPasswordExpires: Date.now() + 5*60*1000,
                                    },
                                    {new: true});
        
        // link generate for reset password, send mail
        const url = `http://localhost:3000/update-password/${token}`;
        await mailSender(email, 
                            "Password Reset Link", 
                                `Password Reset Link: ${url}`)


        // return res
        return res.status(200).json({
            success: true,
            massage: "Email sent successfully, check you email and change password.",
        });

    } catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            massage: err.message,
        });
    }
}

// resetPassword
exports.resetPassword = async(req, res) => {
    try {
        // data fetch
        const {password, confirmPassword, token} = req.body;

        // data validation
        if(password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                massage: "Password and confirm-password not matching",
            });
        }


        // get user-details from db using token
        const userDetails = await User.findOne({token: token});
        // if no entry- invalid token
        if(!userDetails) {
            return res.status(401).json({
                success: false,
                massage: "Token is invalid.",
            });
        }
        // token time check
        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.status(401).json({
                success: false,
                massage: "Token is expired, please try again.",
            });
        }


        // hash password and update in the db
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate({token: token},
            {password: hashedPassword},
            {new: true});

        // return res
        return res.status(200).json({
            success: true,
            massage: "Password reset successfully.",
        });
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            massage: err.message,
        });
    }
}