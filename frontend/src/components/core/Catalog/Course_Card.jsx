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
        <div>
            <Link to={`/courses/${course._id}`}>
                <div>
                    <div>
                        <img src={course?.thumbnail} alt="" className={`${height} w-full rounded-xl object-cover`} />
                    </div>
                    <div>
                        <p>{course?.courseName}</p>
                        <p>{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                        <div className='flex gap-x-3'>
                            <span>{avgRatingCount || 0}</span>
                            <RatingStar reviewCount={avgRatingCount} />
                            <span>{course?.ratingAndReviews?.length} Ratings</span>
                        </div>
                        <p>{course?.price}</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Course_Card