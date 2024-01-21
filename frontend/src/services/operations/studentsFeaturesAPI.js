import { studentEndpoints } from "../apis"
import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import rzplogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        }
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading..");
    try {
        // load script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        console.log("RES ye mila bhai...", res);
        if (!res) {
            toast.error("Razorpay SDK failed to load");
            return;
        }

        // intiate the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,
            { courses },
            {
                Authorization: `Bearer ${token}`,
            });
        console.log("order response ye mila bhai..", orderResponse);
        if (!orderResponse) {
            throw new Error(orderResponse.data.message);
        }

        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id: orderResponse.data.message.id,
            name: "StudyNotion",
            description: "Thank You for purchasing the course",
            image: rzplogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email: userDetails.email
            },
            handler: function (response) {
                // send successfull wala mail
                sendPaymentSuccessEmail(response, orderResponse.data.message.amount, token);

                // verify-payment
                verifyPayment({ ...response, courses }, token, navigate, dispatch);
            }
        }
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("OOPS!! Payment Failed.");
            console.log(response.error);
        })
    } catch (err) {
        console.log("PAYMENT API ERROR...", err);
        toast.error("could not make payment");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount
            },
            {
                Authorization: `Bearer ${token}`,
            })
    } catch (err) {
        console.log("PAYMENT SUCCESS EMAIL ERROR...", err);
    }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying payment..");
    dispatch(setPaymentLoading(true));

    try {
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData,
            {
                Authorization: `Bearer ${token}`,
            });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment Success, you are added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (err) {
        console.log("Payment verify error", err);
        toast.error("Could not verify payment");
    }

    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false));
}

