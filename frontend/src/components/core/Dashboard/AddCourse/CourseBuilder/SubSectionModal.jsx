import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {toast} from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import { RxCross1 } from 'react-icons/rx';
import Upload from '../Upload';
import IconBtn from "../../../../common/IconBtn"

const SubSectionModal = ({ modalData, 
    setModalData, 
    add = false, 
    view = false, 
    edit = false 
}) => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors }
    } = useForm();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (view || edit) {
            setValue("lectureTitle", modalData.title);
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.videoUrl);
        }
    }, []);

    const isFromUpdated = () => {
        const currentValues = getValues();
        if (currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl) {
            return true;
        }
        return false;
    }


    const handleEditSubSection = async () => {
        const currentValues = getValues();
        const formData = new FormData();
        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if (currentValues.lectureTitle !== modalData.title) {
            formData.append("title", currentValues.lectureTitle);
        }
        if (currentValues.lectureDesc !== modalData.description) {
            formData.append("description", currentValues.lectureDesc);
        }
        if (currentValues.lectureVideo !== modalData.videoUrl) {
            formData.append("video", currentValues.lectureVideo);
        }
        setLoading(true);
        try {
            const result = await updateSubSection(formData, token);
            if (result) {
                const updatedCourseContent = course?.courseContent?.map((section) => 
                    section._id === modalData.sectionId ? result : section);
                const updatedCourse = {...course, courseContent: updatedCourseContent};
                dispatch(setCourse(updatedCourse));
                // dispatch(setCourse(result));
            }
        } catch (err) {
            console.log("Error while Editing subsection: ", err);
        }
        setLoading(false);
        setModalData(null);
    }

    const onSubmit = async (data) => {
        if (view) return;
        else if (edit) {
            if (!isFromUpdated) {
                toast.error("No changes made to the form");
            } else {
                // edit krdo
                handleEditSubSection();
            }
            return;
        }

        const formData = new FormData();
        formData.append("sectionId", modalData);
        // console.log(formData.get("sectionId"))
        formData.append("title", data.lectureTitle);
        // console.log(formData.get("title"))
        formData.append("description", data.lectureDesc);
        // console.log(formData.get("description"))
        formData.append("video", data.lectureVideo);
        // console.log(formData.get("video"))
        // console.log(formData.data);
        setLoading(true);
        try {
            const result = await createSubSection(formData, token);
            console.log("create subsection ka output: ", result);
            if (result) {
                const updatedCourseContent = course?.courseContent?.map((section) => 
                    section._id === modalData ? result : section);
                const updatedCourse = {...course, courseContent: updatedCourseContent};
                dispatch(setCourse(updatedCourse));
                console.log("updated course print krwa raha hu bhai",updatedCourse);
                // dispatch(setCourse(result));
            }
        } catch (err) {
            console.log("Error while adding subsection: ", err);
        }
        setLoading(false);
        setModalData(null);
    }
    return (
        <div className=''>
            <div className=''>
                <div className=''>
                    <p className=''>{view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture</p>
                    <button>
                        <RxCross1 onClick={() => !loading ? setModalData(null) : {}} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Upload name="lectureVideo"
                        label="Lecture Video"
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        video={true}
                        viewData={view ? modalData.videoUrl : null}
                        editData={edit ? modalData.videoUrl : null} />

                    <div>
                        <label htmlFor="lectureTitle">Lecture Title</label>
                        <input type="text"
                            id='lectureTitle'
                            placeholder='Enter lecture Title'
                            {...register("lectureTitle", { required: true })}
                            className='w-full form-style' />
                        {errors.lectureTitle && (
                            <span>
                                Lecture Title is required
                            </span>
                        )}
                    </div>
                    <div>
                        <label htmlFor="description">Lecture Description</label>
                        <textarea id="lectureDesc"
                            placeholder='Enter Lecture Description'
                            {...register("lectureDesc", { required: true })}
                            className='w-full min-h-[130px] form-style' />
                        {
                            errors.lectureDesc && (
                                <span>
                                    Lecture Description is required
                                </span>
                            )
                        }
                    </div>
                    {
                        !view && (
                            <div>
                                <IconBtn 
                                    text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
                                />
                            </div>
                        )
                    }
                </form>
            </div>
        </div>
    )
}

export default SubSectionModal