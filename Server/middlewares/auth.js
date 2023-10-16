const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth
exports.auth = async (req, res, next) => {
    try {
        // extract token
        const token = req.cookies.token ||
            req.body.token ||
            req.header("Authorisation").replace("Bearer ", "");

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is missing",
            });
        }

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Token verification failed",
            });
        }

        next();

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
}


// isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            // console.log(err);
            return res.status(500).json({
                success: false,
                message: "Protected Route for Students only",
            });
        }
        next();

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
}


// isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            // console.log(err);
            return res.status(500).json({
                success: false,
                message: "Protected Route for Instructor only",
            });
        }
        next();

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            // console.log(err);
            return res.status(500).json({
                success: false,
                message: "Protected Route for Admin only",
            });
        }
        next();

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        });
    }
}

