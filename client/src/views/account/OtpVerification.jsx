import axios from "axios"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function OtpVerification(){

    const [otp,setOtp] = useState(null)
    const navigate = useNavigate()
    
    const location = useLocation()
    const email = location.state.email

    const onsubmitHandler = async () => {
        try {
            debugger
            const {data} = await axios.post('http://localhost:3003/user/otp-verification',{
                otp,
                email
            },{
                headers:{
                    "env":"test"
                }
            })
    
            if(data.message === "otp verified"){
                toast.success(data.message)
                navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onResendOtp = async () => {
        try {
            const {data} = await axios.post('http://localhost:3003/user/resend-otp',{
                email
            },{
                headers:{
                    "env":"test"
                }
            })

            if(data.message === 'otp sended') toast.success(data.message)
        } catch (error) {
            console.log(error)
        }

    }

    return (
            <div className="container-fluid my-3 justify-center">
              <div className="row">
                <div  className="col-md-4"></div>
                <div className="col-md-4">
                <div class="mb-3 border rounded p-5 shadow"  style={{margin:"20px 5px"}}>
                    <label for="otpInput" class="form-label">Otp</label>
                    <input type="email" class="form-control" id="otpInput" onChange={(e) => {
                        setOtp(e.target.value)
                    }}/>
                    <button onClick={onsubmitHandler} type="submit" class="btn btn-primary" style={{margin:"20px 5px "}}>Verify</button>
                    <div>
                    <Link style={{textDecoration:"none"}} onClick={onResendOtp}>Resend otp</Link>
                    </div>
                </div>
                </div>
                <div className="col-md-4"></div>
              </div>
            </div>
    )
}

export default OtpVerification