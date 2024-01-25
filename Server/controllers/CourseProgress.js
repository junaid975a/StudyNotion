const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");

exports.updateCourseProgress = async(req, res) => {
    const {courseId, subSectionId} = req.body;
    const userId = req.user.id;

    try {
        // check subsection valid or not
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection) {
            return res.status(400).json({
                success: false,
                error: "invalid subsection",
            })
        }

        // check for old entry
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        });

        if(!courseProgress) {
            return res.status(404).json({
                success: false,
                error: "Course Progress does not exist",
            })
        } else {
            // check for re-completing video
            if(courseProgress.completedVideos.includes(subSectionId)) {
                return res.status(400).json({
                    success: false,
                    error: "Video already completed",
                })
            }

            // push changes to DB
            courseProgress.completedVideos.push(subSectionId);  
            console.log("course progress push done");  
        }
        await courseProgress.save();
        console.log("course progress save done");
        return res.status(200).json({
            success: true,
            message: "updated successfully",
        })
    } catch(err) {
        return res.status(500).json({
            success: false,
            error: "internal server error",
        })
    }
}