const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// otp send
exports.sendOTP = async (req, res) => {
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

        // validate otp
        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        } else if (otp !== recentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "invalid OTP",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.has(password, 10);

        // create user
        const profileDetails = await Proile.create({
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
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
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
        const user = await User.findOne({ email });

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
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            // create cookie
            const Options = {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, Options).status(200).json({
                success: true,
                token,
                user,
                message: "logged in sucessfully",
            })
        } else {
            console.log(err);
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
exports.changePassword = async(req, res) => {
    try {
        // get current user details from request
        const{ oldPassword, newPassword, confirmNewPassword } = req.body;

        // compare new passwords.
        if(newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm new password do not match.",
            });
        }

        const user = req.user;
        // check if current password is correct
        if(await bcrypt.compare(oldPassword, user.password)) {
            // Hash the new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password in the database
            user.password = hashedNewPassword;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Password changed successfully.",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect.",
            });
        }

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to change the password. Please try again.",
        });
    }
}

