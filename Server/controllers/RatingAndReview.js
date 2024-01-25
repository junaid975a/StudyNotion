const RatingAndReviews = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");


// createRating
exports.createRating = async (req, res) => {
    try {
        // get userId, fetch data, get courseId
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;

        // validations, verification
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } }
        });
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Student is not enrolled in the course`,
                error: error.message,
            });
        }


        // check old reviewof the user
        const alreadyReviewed = await RatingAndReviews.findOne({
            user: userId,
            course: courseId,
        });
        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: `Course is already reviewed by the user`,
                error: error.message,
            });
        }

        // create rating
        const ratingReview = await RatingAndReviews.create({
            user: userId,
            rating: rating,
            review: review,
            course: courseId,
        });


        // add rating to the course
        const updatedCourseDetails = await Course.findByIdAndUpdate({ _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            { new: true });

        console.log(updatedCourseDetails);

        // return res
        return res.status(200).json({
            success: true,
            message: `Rating and Review added`,
            ratingReview
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Can't Create Rating`,
            error: err.message,
        });
    }
}


// getAvgRating
exports.getAverageRating = async (req, res) => {
    try {
        // course if fetch karo
        const courseId = req.body.courseId;

        // total ratings nikalo, avg calculate karo
        const result = await RatingAndReviews.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                },
            }
        ]);

        const allReviews = await RatingAndReviews.find({_id: courseId})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();


        // return rating
        if (resultlength > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
                allReviews: allReviews,
            });
        }

        // if no rating exists
        return res.status(200).json({
            success: true,
            message: "Average Rating is 0, not ratings were given till now",
            averageRating: 0,
            allReviews: allReviews,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Can't fetch average Rating`,
            error: err.message,
        });
    }
}


// getAllRating
exports.getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReviews.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: `All ratings collected successfully`,
            data: allReviews,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Can't fetch Ratings`,
            error: err.message,
        });
    }
}


// getRatings based on course
// exports.getCourseRating = async (req, res) => {
//     try {
//         const courseId = req.body.courseId;
//         const allReviews = await RatingAndReviews.find({_id: courseId})
//             .sort({ rating: "desc" })
//             .populate({
//                 path: "user",
//                 select: "firstName lastName email image",
//             })
//             .populate({
//                 path: "course",
//                 select: "courseName",
//             })
//             .exec();

//         return res.status(200).json({
//             success: true,
//             message: `All course ratings collected successfully`,
//             allReviews: allReviews,
//         });

//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: `Can't fetch Ratings`,
//             error: err.message,
//         });
//     }
// }