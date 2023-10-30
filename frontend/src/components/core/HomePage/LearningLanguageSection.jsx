import React from "react";
import HighlightText from "./HighlightText";
import KnowYourProgress from "../../../assets/Images/Know_your_progress.png";
import compareWithOthers from "../../../assets/Images/Compare_with_others.png";
import planYourLessons from "../../../assets/Images/Plan_your_lessons.png";
import CTAButton from "../HomePage/Button";


const LearningLanguageSection = () => {
    return (
        <div className="mt-[150px] mb-16">
            <div className="flex flex-col gap-5 items-center">

                <div className="text-4xl font-semibold text-center">
                    Your Swiss Knife for
                    <HighlightText text={" Learning any Language"} />
                </div>
                <div className="text-center text-richblack-600  mx-auto text-base w-[70%]">
                    Using spin making learning multiple languages easy.
                    with 20+ languages realistic voice-over, progress tracking,
                    custom schedule and more.
                </div>

                <div className="flex flex-row items-center justify-center mt-5">
                    <img src={KnowYourProgress}
                        className="object-contain -mr-32" alt="" />
                    <img src={compareWithOthers}
                        className="object-contain" alt="" />
                    <img src={planYourLessons}
                        className="object-contain -ml-36" alt="" />
                </div>
                <div className="w-fit ">
                    <CTAButton active={true} linkto={"/signup"}>Learn more</CTAButton>
                </div>


            </div>

        </div>
    )
}

export default LearningLanguageSection;