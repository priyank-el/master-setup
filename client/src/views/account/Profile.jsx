import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Profile() {

    const [loading, setLoading] = useState(true)
    const [ userData , setuserData ] = useState(null)
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            debugger
            const token = localStorage.getItem("JwtToken")
            const { data } = await axios.get(`http://localhost:3003/user/user-profile`, {
                headers: {
                    "env": "test",
                    "Authorization":token
                }
            })
            if (data) {
                setuserData(data)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className="container-fluid my-3 justify-center">
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4">
                    <div className="mb-3 border rounded p-5 shadow" style={{ margin: "20px 5px" }}>
                        <h1 htmlFor="otpInput" className="form-label text-center">user profile</h1>
                        {
                            userData.image
                            ?
                            <img src={`http://localhost:3003/uploads/user/${userData.image}`} alt="image comes here" style={{ height: "200px", width: "100%", borderRadius: "10px" }} />
                            :
                            <img src={`http://localhost:3003/uploads/user/no-image.jpeg`} alt="image comes here" style={{ height: "200px", width: "100%", borderRadius: "10px" }} />
                        }
                        {
                            userData.username
                            ?
                            <div>
                            <p>Username</p>
                            <p style={{ backgroundColor: "wheat", padding: "10px 4px", borderRadius: "10px" }}>{userData.username}</p>
                        </div>
                            :null
                        }
                        
                        {userData.firstName
                            ?
                            <div>
                                <p>FirstName</p>
                                <p style={{ backgroundColor: "wheat", padding: "10px 4px", borderRadius: "10px" }}>{userData.firstName}</p>
                            </div>

                            : null
                        }
                        {
                            userData.lastName
                            ?
                            <div>
                            <p>LastName</p>
                            <p style={{ backgroundColor: "wheat", padding: "10px 4px", borderRadius: "10px" }}>{userData.lastName}</p>
                        </div>
                            :null
                        }
                        {
                            userData.email
                            ?
                            <div>
                            <p>Email</p>
                            <p style={{ backgroundColor: "wheat", padding: "10px 4px", borderRadius: "10px" }}>{userData.email}</p>
                        </div>
                            :null
                        }
                        {
                            userData.mobile
                            ?
                            <div>
                            <p>Mobile</p>
                            <p style={{ backgroundColor: "wheat", padding: "10px 4px", borderRadius: "10px" }}>{userData.mobile}</p>
                        </div>
                            :null
                        }
                        <button onClick={() => navigate('/update-profile', {
                            state: {
                                user:userData
                            }
                        })} className="btn btn-secondary">Update profile</button>
                    </div>
                </div>
                <div className="col-md-4"></div>
            </div>
        </div>
    )
}

export default Profile