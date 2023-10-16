const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        trim: true,
        required: true,
    },
    courseDescription: {
        type: String,
        trim: true,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
        trim: true,
        required: true,
    },
    courseContext: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReviews",
        }
    ],
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    thumbnail: {
        type: String,
        trim: true,
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ]
});


module.exports = mongoose.model("Course", courseSchema);