import React, { useState } from "react"
import { reduxForm } from "redux-form"
import { compose } from "redux"
import { Form, Input, Button } from "antd"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const ProfileForm = () => {

  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null);
  const formDataObject = new FormData()

  const location = useLocation()
  const user = location.state.user

  const formData = {
    username: user.username,
    email: user.email,
    firstname: user.firstName,
    lastname: user.lastName,
    mobile: user.mobile
  }
  const onFinish = async (values) => {

    formDataObject.append('image', selectedFile)

    try {
      let image;
      if (selectedFile) {
        debugger
     
        const res = await axios.post(`http://localhost:3003/user/web/uploadImage/user`, formDataObject, { headers: { "env": "test","Content-Type":"multipart/form-data" } })
        console.log(res.data);
        image = res.data.file_name
      }
      
      debugger
      const { data } = await axios.post(`http://localhost:3003/user/update-profile?userId=${user._id}`, {
        username: values.username,
        email: values.email,
        firstName: values.firstname,
        lastName: values.lastname,
        mobile: values.mobile,
        image
      }, {
        headers: {
          "env": "test"
        }
      })

      if (data.message === 'user profile updated') {
        toast.success("user profile updated successfully")
        navigate('/home')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const changeHandler = (e) => {
    setSelectedFile(e.target.files[0])
  }

  return (
    <div className='border px-16 py-20 rounded-lg shadow-lg shadow-gray-500' style={{ padding: "25px" }}>
      <h1 className='text-3xl mb-9 ms-3 font-extrabold'>Edit Profile </h1>

      <Form
        form={form}
        onFinish={onFinish}
        initialValues={formData}
        encType='multipart/form-data'
        layout='vertical'
      >
        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <Input className='w-2/3' />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input className='w-8/12' />
        </Form.Item>
        <Form.Item>
          <Form.Item name="firstname" label="Firstname" rules={[{ required: true }]}>
            <Input className='w-2/3' />
          </Form.Item>
          <Form.Item name="lastname" label="Lastname" rules={[{ required: true }]}>
            <Input className='w-2/3' />
          </Form.Item>
          <Form.Item name="mobile" label="Mobile no" rules={[{ required: true }]}>
            <Input className='w-2/3' />
          </Form.Item>
          <Form.Item>
            <div className="mb-3">
              <input
                onChange={changeHandler}
                className="relative m-0 block w-8/12 min-w-0 flex-auto rounded border border-solid"
                type="file"
                name="image"
                id="formFile" />
            </div>
          </Form.Item>
          <Button
            htmlType="submit"
          >
            Update
          </Button>
          <Button
            htmlType="button"
            onClick={(e) => navigate("/user-profile")}
            className='ms-5'
          >
            cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
};

export default compose(
  reduxForm({
    form: "profile",
  })
)(ProfileForm);
