import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { buyCourse } from '../services/operations/studentsFeaturesAPI';
import {useNavigate, useParams} from "react-router-dom";

const CourseDetails = () => {
    const { token } = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {courseId} = useParams();
    
    
    const handleBuyCourse = () => {
        if (token) {
            buyCourse(token, [courseId], user, navigate, dispatch);
        }
    }
    return (
        <div className='flex items-center'>
            hello
            <button className='bg-yellow-50 p-6 mt-10 text-richblack-900'
                onClick={() => handleBuyCourse()}>
                Buy Now
            </button>
        </div>
    )
}

export default CourseDetails