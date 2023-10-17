const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader")


// create course
exports.createCourse = async (req, res) => {
    try {
        // fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;
        const thumbnail = req.files.thumbnailImage;


        // validation
        if (!courseName || !courseDescription || !whatYouWillLearn ||
            !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }


        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById({ userId });
        console.log("instructorDetails: ", instructorDetails);
        // TODO: userId === instructorDetails._id are same ?

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor details not found",
            });
        }


        // check given tag is valid or not
        const tagDetails = await Tag.findById({ tag });
        if (!tagDetails) {
            return res.status(404).json({
                success: false,
                message: "Tag details not found",
            });
        }


        // image upload to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);


        // create course in db
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });


        // enter course to user schema
        await User.findByIdAndUpdate({ _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true },
        );


        // add course entry to tag
        // TODO: HW
        await Tag.findByIdAndUpdate({ _id: tagDetails._id },
            {
                $push: {
                    course: newCourse._id,
                }
            },
            { new: true },
        );

        // return res
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


// fetch all course
exports.showAllCourses = async (req, res) => {
    try {
        // Fetch all courses from the Course model
        // const allCourses = await Course.find({},
        //     {
        //         courseName: true, price: true, thumbnail: true, instructor: true,
        //         ratingAndReviews: true, studentsEnrolled: true
        //     }).populate("instructor").exec();
        const allCourses = await Course.find({});

        // Check if there are no courses
        if (allCourses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found",
            });
        }

        // If there are courses, return them as a response
        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: allCourses,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
