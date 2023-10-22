const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");


// capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
    try {
        // get data
        const { course_id } = req.body;
        const userId = req.User.id;

        // validation
        if (!course_id) {
            return res.status(400).json({
                success: false,
                message: "Provide valid courseId",
            });
        }

        // valid courseDetails
        let course;
        try {
            course = await Course.findById(course_id);
            if (!course) {
                return res.status(400).json({
                    success: false,
                    message: "Could not find the course",
                });
            }

            // check if user already paid
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(400).json({
                    success: false,
                    message: "Student is already enrolled",
                });
            }
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }


        // order create
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId: course_id,
                userId,
            }
        };

        try {
            // initiate the payment, using razorpay
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);

            return res.status(200).json({
                success: true,
                courseName: course.courseName,
                courseDesctiption: course.courseDescription,
                thumbnail: course.thumbnail,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Could not initiate the order",
            });
        }

        // return res
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


exports.verifySignature = async (req, res) => {
    try {
        const webhookSecret = "12345678";

        const signature = req.headers["x-razorpay-signature"];

        const shasum = crypto.createHmac("sha256", webhookSecret);
        shasum.update(JSON.stringify(req.body));

        const digest = shasum.digest("hex");

        if (signature === digest) {
            console.log("Payment is Authorised");

            const { userId, courseId } = req.body.payload.payment.entity.notes;

            try {
                // student enroll in course
                const enrolledCourse = await Course.findOneAndUpdate(
                    { _id: courseId },
                    { $push: { studentsEnrolled: userId } },
                    { new: true },
                );

                if (!enrolledCourse) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: "course not found",
                    });
                }

                console.log(enrolledCourse);

                const enrolledStudent = await User.findOneAndUpdate(
                    { _id: userId },
                    { $push: { courses: courseId } },
                    { new: true },
                );

                // mail send kardo
                const emailResponse = await mailSender(
                    enrolledStudent.email,
                    "Congratulations, from codehelp",
                    "Congratulations, you are onboarded into new codehelp course",
                );

                console.log(emailResponse);

                return res.status(200).json({
                    success: true,
                    message: "Student enrolled successfully",
                });
            } catch (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid request",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}