const express = require("express");
const router = express.Router();

// import controllers
// courses
const {
    createCourse,
    getAllCourses,
    getCourseDetails
} = require("../controllers/Course");

// categories
const {
    showAllCategories,
    createCategory,
    categoryPageDetails
} = require("../controllers/Category");

// sections
const {
    createSection,
    updateSection,
    deleteSection
} = require("../controllers/Section");

// subSections
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/SubSection");

// rating and reviews
const {
    createRating,
    getAverageRating,
    getAllRating
} = require("../controllers/RatingAndReview");



// importing middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");



// course routes------------------->>>>>>>>>>>>>>>>>>>>>
// only instructor will create the course
router.post("/createCourse", auth, isInstructor, createCourse);
// only instructor will add section
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);
// subsection
router.post("addSubSection", auth, isInstructor, createSubSection);
router.post("updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// get all registered courses
router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseDetails);


// admin can create category
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategory", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);


// rating and reviews
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;
