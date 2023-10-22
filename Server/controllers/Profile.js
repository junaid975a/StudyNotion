const Profile = require("../models/Profile");
const User = require("../models/User");


exports.updateProfile = async (req, res) => {
    try {
        // get details
        const { dateOfBirth = "", about = "", contactNumber } = req.body;
        const id = req.user.id;

        // validate
        if (!contactNumber || !id) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required",
                error: err.message,
            });
        }

        // get profile details
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // update profile 
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        // return res
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Cannot update profile, please try again",
            error: err.message,
        });
    }
}

// TODO: how can we schedule the deletion of account
exports.deleteAccount = async (req, res) => {
    try {
        // get id
        const id = req.user.id;

        // validation
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist",
                error: err.message,
            });
        }

        // delete profile
        const profileId = user.additionalDetails;
        await Profile.findByIdAndDelete({ _id: profileId });

        // delete user
        await User.findByIdAndDelete({ _id: id });

        // HW: unenroll user from all enrolled courses.

        // return res
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Cannot delete profile, please try again",
            error: err.message,
        });
    }
}


exports.getAllUserDetails = async (req, res) => {
    try {
        // get id
        const id = req.user.id;

        // validation
        const user = await User.findById(id).
            populate("additionalDetails").
            exec();
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist",
                error: err.message,
            });
        }

        // return res
        return res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: user
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Cannot get profile details, please try again",
            error: err.message,
        });
    }
}