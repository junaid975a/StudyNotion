import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword = () => {

    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const { loading } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent))
    }
    return (
        <div className="text-white flex justify-center items-center">
            <div className="flex justify-center items-center w-[380px] mt-[20%]">
                {
                    loading ?
                        (<div> Loading.. </div>)
                        :
                        (<div>
                            <h1>
                                {
                                    !emailSent ? "Reset Your Password" : "Check Your Email"
                                }
                            </h1>
                            <p>
                                {
                                    !emailSent ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                                        :
                                        `We have sent the reset email to ${email}`
                                }
                            </p>

                            <form onSubmit={handleOnSubmit} className="flex flex-col justify-center items-center">
                                {
                                    !emailSent && (
                                        <label>
                                            <p>Email Address: </p>
                                            <input type="email" required
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter Your Email Address" />
                                        </label>
                                    )
                                }
                                <button className="bg-yellow-50 text-richblack-900 w-fit px-8 py-2 rounded-md mt-4" type="submit">
                                    {
                                        !emailSent ? "Reset Password" : "Resend Email"
                                    }
                                </button>
                            </form>

                            <div>
                                <Link to="/login" >
                                    <p>Back to Login</p>
                                </Link>
                            </div>
                        </div>)
                }
            </div>
        </div>
    )
}

export default ForgotPassword;