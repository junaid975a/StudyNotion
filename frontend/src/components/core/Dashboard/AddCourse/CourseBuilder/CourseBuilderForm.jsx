import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import IconBtn from '../../../../common/IconBtn';
import { MdAddCircleOutline } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux';
import { BiRightArrow } from 'react-icons/bi';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import NestedView from './NestedView';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';

const CourseBuilderForm = () => {

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [editSectionName, setEditSectionName] = useState(null);
  const [loading, setLoading] = useState(false);

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  }

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one section");
      return;
    }
    if (course.courseContent.some((section) => section.subSection.length === 0)) {
      toast.error("Please add atleast one lecture in each section");
    }
    dispatch(setStep(3))
  }


  const onSubmit = async (data) => {
    setLoading(true);

    let result;

    if (editSectionName) {
      result = await updateSection({
        sectionName: data.sectionName,
        sectionId: editSectionName,
        courseId: course._id,
      },
        token);
    } else {
      result = await createSection({
        sectionName: data.sectionName,
        courseId: course._id,
      }, token)
    }

    // update values
    // console.log("date: ", data);
    // console.log("result: ",result);
    if(result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }

    // loading false
    setLoading(false);
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if(editSectionName === sectionId) {
      cancelEdit();
      return ;
    }
    console.log("function me aaya");
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName)
  }
  return (
    <div className='text-white'>
      <p>Course Builder</p>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="sectionName"> Section name<sup>*</sup></label>
          <input type="text"
            id='sectionName'
            placeholder='Add section name'
            {...register("sectionName", { required: true })}
            className='w-full form-style' />
          {
            errors.sectionName && (
              <span>Section name is required</span>
            )
          }
        </div>
        <div className='mt-10 flex'>
          <IconBtn
            type="submit"
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
            customClasses={"text-white"}
          >
            <MdAddCircleOutline className='text-yellow-50' size={20} />
          </IconBtn>

          {
            editSectionName && (
              <button type='button'
                onClick={cancelEdit}
                className='text-sm text-richblack-300 underline ml-10'>
                Cancel Edit
              </button>
            )
          }

        </div>
      </form>

      {
        course.courseContent.length > 0 && (
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
        )
      }

      <div className='flex justify-end gap-x-3 mt-10'>
        <button className='rounded-md cursor-pointer flex items-center'
          onClick={goBack}>Back</button>
        <IconBtn text="Next" onclick={goToNext} >
          <BiRightArrow />
        </IconBtn>
      </div>
    </div>
  )
}

export default CourseBuilderForm