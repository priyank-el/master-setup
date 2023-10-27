import React from "react"
import { reduxForm } from "redux-form"
import { compose } from "redux"
import { Link } from "react-router-dom"
import { Button, Form, Input } from "antd"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const SignInForm = () => {
  
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = async (values) => {

    const {
      email,
      password
    }  = values

   try {
    debugger
     const {data} = await axios.post('http://localhost:3003/user/login',{
       email,
       password
     },{
      headers:{
        "env":"test"
      }
     })
 
     if(data.message === "user login") navigate('/')
   } catch (error) {
      console.log("error",error)
   }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="border px-16 py-20 rounded-lg shadow-lg shadow-gray-500" style={{padding:"25px"}}>
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
          <Link to="/account/forgotpassword" 
            className="text-sm flex justify-center font-extrabold text-blue-600 cursor-pointer">
            forgot password!
          </Link>
        </div>
        <div className="rounded-lg my-2">
          <Link to="/account/signup" 
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
