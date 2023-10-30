import { reduxForm } from "redux-form";
import { compose } from "redux";
import { Link } from "react-router-dom";
import {Button, Form, Input} from 'antd'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

const SignUpForm = () => {

  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    const {
        username,
        email,
        password
    } = values

    try {
        debugger
        const {data} = await axios.post('http://localhost:3003/user/register',{
            username,
            email,
            password
        },{
            headers:{
                "env":"test"
            }
        })
    
        if(data.message === 'user created'){
            navigate('/otp-verification',{
                state:{
                    email:email
                }
            })
        }
         
    } catch (error) {
        console.log("error",error);
    }
  } 

  return (
    <>
    <div className='h-screen w-screen flex items-center justify-center'>
        <div className='border px-16 py-20 rounded-lg shadow-lg shadow-gray-500' style={{padding:"25px 25px"}}>
            <Form
                form={form}
                onFinish={onFinish}
                style={{ maxWidth: 600,minWidth:300 }}
                layout='vertical'
                
            >
                <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
            <div className='rounded-lg my-2'>
                <Link to="/" className='text-sm underline'>already have account?</Link>
            </div>
        </div>

    </div>
</>
  );
};

export default compose(
  reduxForm({
    form: "signup",
  })
)(SignUpForm);
