import React from "react";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import IconBtn from "../../common/IconBtn"

const MyProfile = () => {
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();


    return (
        <div className="text-white">
            <h1 className="text-white">My Profile</h1>

            {/* section 1 */}
            <div>
                <div>
                    <img src={user?.image} alt={`Profile-${user?.firstName}`}
                        className="aspect-square w-[78px] rounded-full object-cover" />
                    <div>
                        <p className="text-white">{user?.firstName + " " + user?.lastName}</p>
                        <p className="text-white">{user?.email}</p>
                    </div>
                </div>
                <IconBtn text="Edit"
                    onclick={() => {
                        navigate("/dashboard/settings")
                    }}
                    className="" />
            </div>

            {/* section 2 */}
            <div>
                <div>
                    <p>About</p>
                    <IconBtn
                        text="Edit"
                        onclick={() => {
                            navigate("/dashboard/settings")
                        }} />
                </div>
                <p>
                    {user?.additionalDetails?.about ?? "Write something about yourself"}
                </p>
            </div>


            {/* section3 */}
            <div>
                <div>
                    <p>
                        Personal Details
                    </p>
                    <IconBtn
                        text="Edit"
                        onclick={() => {
                            navigate("/dashboard/settings")
                        }} />
                </div>

                <div>
                    <div>
                        <p>First Name</p>
                        <p>{user?.firstName}</p>
                    </div>
                    <div>
                        <p>Email</p>
                        <p>{user?.email}</p>
                    </div>
                    <div>
                        <p>Gender</p>
                        <p>{user?.additionalDetails?.gender ?? "Add gender"}</p>
                    </div>
                    <div>
                        <p>Last Name</p>
                        <p>{user?.lastName}</p>
                    </div>
                    <div>
                        <p>Phone Number</p>
                        <p>{user?.additionalDetails?.contactNumber ?? "Add Contact Number"}</p>
                    </div>
                    <div>
                        <p>Date of Birth</p>
                        <p>{user?.additionalDetails?.dateOfBirth ?? "Add DoB"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default MyProfile