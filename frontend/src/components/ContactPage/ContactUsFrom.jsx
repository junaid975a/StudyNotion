import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import Button from "../core/HomePage/Button"
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
            // const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data)
            const response = { status: "OK" };
            console.log("Logging response..", response);
            setLoading(false);
        } catch (err) {
            console.log("Error:..", err.message);
            setLoading(false);
        }
    }
    return (
        <form onSubmit={handleSubmit(submitContactFrom)}>

            {/* Name */}
            <div className="flex flex-row gap-1 mb-4">
                {/* first name  */}
                <div className="flex flex-col">
                    <label htmlFor="firstname">
                        First Name
                    </label>
                    <input type="text"
                        name="firstname"
                        id="firstname"
                        placeholder="Enter First Name"
                        {...register("firstname", { required: true })}
                        className="text-black" />
                    {
                        errors.firstname && (
                            <span>
                                Please enter your name
                            </span>
                        )
                    }
                </div>
                <div className="flex flex-col">
                    <label htmlFor="lastname">
                        Last Name
                    </label>
                    <input type="text"
                        name="lastname"
                        id="lastname"
                        placeholder="Enter Last Name"
                        {...register("lastname")}
                        className="text-black" />
                </div>
            </div>

            {/* email */}
            <div className="flex flex-col gap-1 mb-4">
                <label htmlFor="email">
                    Email Address
                </label>
                <input type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email Address"
                    {...register("email", { required: true })}
                    className="text-black" />
                {
                    errors.email && (
                        <span>
                            Please enter your Email
                        </span>
                    )
                }
            </div>

            {/* phone number */}
            <div className="flex flex-col gap-1 mb-4">
                <label htmlFor="phone">
                    Phone Number
                </label>
                 
                <div className="flex gap-2">
                    {/* country code dropdown */}
                    <div className="flex flex-col gap-2 w-[80px] text-black">
                        <select name="countryCodeDrop" id="countryCodeDrop"
                            className=""
                            {...register("countryCode", { required: true })}>
                            {
                                CountryCode.map((element, index) => {
                                    return (
                                        <option key={index} value={element.code} className="text-black">
                                            {element.code} - {element.country}
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
                            className="text-black"
                            {...register("phone",
                                {
                                    required: { value: true, message: "Please enter Phone Number" },
                                    maxLength: { value: 10, message: "Invalid Phone Number" },
                                    minLength: { value: 8, message: "Invalid Phone Number" }
                                })} />

                            {errors.phone && (
                                <span>
                                    {errors.phone.message}
                                </span>
                            )}
                    </div>

                </div>

            </div>

            {/* message */}
            <div className="flex flex-col gap-1 mb-4">
                <label htmlFor="message">
                    Message
                </label>
                <textarea name="message" id="message" cols="30" rows="7" placeholder="Enter Your Message here"
                    {...register("message", { required: true })}
                    className="text-black" />
                {
                    errors.message && (
                        <span>
                            Please enter your Message
                        </span>
                    )
                }
            </div>

            <button type="submit"
                className="rounded-md bg-yellow-50 text-center px=6 text-[16px] font-bold text-black">
                Send Message
            </button>



        </form>
    )
}

export default ContactUsFrom