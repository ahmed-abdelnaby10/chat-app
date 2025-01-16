import React, { useEffect, useRef, useState, useCallback, useMemo, Suspense } from "react"
import { Alert, Row, Stack, Form, Col, Button } from "react-bootstrap"
import { z } from "zod"
import { useMutation } from "react-query"
import { updateUser } from "../../utils/auth"
import LoadingComponent from "../Loading"
import { convertMediaToFile } from "../../utils/convertMedia"
import avatar from "../../assets/avatar.svg"
import { useDispatch, useSelector } from "../../lib/rtk/index"
import { setUser } from "../../lib/rtk/slices/userSlice"
import debounce from "lodash/debounce";

function AccountFrom() {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [updateUserMessage, setUpdateUserMessage] = useState({ type: "", text: "" })
    const [validationErrors, setValidationErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null)
    const fileInputRef = useRef(null)

    const accountFormSchema = z.object({
        name: z
            .string()
            .min(1, {
                message: "Name is required!",
            })
            .min(3, {
                message: "Name must be at least 3 characters!",
            }),
        phone: z
            .string()
            .regex(/^\+?\d{10,14}$/, "Invalid phone number")
            .optional(),
        gender: z
            .string()
            .optional(),
        media: z
            .any()
            .optional()
    })

    const [formData, setFormData] = useState({
        name: user.name,
        gender: user.gender || "",
        phone: user.phone || "",
        media: user.media || null,
    });

    const handleDebouncedChange = useMemo(() => {
        return debounce((field, value) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }, 300);
    }, []);

    useEffect(() => {
        setFormData({
            name: user.name,
            gender: user.gender,
            phone: user.phone,
            media: user.media,
        })
    }, [user])

    const { mutate, isLoading } = useMutation(
        {
            mutationFn: (data) => updateUser(data, user?._id),
            onSuccess: async (res) => {
                const updatedUser = res?.data?.data?.user;
                const msg = await res?.data?.message || "Your profile updated successfully!"
                setUpdateUserMessage({ type: "success", text: msg }); 
                dispatch(setUser(updatedUser));
            },
            onError: (error) => {
                const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again.';
                setUpdateUserMessage({ type: "error", text: errorMessage });
                console.error('Error:', errorMessage);
            }
        }
    );
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validatedData = accountFormSchema.parse(formData);
            const formDataToSend = new FormData();
        
            formDataToSend.append("name", validatedData.name)
            if (validatedData.gender) formDataToSend.append("gender", validatedData.gender);
            if (validatedData.phone) formDataToSend.append("phone", validatedData.phone);
            if (previewImage) formDataToSend.append("media", previewImage);
        
            mutate(formDataToSend);
            setValidationErrors({});
        } catch (error) {
            if (error instanceof z.ZodError) {
                setValidationErrors(
                    error.errors.reduce((acc, curr) => {
                        acc[curr.path[0]] = curr.message;
                        return acc;
                    }, {})
                );
                setUpdateUserMessage("Please fix the form errors.");
            }
        }
    };

    useEffect(() => {
        let isMounted = true;
        if (user?.media) {
            convertMediaToFile(user?.media).then((file) => {
                if (isMounted) setPreviewImage(file);
            });
        }
        return () => {
            isMounted = false;
        };
    }, [user?.media]);

    const handleFileChange = useCallback((e) => {
        if (e.target.files && e.target.files.length > 0) {
            setPreviewImage(e.target.files[0])
        }
    }, [])

    const handleRemoveImage = useCallback(() => {
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

    const welcomeUsername = user?.name.includes(" ") ? 
    user?.name.slice(0, user?.name.indexOf(" ")) :
    user?.name

    const errorMessageStyle = {
        marginTop: "-4px",
        fontSize: "11px",
        fontWeight: '500'
    }

    const isMediaUnchanged = () => {
        if (!user.media && !previewImage) {
            return true;
        }
    
        if (user.media && previewImage) {
            const previewFileName = previewImage.name;
            const previewFileSize = previewImage.size;
    
            const userMediaFileName = user.media.file_name;
            const userMediaFileSize = user.media.file_size;
    
            return previewFileName === userMediaFileName && previewFileSize === userMediaFileSize;
        }
    
        return false;
    };

    const isDataUnchanged = 
    JSON.stringify({name: formData.name, gender: formData.gender, phone: formData.phone}) === JSON.stringify({
        name: user.name,
        gender: user.gender || "",
        phone: user.phone || ""
    }) &&
    isMediaUnchanged();

    return (
        <Form className="w-100 h-100 mb-5" onSubmit={handleSubmit}>
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

                        <Form.Group>
                            <Form.Label htmlFor="username">Your name</Form.Label>
                            <Form.Control
                                autoComplete="username"
                                name="username" 
                                id="username" 
                                type="text" 
                                placeholder="Name"
                                onChange={(e) => handleDebouncedChange("name", e.target.value)}
                                onInvalid={(e)=> {
                                    e.preventDefault()
                                }}
                                value={formData?.name || ""}
                            />
                            {validationErrors.name && (
                                <p className="text-danger text-center" style={errorMessageStyle}>{validationErrors.name}</p>
                            )}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="useremail">Your e-mail</Form.Label>
                            <Form.Control 
                                name="useremail" 
                                id="useremail" 
                                type="email" 
                                placeholder="Email"
                                disabled
                                value={user?.email || ""}
                            />
                            {validationErrors.gender && (
                                <p className="text-danger text-center" style={errorMessageStyle}>{validationErrors.name}</p>
                            )}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="userphone">Your phone</Form.Label>
                            <Form.Control 
                                name="userphone" 
                                id="userphone" 
                                type="text" 
                                placeholder="+201100100200"
                                onChange={(e) => handleDebouncedChange("phone", e.target.value)}
                                onInvalid={(e)=> {
                                    e.preventDefault()
                                }}
                                value={formData?.phone || ""}
                            />
                            {validationErrors.phone && (
                                <p className="text-danger text-center" style={errorMessageStyle}>{validationErrors.name}</p>
                            )}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="usergender">Your gender</Form.Label>
                            <Form.Select 
                                name="usergender" 
                                id="usergender" 
                                value={formData?.gender || ""} 
                                onChange={(e)=> {
                                    handleDebouncedChange("gender", e.target.value)
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <option value="" disabled>Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </Form.Select>
                            {validationErrors.gender && (
                                <p className="text-danger text-center" style={errorMessageStyle}>{validationErrors.gender}</p>
                            )}
                        </Form.Group>

                        <Form.Group className="d-flex align-items-start justify-content-start flex-column">
                            <Form.Label htmlFor="userimage">Your profile pic</Form.Label>
                            <Form.Control 
                                type="file" 
                                placeholder="Media"
                                onChange={handleFileChange}
                                onInvalid={(e)=> {
                                    e.preventDefault()
                                }}
                                ref={fileInputRef}
                                id="userimage"
                                accept="image/*"
                            />
                            {previewImage ? (
                                <div className="profile-image-container mt-3 align-self-center">
                                    <Suspense fallback={<LoadingComponent />}>
                                        <img
                                            src={URL.createObjectURL(previewImage)}
                                            alt="Selected Image"
                                            className="profile-form-pic"
                                            loading="lazy"
                                        />
                                    </Suspense>
                                    <Button
                                        onClick={handleRemoveImage}
                                        className="remove-image-button"
                                    >
                                        <i className="bi bi-trash remove-image-icon"></i>
                                    </Button>
                                </div>
                            ): (
                                <Suspense fallback={<LoadingComponent />}>
                                    <img
                                        src={avatar}
                                        alt="Selected Image"
                                        className="profile-form-pic profile-image-container mt-3 align-self-center"
                                        loading="lazy"
                                    />
                                </Suspense>
                            )}
                            {validationErrors.media && (
                                <p className="text-danger text-center" style={errorMessageStyle}>{validationErrors.media}</p>
                            )}
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="d-flex align-items-center justify-content-center"
                            disabled={isDataUnchanged}
                        >
                            {
                                isLoading ? <LoadingComponent /> : "Update profile"
                            }
                        </Button>
                        {
                            updateUserMessage.text && (
                                <Alert variant={updateUserMessage.type === "error" ? "danger" : "success"}>
                                    <p>{updateUserMessage.text}</p>
                                </Alert>
                            )
                        }
                    </Stack>
                </Col>
            </Row>
        </Form>
    )
}

export default React.memo(AccountFrom);