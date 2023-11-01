import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = ({ setIsLoggedIn }) => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const navigate = useNavigate();

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [accountType, setAccountType] = useState("student")

    function changeHandler(event) {
        setFormData((prev) => (
            {
                ...prev,
                [event.target.name]: event.target.value
            }
        ))
    }

    function submitHandler(event) {
        event.preventDefault();

        if (formData.password != formData.confirmPassword) {
            // toast.error("Passwords do not match");
            return;
        }
        setIsLoggedIn(true);
        // toast.success("Account Created");

        const accountData = {
            ...formData
        }

        const finalData = {
            ...accountData,
            accountType
        }

        console.log(finalData);
        navigate("/dashboard");
    }
    return (
        <div>
            {/* stud-instr tab */}
            <div className="flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max">
                <button onClick={()=> setAccountType("student")}
                    className={`${accountType === 'student' ?
                                "bg-richblack-900 text-richblack-5" :
                                "bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}>
                    Student
                </button>
                <button onClick={()=> setAccountType("instructor")}
                    className={`${accountType === 'instructor' ?
                    "bg-richblack-900 text-richblack-5" :
                    "bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}>
                    Instructor
                </button>
            </div>

            <form onSubmit={submitHandler}
                className="flex flex-col w-full gap-y-4">
                <div className="flex gap-x-4 w-full">
                    <label className="w-full">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">First Name<sup className="text-pink-200">*</sup></p>
                        <input
                            type="text"
                            required
                            name="firstName"
                            onChange={changeHandler}
                            placeholder="Enter First Name"
                            value={formData.firstName}
                            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5
                        w-full p-[12px]"
                        />
                    </label>

                    <label className="w-full">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Last Name<sup className="text-pink-200">*</sup></p>
                        <input
                            type="text"
                            required
                            name="lastName"
                            onChange={changeHandler}
                            placeholder="Enter Last Name"
                            value={formData.lastName}
                            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5
                        w-full p-[12px]"
                        />
                    </label>
                </div>

                <label className="w-full">
                    <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Email Address<sup className="text-pink-200">*</sup></p>
                    <input
                        type="email"
                        required
                        name="email"
                        onChange={changeHandler}
                        placeholder="Enter Email Address"
                        value={formData.email}
                        className="bg-richblack-800 rounded-[0.5rem] text-richblack-5
                        w-full p-[12px]"
                    />
                </label>

                <div className="flex gap-x-4">
                    <label className="w-full relative">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Create Password<sup className="text-pink-200">*</sup></p>
                        <input
                            type={showPassword1 ? ("text") : ("password")}
                            required
                            name="password"
                            onChange={changeHandler}
                            placeholder="Enter password"
                            value={formData.password}
                            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5
                        w-full p-[12px]"
                        />
                        <span onClick={() => setShowPassword1((prev) => !prev)}
                            className="absolute right-3 top-[38px] cursor-pointer">
                            {
                                showPassword1 ? (<AiOutlineEyeInvisible fontSize={24} fill="#afb2bf" />) : (<AiOutlineEye fontSize={24} fill="#afb2bf" />)
                            }
                        </span>
                    </label>

                    <label className="w-full relative">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Confirm Password<sup className="text-pink-200">*</sup></p>
                        <input
                            type={showPassword2 ? ("text") : ("password")}
                            required
                            name="confirmPassword"
                            onChange={changeHandler}
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5
                        w-full p-[12px]"
                        />
                        <span onClick={() => setShowPassword2((prev) => !prev)}
                            className="absolute right-3 top-[38px] cursor-pointer">
                            {
                                showPassword2 ? (<AiOutlineEyeInvisible fontSize={24} fill="#afb2bf" />) : (<AiOutlineEye fontSize={24} fill="#afb2bf" />)
                            }
                        </span>
                    </label>
                </div>

                <button className="w-full bg-yellow-50 rounded-[8px] font-medium text-black
                px-[12px] py-[8px] mt-6">
                    Create Account
                </button>
            </form>

        </div>
    )
}

export default SignupForm;