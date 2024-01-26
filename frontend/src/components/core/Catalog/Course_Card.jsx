import React, { useEffect, useState } from 'react'
import getAvgRating from '../../../utils/avgRating';
import { Link } from "react-router-dom";
import RatingStar from "../../common/RatingStar"

const Course_Card = ({ course, height }) => {
    const [avgRatingCount, setAvgReviewCount] = useState(0);

    useEffect(() => {
        const count = getAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    }, [course]);
    return (
        <>
            <Link to={`/courses/${course._id}`}>
                <div>
                    <div className='rounded-lg'>
                        <img src={course?.thumbnail} alt="course thumnail"
                         className={`${height} w-full rounded-xl object-cover`} />
                    </div>
                    <div className='flex flex-col gap-2 px-1 py-3'>
                        <p className='text-xl text-richblack-5'>{course?.courseName}</p>
                        <p className='text-sm text-richblack-50'>{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                        <div className='flex items-center gap-2'>
                            <span className='text-yellow-5'>{avgRatingCount}</span>
                            <RatingStar reviewCount={avgRatingCount} />
                            <span className='text-richblack-400'>{course?.ratingAndReviews?.length} Ratings</span>
                        </div>
                        <p className='text-xl text-richblack-5'>Rs. {course?.price}</p>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default Course_Card