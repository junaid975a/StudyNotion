const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSucessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
require("dotenv").config();

// initiate razorpay order
exports.capturePayment = async (req, res) => {

    const { courses } = req.body;
    const userId = req.user.id;

    if (courses.length === 0) {
        return res.json({
            success: false,
            message: "Please provide course id."
        });
    }

    let totalAmount = 0;
    for (const course_id of courses) {
        let course;
        try {
            course = await Course.findById(course_id);
            if (!course) {
                return res.json({
                    success: false,
                    message: "Could not find the course"
                });
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    message: "Student is already enrolled."
                });
            }

            totalAmount += course.price;
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: err.message,
            })
        }
    }

    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    console.log("options tak aaya?", options);

    try {
        const paymentResponse = await instance.orders.create(options);
        console.log("payment order ka response", paymentResponse);
        return res.status(200).json({
            success: true,
            message: paymentResponse
        })
    } catch (err) {
        console.log("payment order me fass gaya??", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.verifySignature = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;
    console.log("razorpay ki order_id:", razorpay_order_id);
    console.log("razorpay ki payment_id:", razorpay_payment_id);
    console.log("razorpay ki signature:", razorpay_signature);
    console.log("courses:", courses);
    console.log("user_id:", userId);

    if (!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses || !userId) {
        return res.status(401).json({
            success: false,
            message: "Payment failed.",
        })
    }


    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");
    if (expectedSignature === razorpay_signature) {
        // enroll student
        await enrollStudent(courses, userId, res);

        return res.status(200).json({
            success: true,
            message: "Payment Verified"
        });
    }
    return res.status(200).json({
        success: false,
        message: "Payment Failed",
    })
}

const enrollStudent = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide data for Course and UserId",
        });
    }

    for (const courseId of courses) {
        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true },
            )

            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course Not Found",
                });
            }

            // course-progress create kr rhe h
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })

            // find the student and add course to its enrolled courses.
            const enrolledStudent = await User.findByIdAndUpdate(userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id
                    }
                },
                { new: true });

            // send mail to student.
            const emailResponse = await mailSender(
                enrollStudent.email,
                `Successfully enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`)
            )

        } catch (err) {
            console.log("Error while enrolling the course", courseId);
            return res.status(500).json({
                success: false,
                message: err.message,
            })
        }
    }
}

exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;
    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required details",
        });
    }

    try {
        // find student
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100, orderId, paymentId)
        )
    } catch (err) {
        console.log("Error in sending mail", err);
        return res.status(500).json({
            success: false,
            message: "Could not send email",
        })
    }
}