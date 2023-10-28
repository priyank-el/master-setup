import React, { useState } from "react"
import { reduxForm } from "redux-form"
import { compose } from "redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button, Form, Input } from "antd"
import axios from "axios"
import {toast} from 'react-toastify'

const UpdatePasswordForm = () => {

  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const userEmail = location.state.id

  const onFinish = async (values) => {
    const {
        password,
        currentPassword
    } = values
    try {
        const checkedPassword = password.trim()
        const checkedCurrentPassword = currentPassword.trim()

        if(checkedPassword.length===0) throw "password required"
        if(checkedCurrentPassword.length===0) throw "current password required"
        if(checkedPassword !== checkedCurrentPassword) throw "password miss match"
        debugger
        const {data} = await axios.put('http://localhost:3003/user/reset-password',{
            email:userEmail,
            password:checkedPassword
        },{
            headers:{
                "env":"test"
            }
        })
        if(data.message === 'password updated') {
            toast.success("user updated")
            navigate('/')
        }
    } catch (error) {
        console.log(error,"error")
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
        <div className="border px-16 py-20 rounded-lg shadow-lg shadow-gray-500" style={{padding:"25px"}}>
            <h1 className="text-3xl mb-9 ms-3 font-extrabold">Update Password</h1>
            <Form form={form}
                onFinish={onFinish}
                style={{ maxWidth: 600, minWidth: 300 }}
                layout='vertical'
            >
                <p className="border border-gray-500 py-2 px-3 mb-3 rounded-lg bg-slate-400">Email is: {userEmail}</p>
                <Form.Item name="password" label="password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="currentPassword" label="Current password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button htmlType="submit">Update password</Button>
                </Form.Item>
            </Form>
            <div className="rounded-lg my-2">
                <Link to="/login"
                    className="text-sm underline flex justify-center">
                    Login Page
                </Link>
            </div>
        </div>
    </div>
)
}

export default compose(
  reduxForm({
    form: "updatepassword",
  })
)(UpdatePasswordForm);
