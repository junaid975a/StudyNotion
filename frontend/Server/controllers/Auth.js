const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();


// otp send
exports.sendotp = async (req, res) => {
    try {
        // email nikala from req ki body
        const { email } = req.body;

        // check if user already exist
        const checkUserPresent = await User.findOne({ email });

        // if user exists already, return a response
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        // generate OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated");

        // check unique otp or not
        // ye chillar logic h, 
        // comapnies me iski jagah advanced libraries use hoti h
        const result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };

        // create an entry in DB
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
            otp,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


// signup
exports.signUp = async (req, res) => {
    try {
        // fetch data from req ki body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        // validate
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            // console.log(firstName)
            // console.log(lastName)
            // console.log(email)
            // console.log(password)
            // console.log(confirmPassword)
            // console.log(otp)
            return res.status(403).json({
                success: false,
                massage: "All fields are required.",
            });
        }

        // match passwords
        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                massage: "Password and Confirm-Password does not match.",
            });
        }

        // check user exists
        const checkUserPresent = await User.findOne({ email });

        // if user exists already, return a response
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        // find most resent otp for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        // console.log("otp: ",otp);
        // console.log("recent otp: ",recentOtp);
        // console.log(recentOtp[0].otp);
        // validate otp
        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        } else if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "invalid OTP",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        let approved = ""
        approved === "Instructor" ? (approved = false) : (approved = true)

        // create user
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: "",
        })

        // return res
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            user,
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


// login
exports.login = async (req, res) => {
    try {
        // get data from req ki body
        const { email, password } = req.body;

        // data validation
        // validate
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                massage: "All fields are required.",
            });
        }

        // check user
        const user = await User.findOne({ email }).populate("additionalDetails");

        // if user exists already, return a response
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signup first",
            });
        }

        // check password
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            // login -->generate JWT
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });
            user.token = token;
            user.password = undefined;

            // create cookie
            const Options = {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, Options).status(200).json({
                success: true,
                token,
                user,
                message: "User Login sucessfully",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Password incorrect",
            });
        }

        // send response
        // return res;
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Login Failed, please try again",
        });
    }
}


// change password
exports.changePassword = async (req, res) => {
    try {
        // get current user details from request
        const userDetails = await User.findById(req.user.id);
        const { oldPassword, newPassword } = req.body;

        // validate old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Password is incorrect",
            });
        }


        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        );

        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response);
        } catch (err) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", err);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: err.message,
            });
        }

        // Return success response
        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully" });

    } catch (err) {
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while updating password:", err);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: err.message,
        });
    }
}

