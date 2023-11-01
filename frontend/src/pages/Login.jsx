import React from "react";
import Template from "../components/core/LoginSignupPage/LoginSignupTemplate";
import loginImg from '../assets/Images/login.webp';

const Login = ({setIsLoggedIn}) => {
    return (
        
            <Template
                title="Welcome Back"
                des1="Build skills for today, tomorrowand beyond."
                des2="Education to future-proof your career."
                image={loginImg}
                formtype="login"
                setIsLoggedIn={setIsLoggedIn}/>
        
    )
}

export default Login; 