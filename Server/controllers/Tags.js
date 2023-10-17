const Tag = require("../models/Tags");

// create tags
exports.createTag = async (req, res) => {
    try {
        // fetch data
        const { name, description } = req.body;

        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // create entry in DB
        const tagDetails = await Tag.create({
            name: name,
            description: description,
        });


        return res.status(200).json({
            success: true,
            message: "Tag Created Successfully",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};



// get all tags
exports.showAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({},
            { name: true, description: true });

        return res.status(200).json({
            success: false,
            message: "All Tags returned successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
            data: allTags,
        });
    }
}