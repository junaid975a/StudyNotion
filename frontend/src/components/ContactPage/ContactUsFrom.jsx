import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { apiConnector } from "../../services/apiconnector"
import { contactusEndpoint } from "../../services/apis"
import CountryCode from "../../data/countrycode.json"

const ContactUsFrom = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm();

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({
                email: "",
                firstname: "",
                lastname: "",
                message: "",
                phoneNo: "",
            })
        }
    }, [reset, isSubmitSuccessful])


    const submitContactFrom = async (data) => {
        console.log("logging data", data)
        try {
            setLoading(true);
            const response = await apiConnector(
                                        "POST", 
                                        contactusEndpoint.CONTACT_US_API, 
                                        data)
            // const response = { status: "OK" };
            console.log("Logging response..", response);
            setLoading(false);
        } catch (err) {
            console.log("Error:..", err.message);
            setLoading(false);
        }
    }
    return (
        <form
        className="flex flex-col gap-7"
        onSubmit={handleSubmit(submitContactFrom)}>

            {/* Name */}
            <div className="flex flex-col gap-5 lg:flex-row">
                {/* first name  */}
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="firstname" className="lable-style">
                        First Name
                    </label>
                    <input type="text"
                        name="firstname"
                        id="firstname"
                        placeholder="Enter First Name"
                        {...register("firstname", { required: true })}
                        className="form-style" />
                    {
                        errors.firstname && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter your name.
                            </span>
                        )
                    }
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="lastname" className="lable-style">
                        Last Name
                    </label>
                    <input type="text"
                        name="lastname"
                        id="lastname"
                        placeholder="Enter Last Name"
                        {...register("lastname")}
                        className="form-style" />
                </div>
            </div>

            {/* email */}
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="lable-style">
                    Email Address
                </label>
                <input type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email Address"
                    {...register("email", { required: true })}
                    className="form-style" />
                {
                    errors.email && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your Email
                        </span>
                    )
                }
            </div>

            {/* phone number */}
            <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="lable-style">
                    Phone Number
                </label>
                 
                <div className="flex gap-5">
                    {/* country code dropdown */}
                    <div className="flex w-[81px] flex-col gap-2">
                        <select name="countryCodeDrop" id="countryCodeDrop"
                            className="form-style"
                            {...register("countryCode", { required: true })}>
                            {
                                CountryCode.map((element, index) => {
                                    return (
                                        <option key={index} value={element.code} className="text-black">
                                            {element.code} -{element.country}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="flex flex-col w-[calc(100%-90px)] gap-2">
                        <input type="number"
                            name="phone"
                            id="phone"
                            placeholder="12345 67890"
                            className="form-style"
                            {...register("phone",
                                {
                                    required: { value: true, message: "Please enter Phone Number" },
                                    maxLength: { value: 12, message: "Invalid Phone Number" },
                                    minLength: { value: 10, message: "Invalid Phone Number" }
                                })} />

                            {errors.phone && (
                                <span  className="-mt-1 text-[12px] text-yellow-100">
                                    {errors.phone.message}
                                </span>
                            )}
                    </div>

                </div>

            </div>

            {/* message */}
            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="lable-style">
                    Message
                </label>
                <textarea name="message" id="message" cols="30" rows="7" placeholder="Enter Your Message here"
                    className="form-style"
                    {...register("message", { required: true })}
                    />
                {
                    errors.message && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your Message
                        </span>
                    )
                }
            </div>

            <button 
            disabled={loading}
            type="submit"
            className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px]
            font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]
            ${!loading &&
                "transition-all duration-200 hover:scale-95 hover:shadow-none"}
                disabled:bg-richblack-500 sm:text-[16px]`}>
                Send Message
            </button>



        </form>
    )
}

export default ContactUsFrom