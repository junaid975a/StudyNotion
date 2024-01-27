const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
// const { default: SubSectionModal } = require("../../frontend/src/components/core/Dashboard/AddCourse/CourseBuilder/SubSectionModal");


exports.createSection = async (req, res) => {
    try {
        // data fetch
        const { sectionName, courseId } = req.body;

        // data validate
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties",
            });
        }

        // create section
        const newSection = await Section.create({ sectionName });

        // update course with section_id
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            { new: true }
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        }).exec();
        // TODO: use populate, so that i can show section and subsection
        // return res
        return res.status(200).json({
            success: true,
            message: "Section Created Successfully",
            data: updatedCourseDetails,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Unable to create section, please try again",
            error: err.message,
        });
    }
}


exports.updateSection = async (req, res) => {
    try {
        // data fetch
        const { sectionName, sectionId, courseId } = req.body;
        

        // data validation
        if (!sectionId || !sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Details",
            });
        }



        // update data
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName }, 
            { new: true });

        const course = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            }).exec();

        // return res
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            data: course,
        });

    } catch (err) {
        return res.status(500), json({
            success: false,
            message: "Unable to update, please try again",
            error: err.message,
        })
    }
}


exports.deleteSection = async (req, res) => {
    try {
        // take data -> assuming that we are sending section in params
        const { sectionId, courseId } = req.body;
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        })
        const section = await Section.findById(sectionId);

        // validate
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing Details",
            });
        }
        await SubSection.deleteMany({ _id: { $in: section.subSection } });
        // delete the section
        await Section.findByIdAndDelete(sectionId);

        // delete from course schema
        // TODO[testing]: do we need to delete the entry from the schema->course
        //find the updated course and return 
        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })
            .exec();
        // return res
        return res.status(200).json({
            success: true,
            data: course,
            message: "Section deleted Successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete, please try again",
            error: err.message,
        })
    }
}