import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import { RxCross1 } from 'react-icons/rx';
import Upload from '../Upload';

const SubSectionModal = ({ modalData, setModalData, add = false, view = false, edit = false }) => {
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

        if(currentValues.lectureTitle !== modalData.title) {
            formData.append("title", currentValues.lectureTitle);
        }
        if(currentValues.lectureDesc !== modalData.description) {
            formData.append("description", currentValues.lectureDesc);
        }
        if(currentValues.lectureVideo !== modalData.videoUrl) {
            formData.append("video", currentValues.lectureVideo);
        }
        setLoading(true);
        try {
            const result = await updateSubSection(formData, token);
            if(result) {
                dispatch(setCourse(result));
            }
        } catch(err) {
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
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc);
        formData.append("video", data.lectureVideo);
        setLoading(true);
        try {
            const result = await createSubSection(formData, token);
            if(result) {
                dispatch(setCourse(result));
            }
        } catch(err) {
            console.log("Error while adding subsection: ", err);
        }
        setLoading(false);
        setModalData(null);
    }
    return (
        <div>
            <div>
                <div>
                    <p>{view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture</p>
                    <button>
                        <RxCross1 onClick={!loading ? setModalData(null) : {}}/>
                    </button>
                </div>

                <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <Upload name="lectureVideo"
                        label="Lecture Video"
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        video={true}
                        viewData={view ? modalData.videoUrl : null}
                        editData={edit ? modalData.videoUrl : null}/>
                </form>
            </div>
        </div>
    )
}

export default SubSectionModal