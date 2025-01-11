import { useState } from "react"
import { Alert, Row, Stack, Form, Col, Button } from "react-bootstrap"
import { z } from "zod"
import { useMutation } from "react-query"
import { changePassword } from "../../utils/auth"
import LoadingComponent from "../Loading"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSelector } from "../../lib/rtk/index"

export default function ChangePasswordFrom() {
    const user = useSelector(state => state.user)
    const [changePasswordMessage, setChangePasswordMessage] = useState({
		type: "",
		text: ""
	})
    const PasswordFormSchema = z
		.object({
			oldPassword: z
				.string()
				.min(1, { message: "Password is required!" })
				.min(7, { message: "Password must be at least 7 characters!" }),
			newPassword: z
				.string()
				.min(1, { message: "Password is required!" })
				.min(7, { message: "Password must be at least 7 characters!" }),
			c_password: z
				.string()
				.min(1, { message: "Password is required!" })
				.min(7, { message: "Password must be at least 7 characters!" }),
    })
	.refine((data) => data.newPassword === data.c_password, {
		message: "Passwords must match.",
		path: ["c_password"],
	});

    const defaultValues = {
		oldPassword: "",
		newPassword: "",
		c_password: "",
    };

    const { mutate, isLoading } = useMutation(
        {
			mutationFn: (data) => changePassword(data, user?._id),
            onSuccess: async (res) => {
                const msg = await res?.data.message
                setChangePasswordMessage({
					type: "success",
					text: msg || "Your password changed successfully!"
				});
                form.reset()
            },
            onError: (error) => {
                const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again.';
                setChangePasswordMessage({
					type: "error",
					text: errorMessage
				});
                console.error('Error:', errorMessage);
            }
        }
    );
    
    const form = useForm({
		resolver: zodResolver(PasswordFormSchema),
		defaultValues,
	});

    function onSubmit(data) {
		mutate(data)
    }
    const welcomeUsername = user?.name.slice(0, user?.name.indexOf(" "))
    return (
        <Form className="w-100 h-100 mb-5" onSubmit={form.handleSubmit(onSubmit)}>
            <Row
                style={{
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Col xs={12} sm={6}>
                    <Stack gap={3}>
                        <h2><span style={{ textTransform: "capitalize"}}>{welcomeUsername}</span>&apos;s account</h2>

                        <Form.Group controlId="oldPassword">
							<Form.Label htmlFor="old-password">Old Password</Form.Label>
							<Form.Control
								id="old-password"
								name="old-password"
								type="password"
								autoComplete="off"
								placeholder="********"
								{...form.register("oldPassword")}
								isInvalid={!!form.formState.errors.oldPassword}
							/>
							<Form.Control.Feedback type="invalid">
								{form.formState.errors.oldPassword?.message}
							</Form.Control.Feedback>
						</Form.Group>

                        <Form.Group>
							<Form.Label htmlFor="new-password">New Password</Form.Label>
							<Form.Control
								id="new-password"
								name="new-password"
								type="password"
								autoComplete="off"
								placeholder="********"
								{...form.register("newPassword")}
								isInvalid={!!form.formState.errors.newPassword}
							/>
							<Form.Control.Feedback type="invalid">
								{form.formState.errors.newPassword?.message}
							</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
							<Form.Label htmlFor="confirm-password">Confirm Password</Form.Label>
							<Form.Control
								id="confirm-password"
								name="confirm-password"
								type="password"
								autoComplete="off"
								placeholder="********"
								{...form.register("c_password")}
								isInvalid={!!form.formState.errors.c_password}
							/>
                            <Form.Control.Feedback type="invalid">
								{form.formState.errors.c_password?.message}
							</Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {
                                isLoading ? <LoadingComponent /> : "Change password"
                            }
                        </Button>
                        {
                            changePasswordMessage.text && (
                                <Alert variant={changePasswordMessage.type === "error" ? "danger" : "success"}>
                                    <p>{changePasswordMessage.text}</p>
                                </Alert>
                            )
                        }
                    </Stack>
                </Col>
            </Row>
        </Form>
    )
}