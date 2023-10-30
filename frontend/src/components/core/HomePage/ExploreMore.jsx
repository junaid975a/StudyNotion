import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighlightText from "./HighlightText";
import CourseCard from "../HomePage/CourseCard";

const tabNames = [
    "Free",
    "New to Coding",
    "Most Popular",
    "Skill Paths",
    "Career Paths",
]

const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabNames[0]);
    const [courses, setCourse] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCard = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourse(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }

    return (
        <div>
            <div className="text-4xl font-semibold text-center">
                Unlock the <HighlightText text={"Power of Code"} />
            </div>
            <p className="text-richblack-300 text-center text-md mt-3">
                Learn to build anything you can imagine
            </p>

            <div className="flex flex-row gap-3 items-center rounded-full bg-richblack-800 mb-5 mt-5 border-richblack-100 px-1 py-1">

                {
                    tabNames.map((tab, index) => {
                        return (
                            <div
                                className={`text-[16px] 
                                ${currentTab===tab ? 
                                "bg-richblack-900 text-richblack-5 font-medium" : 
                                " text-richblack-200"} 
                                rounded-full transition-all duration-200 cursor-pointer
                                hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                                key={index}
                                onClick={() => setMyCard(tab)}>

                                {tab}

                            </div>
                        )
                    })
                }

            </div>
            <div className="lg:h-[150px]"></div>
            {/* course cards ka grp */}
            <div className="absolute flex flex-row gap-10 justify-between w-full">
                {
                    courses.map((course, index) => {
                        return (
                            <div>
                                <CourseCard key={index}
                                cardData={course}
                                currentCard={currentCard}
                                setCurrentCard={setCurrentCard}/>
                            </div>
                        )
                    })
                }
                

            </div>


        </div>
    )
}

export default ExploreMore;