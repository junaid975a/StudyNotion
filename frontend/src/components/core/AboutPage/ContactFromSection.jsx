import React from "react";
import ContactUsFrom from "../../ContactPage/ContactUsFrom";

const ContactFromSection = () => {
    return (
        <div className="mx-auto">
            <h1 className="text-center text-4xl font-semibold">Get in Touch</h1>
            <p className="text-center text-richblack-300 mt-3">We'd love to here for you, please fill out this form.</p>
            <div>
                <ContactUsFrom />
            </div>
        </div>
    )
}

export default ContactFromSection