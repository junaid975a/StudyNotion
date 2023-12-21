import { useSelector } from "react-redux"
import IconBtn from "../../../common/IconBtn"

export default function RenderTotalAmount() {
    const {cart, total} = useSelector((state) => state.cart);

    const handleBuyCourse= () => {
        const courses = cart.map((course) => course._id)
        console.log("Bought these courses: ", courses)
        // TODO: API integration for buy course
    }
    return (
        <div>
            <p>Total: </p>
            <p>Rs {total}</p>

            <IconBtn 
                text="Buy Now"
                onclick={handleBuyCourse}
                customClasses={"w-full justify-center"}/>
        </div>
    )
}