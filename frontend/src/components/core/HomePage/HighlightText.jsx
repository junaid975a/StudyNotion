import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";


const HighlightText = ( { text }) => {


    return (
        <span className="font-bold text-richblue-200">
            {text}
        </span>
    )
}

export default HighlightText;