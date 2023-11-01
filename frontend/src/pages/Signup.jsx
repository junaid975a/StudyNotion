import React from "react";
import signupImg from '../assets/Images/signup.webp';
import Template from "../components/core/LoginSignupPage/LoginSignupTemplate";

const Signup = ({setIsLoggedIn}) => {
    return (
        <Template
        title="Join the millions learning to code with StudyNotion for free."
        des1="Build skills for today, tomorrowand beyond."
        des2="Education to future-proof your career."
        image={signupImg}
        formtype="signup"
        setIsLoggedIn={setIsLoggedIn}/>
    )
}

export default Signup;