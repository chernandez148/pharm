import React, { useState } from 'react';
import loginService from '../../services/auth/login';
import { login as setLogin } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import './LoginForm.css';
import { Navigate } from 'react-router-dom';

const transferSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
});

function LoginForm() {
    const dispatch = useDispatch();
    const [redirect, setRedirect] = useState(false); // 👈 track login success

    if (redirect) return <Navigate to="/" replace />; // 👈 perform redirect

    return (
        <div className='LoginForm'>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={transferSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const data = await loginService(values);
                        dispatch(setLogin(data));
                        localStorage.setItem("user", JSON.stringify(data));
                        setRedirect(true); // 👈 trigger redirect
                    } catch (error) {
                        console.error("Login failed:", error);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {() => (
                    <Form className='login-form'>
                        <h2>Welcome to RXConnect</h2>
                        <p>Sign in to access your dashboard</p>
                        <div className='login-form-wrapper'>
                            <label>Email</label>
                            <Field name="email" />
                            <ErrorMessage name="email" component="div" className="error" />

                            <label>Password</label>
                            <Field name="password" type="password" />
                            <ErrorMessage name="password" component="div" className="error" />
                        </div>

                        <button type='submit'>Login</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default LoginForm;
