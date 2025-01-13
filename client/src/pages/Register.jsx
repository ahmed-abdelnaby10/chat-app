import { Alert, Row, Stack, Form, Col, Button } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod"
import LoadingComponent from "../components/Loading"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";

export default function Register() {
    const navigate = useNavigate()

    const [registerMessage, setRegisterMessage] = useState({
        type: "",
        text: ""
    })
    const [showPassword, setShowPassword] = useState(false)

    const handleTogglePassword = useCallback((state) => {
        setShowPassword(!state)
    }, [])
    const [showC_Password, setShowC_Password] = useState(false)

    const handleToggleC_Password = useCallback((state) => {
        setShowC_Password(!state)
    }, [])

    const registerFormSchema = z.object({
        name: z
            .string()
            .min(1, { message: "Name is required." })
            .min(3, { message: "Name must be 3 characters or more." }),
        email: z
            .string()
            .email({ message: "Invalid email format." })
            .min(1, { message: "Email is required." }),
        password: z
            .string()
            .min(1, { message: "Password is required." })
            .min(7, { message: "Password must be 7 characters or more." }),
        c_password: z
            .string()
            .min(1, { message: "Password is required!" })
            .min(7, { message: "Password must be at least 7 characters!" }),
    })
    .refine((data) => data.password === data.c_password, {
		message: "Passwords must match.",
		path: ["c_password"],
	});

    const defaultValues = {
        name: "",
		email: "",
		password: "",
        c_password: ""
    };

    const { mutate, isLoading } = useMutation(
        {
            mutationFn: (data) => registerUser(data),
            onSuccess: (res) => {
                setRegisterMessage({
                    type: res.data.status,
                    text: res.data.message
                })
                navigate("/login")
                form.reset()
            },
            onError: (error) => {
                const isNetworkError = error.code === "ERR_NETWORK";
                const errorMessage = isNetworkError 
                ? "A network error occurred. Please check your internet connection." 
                : error.response.data.message || "Something went wrong!";

                setRegisterMessage({
                    type: "error",
                    text: errorMessage,
                });
            }
        }
    );

    const form = useForm({
        resolver: zodResolver(registerFormSchema),
        defaultValues,
    });

    const onSubmit = useCallback((data) => {
        mutate(data)
    }, [mutate])
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
                            <h2>Register</h2>
                            <Form.Group>
                                <Form.Label htmlFor="name">Name</Form.Label>
                                <Form.Control 
                                    id="name"
                                    name="name"
                                    autoComplete="username"
                                    type="text" 
                                    placeholder="Ex. Ahmed"
                                    {...form.register("name")}
                                    isInvalid={!!form.formState.errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {form.formState.errors.name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="email">Email</Form.Label>
                                <Form.Control 
                                    id="email"
                                    name="email"
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
                            <Form.Group className="position-relative">
                                <Form.Label htmlFor="password">Password</Form.Label>
                                <Form.Control 
                                    id="password"
                                    name="password"
                                    autoComplete="off"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="*********"
                                    {...form.register("password")}
                                    isInvalid={!!form.formState.errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {form.formState.errors.password?.message}
                                </Form.Control.Feedback>
                                <i 
                                    className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} position-absolute text-secondary`}
                                    onClick={() => {
                                        handleTogglePassword(showPassword)
                                    }}
                                ></i>
                            </Form.Group>
                            <Form.Group className="position-relative">
                                <Form.Label htmlFor="confirm-password">Confirm Password</Form.Label>
                                <Form.Control
                                    id="confirm-password"
                                    name="confirm-password"
                                    autoComplete="off"
                                    type={showC_Password ? "text" : "password"}
                                    placeholder="********"
                                    {...form.register("c_password")}
                                    isInvalid={!!form.formState.errors.c_password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {form.formState.errors.c_password?.message}
                                </Form.Control.Feedback>
                                <i 
                                    className={`bi ${showC_Password ? "bi-eye-slash-fill" : "bi-eye-fill"} position-absolute text-secondary`}
                                    onClick={() => {
                                        handleToggleC_Password(showC_Password)
                                    }}
                                ></i>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="d-flex align-items-center justify-content-center">
                                {
                                    isLoading ? (<LoadingComponent />) : "Register"
                                }
                            </Button>
                            {
                                registerMessage.text && (
                                    <Alert variant={`${registerMessage.type === "error" ? "danger" : "success"}`}>
                                        {registerMessage.text}
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