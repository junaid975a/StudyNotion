const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();


exports.createSubSection = async (req, res) => {
    try {
        // fetch data
        const { sectionId, title, timeDuration, description } = req.body;

        // extract file/video
        const video = req.files.videoFile;

        // validate data
        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // create subsection
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url
        });

        // update the subsection in section
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
            {
                $push: {
                    subSection: subSectionDetails._id,
                }
            }, 
            { new: true }).populate("subSection");
        // HW: log updated section here after adding populate query

        // return res
        return res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            updatedSection,
        });
        
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Unable to create the subsection",
            error: err.message,
        });
    }
}


// update subsection

// delete subsection