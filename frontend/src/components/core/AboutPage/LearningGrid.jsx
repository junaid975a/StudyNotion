import React from "react";
import CTAButton from "../../core/HomePage/Button"
import HighlightText from "../../core/HomePage/HighlightText"

const data = [
    {
        order: -1,
        heading: "heading",
        highlightedText: " abcd",
        description: "description abcdefgh",
        BtnText: "Learn More",
        BtnLink: "/"
    },
    {
        order: 1,
        heading: "heading",
        description: "description abcdefgh"
    },
    {
        order: 2,
        heading: "heading",
        description: "description abcdefgh"
    },
    {
        order: 3,
        heading: "heading",
        description: "description abcdefgh"
    },
    {
        order: 4,
        heading: "heading",
        description: "description abcdefgh"
    },
    {
        order: 5,
        heading: "heading",
        description: "description abcdefgh"
    },
]

const LearningGrid = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 mb-10 p-5 lg:w-fit">
            {
                data.map((card, index) => {
                    return (
                        <div
                            key={index}
                            className={`${index===0 && "lg:col-span-2 lg:h-[280px] bg-richblack-900 p-5"}
                            ${
                                card.order % 2 === 1 ? "bg-richblack-700 lg:h-[280px] p-5" : "bg-richblack-800 lg:h-[280px] p-5"
                            }
                            ${
                                card.order == 3 && "lg:col-start-2"
                            }`}>
                                {
                                    card.order < 0 
                                    ?
                                    (<div className="lg:w-[90%] flex flex-col pb-5 gap-3">
                                        <div className="text-4xl font-semibold">
                                            {card.heading}
                                            <HighlightText text={card.highlightedText} />
                                        </div>
                                        <p className="font-medium">{card.description}</p>
                                        <div className="w-fit">
                                            <CTAButton active={true} linkto={card.BtnLink}>
                                                {card.BtnText}
                                            </CTAButton>
                                        </div>
                                    </div>) 
                                    :
                                    (<div className="flex flex-col justify-center items-center gap-8 p-7">
                                        <h1 className="text-richblack-5 text-lg">
                                            {card.heading}
                                        </h1>
                                        <p className="text-richblack-300  font-medium">
                                            {card.description}
                                        </p>

                                    </div>)
                                }

                        </div>
                    )
                })
            }

        </div>
    )
}

export default LearningGrid;