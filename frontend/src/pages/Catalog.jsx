import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import Footer from '../components/common/Footer';
import CourseSlider from "../components/core/Catalog/CourseSlider"
import Course_Card from '../components/core/Catalog/Course_Card';

const Catalog = () => {
    const { catalogName } = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    useEffect(() => {
        const getCategories = async () => {
            try {
                // console.log("get-categories me aaya");
                const res = await apiConnector("GET", categories.CATEGORIES_API);
                // console.log("ye result mila-->>", res);
                const category_id = res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
                setCategoryId(category_id);
                // console.log(category_id)
            } catch (err) {
                console.log("Error while fetching category : ", err);
            }
        }
        getCategories();
    }, [catalogName]);

    useEffect(() => {
        const getCategoryDetails = async () => {
            try {
                // console.log("is category ke liye data lene gaya -> ", categoryId);
                const res = await getCatalogPageData(categoryId);
                // console.log("Printing res: ", res);
                setCatalogPageData(res);
            } catch (err) {
                console.log("Error while fetching category details: ", err);
            }
        }
        if (categoryId) {
            getCategoryDetails();
        }
    }, [categoryId])
    return (
        <div className='text-white'>
            <div>
                <p>{`Home / Catalog / `}
                    <span>
                        {catalogPageData?.data?.selectedCategory?.name}
                    </span></p>
                <p> {catalogPageData?.data?.selectedCategory?.name} </p>
                <p> {catalogPageData?.data?.selectedCategory?.description}</p>
            </div>

            <div>
                {/* section 1 */}
                <div>
                    <div>Courses to get you started</div>
                    <div className=' flex gap-x-3'>
                        <p>Most Popular</p>
                        <p>New</p>
                    </div>
                    <div>
                        <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
                    </div>
                </div>

                {/* section2 */}
                <div>
                    <div>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</div>
                    <div>
                        <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses} />
                    </div>
                </div>

                {/* section3 */}
                <div>
                    <div>Frequently Bought</div>
                    <div className='py-8'>

                        <div className='grid grid-cols-1 lg:grid-cols-2'>

                            {
                                catalogPageData?.data?.mostSellingCourses?.slice(0, 4)
                                    .map((course, index) => (
                                        <Course_Card course={course} key={index} Height={"h-[400px]"} />
                                    ))
                            }

                        </div>

                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Catalog