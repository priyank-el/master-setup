import React, { useContext } from "react"
import { reduxForm } from "redux-form"
import { compose } from "redux"
import { Link } from "react-router-dom"
import { Button, Form, Input } from "antd"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from 'react-toastify'
import { UserName } from "../../providers/ContextProvider"

const SignInForm = () => {

  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = async (values) => {

    const {
      email,
      password
    } = values

    try {
      debugger
      const { data } = await axios.post('http://localhost:3003/user/login', {
        email,
        password
      }, {
        headers: {
          "env": "test"
        }
      })
      if(data.token){
        localStorage.setItem("JwtToken",data.token)
      }
      if (data.message === "user login") {
        toast.success("user login successfully")
        navigate('/home')
      }
    } catch (error) {
      console.log("error", error)
      if (error.response.data.error) {
        toast.error(error.response.data.error)
        if (error.response.data.error === 'verify otp first')
          navigate('/otp-verification', {
            state: {
              email
            }
          })
        if(error.response.data.error === 'register first') navigate('/signup')
      }
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="border px-16 py-20 rounded-lg shadow-lg shadow-gray-500" style={{ padding: "25px" }}>
        <h1 className="text-3xl mb-9 ms-3 font-extrabold">Signin form </h1>
        <Form form={form}
          onFinish={onFinish}
          style={{ maxWidth: 600, minWidth: 300 }}
          layout='vertical'
        >
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">sign in</Button>
          </Form.Item>
        </Form>
        <div className="rounded-lg my-2">
          <Link to="/forgotpassword"
            className="text-sm flex justify-center font-extrabold text-blue-600 cursor-pointer">
            forgot password!
          </Link>
        </div>
        <div className="rounded-lg my-2">
          <Link to="/signup"
            className="text-sm underline flex justify-center">
            create account first!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default compose(
  reduxForm({
    form: "signin",
  })
)(SignInForm);
