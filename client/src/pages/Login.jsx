import { Alert, Row, Stack, Form, Col, Button } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod"
import LoadingComponent from "../components/Loading"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginUser } from "../utils/auth";
import Cookies from "js-cookie"
import { ACCESS_TOKEN } from "../utils/services";
import { useDispatch } from "../lib/rtk/index"
import { setUser } from "../lib/rtk/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setIsAuthenticated } from "../lib/rtk/slices/authSlice";

export default function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loginMessage, setLoginMessage] = useState({
        type: "",
        text: ""
    })

    const loginFormSchema = z.object({
        email: z
            .string()
            .min(1, { message: "Email is required." })
            .email({ message: "Invalid email format." }),
        password: z
            .string()
            .min(1, { message: "Password is required." })
    })

    const defaultValues = {
		email: "",
		password: ""
    };

    const { mutate, isLoading } = useMutation(
        {
            mutationFn: (data) => loginUser(data),
            onSuccess: (res) => {
                const token = res?.data?.data?.token
                const user = res?.data?.data?.user
                setLoginMessage({
                    type: res.data.status,
                    text: res.data.message
                })
                if (token) {
                    Cookies.set(ACCESS_TOKEN, token)  
                    dispatch(setUser(user))
                    dispatch(setIsAuthenticated(true))
                    navigate("/")
                }
                form.reset()
            },
            onError: (error) => {
                const errorMessage = error.response.data.message || "Something went wrong!"
                setLoginMessage({
                    type: "error",
                    text: errorMessage
                })
            }
        }
    );

    const form = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues,
    });

    function onSubmit(data) {
        mutate(data)
    }
    return (
        <>
            <Form onSubmit={form.handleSubmit(onSubmit)} className="w-100 h-100">
                <Row
                    style={{
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Col xs={12} sm={6}>
                        <Stack gap={3}>
                            <h2>Login</h2>
                            <Form.Group>
                                <Form.Label htmlFor="user-email">Email</Form.Label>
                                <Form.Control 
                                    id="user-email"
                                    name="user-email"
                                    autoComplete="email"
                                    type="text" 
                                    placeholder="Email"
                                    {...form.register("email")}
                                    isInvalid={!!form.formState.errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {form.formState.errors.email?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="user-password">Password</Form.Label>
                                <Form.Control 
                                    id="user-password"
                                    name="user-password"
                                    autoComplete="off"
                                    type="password" 
                                    placeholder="*********"
                                    {...form.register("password")}
                                    isInvalid={!!form.formState.errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {form.formState.errors.password?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="d-flex align-items-center justify-content-center">
                                {
                                    isLoading ? (<LoadingComponent />) : "Login"
                                }
                            </Button>
                            {
                                loginMessage.text && (
                                    <Alert variant={`${loginMessage.type === "error" ? "danger" : "success"}`}>
                                        {loginMessage.text}
                                    </Alert>
                                )
                            }
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    )
}