import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { resetPassword } from "../services/operations/authAPI";

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const { loading } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { password, confirmPassword } = formData

    const handleOnChange = (e) => {
        setFormData((prev) => (
            {
                ...prev,
                [e.target.name]: e.target.value,
            }
        ))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password, confirmPassword, token, navigate));
    }
    return (
        <div className="text-white">
            {
                loading ? (
                    <div>
                        Loading..
                    </div>
                ) :
                    (
                        <div>
                            <h1>Choose new password</h1>
                            <p>Almost done. Enter your new password and youre all set.</p>
                            <form onSubmit={handleOnSubmit}>
                                <label>
                                    <p>New password</p>
                                    <input type={showPassword ? "text" : "password"}
                                        required
                                        name="password"
                                        value={password}
                                        onChange={handleOnChange}
                                        placeholder="New Password"
                                        className="text-richblack-5 w-full p-2 bg-richblack-600"
                                    />
                                    <span onClick={() => setShowPassword((prev) => !prev)}>
                                        {
                                            showPassword ? <AiFillEyeInvisible fontSize={24} /> : <AiFillEye fontSize={24} />
                                        }
                                    </span>
                                </label>

                                <label >
                                    <p>Confirm new password</p>
                                    <input type={showConfirmPassword ? "text" : "password"}
                                        required
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={handleOnChange}
                                        placeholder="Confirm Password"
                                        className="text-richblack-5 w-full p-2 bg-richblack-600"
                                    />
                                    <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                        {
                                            showConfirmPassword ? <AiFillEyeInvisible fontSize={24} /> : <AiFillEye fontSize={24} />
                                        }
                                    </span>
                                </label>

                                <button type="submit">Reset Password</button>
                            </form>
                            <div>
                                <Link to="/login">
                                    <p>Back to Login</p>
                                </Link>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}

export default UpdatePassword;