import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import '../App.css';
import logo from '../assets/logo.JPG'; // Make sure you have the logo image in the src folder
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useCookies } from 'react-cookie';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const { user, login, isLoggedIn, setUser, setIsLoggedIn } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['authToken']);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const token = cookies.authToken;
        if (token) {
            // Validate the token and set user context
            // Replace this with your actual token validation logic
            const isValidToken = true; // Assume the token is valid for demonstration
            if (isValidToken) {
                setUser && setUser({ email: 'user@example.com', role: 'USER' }); // Set user data
                setIsLoggedIn && setIsLoggedIn(true);
            }
        }
    }, [cookies, setUser, setIsLoggedIn]);

    useEffect(() => {
        setIsFormValid(validateEmail(email) && validatePassword(password));
    }, [email, password]);

    useEffect(() => {
        if (email !== '' && !validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
        } else {
            setEmailError('');
        }
    }, [email]);

    useEffect(() => {
        if (password !== '' && !validatePassword(password)) {
            setPasswordError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
        } else {
            setPasswordError('');
        }
    }, [password]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid) {
            try {
                const token = await login(email, password);
                if (keepSignedIn) {
                    setCookie('authToken', token, { path: '/', maxAge: 604800 }); // 1 week
                }
                console.log('Login successful');
            } catch (error) {
                setGeneralError(error.message);
                setTimeout(() => {
                    setGeneralError('');
                }, 5000); // Clear error message after 5 seconds
            }
        }
    };

    useEffect(() => {
        let timeoutId;
        if (generalError) {
            timeoutId = setTimeout(() => {
                setGeneralError('');
            }, 5000); // Clear error message after 5 seconds
        }
        return () => clearTimeout(timeoutId);
    }, [generalError]);

    if (user && isLoggedIn) {
        console.log("login page USER->>>>>", user);
        if (user.role === "ADMIN") {
            return <Navigate to="/admin" />;
        } else {
            return <Navigate to="/dashboard" />;
        }
    }

    return (
        <div className="App">
            <Container fluid className="login-container">
                <Row className="justify-content-md-center">
                    <Col md={12}>
                        <Card className='login-card-border'>
                            <Card.Body>
                                <div className="text-center mb-4">
                                    <img src={logo} alt="HX Studio Logo" className="logo" />
                                </div>
                                <h4 className="text-center mb-4 login-text">Please login using your account</h4>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className='login-input'>USERNAME</Form.Label>
                                        <Form.Control className='login-usertext'
                                            type="email"
                                            placeholder="yourname@harbingergroup.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            isInvalid={!!emailError}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {emailError}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword" className="mt-3 position-relative">
                                        <Form.Label className="login-input">PASSWORD</Form.Label>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="**************"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            isInvalid={!!passwordError}
                                            className="login-usertext"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {passwordError}
                                        </Form.Control.Feedback>
                                        <span
                                            onClick={togglePasswordVisibility}
                                            className="password-toggle-icon"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </Form.Group>

                                   

                                    <button className="w-100 login-button" disabled={!isFormValid}>LOGIN</button>

                                    {generalError && (
                                        <div className="alert alert-danger mt-3" role="alert">
                                            {generalError}
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <Form.Group controlId="formBasicCheckbox" className="mb-0">
                                            <Form.Check
                                                type="checkbox"
                                                label="Keep me signed in"
                                                checked={keepSignedIn}
                                                onChange={(e) => setKeepSignedIn(e.target.checked)}
                                            />
                                        </Form.Group>
                                        <div className="text-right">
                                            <a href="#" className="forgot-password">Forgot Password?</a>
                                        </div>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;