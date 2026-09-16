import { useState } from "react";

function Auth() {
    const [name, setName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    async function handleRegister(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: registerEmail,
                        password: registerPassword
                    })
                }
            );

            const data = await response.json();

            alert(data.message);

            if (response.ok) {
                setName("");
                setRegisterEmail("");
                setRegisterPassword("");
            }

        } catch (error) {
            console.log("Registration error:", error);
            alert("Registration failed.");
        }
    }

    async function handleLogin(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: loginEmail,
                        password: loginPassword
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);

                alert("Login successful!");

                setLoginEmail("");
                setLoginPassword("");
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log("Login error:", error);
            alert("Login failed.");
        }
    }

    return (
        <section id="login" className="auth-section">

            <div className="auth-container">

                <div className="auth-heading">
                    <span>GET STARTED</span>

                    <h2>Start Your Fitness Journey</h2>

                    <p>
                        Create your account or login to continue
                        your fitness journey with FitTrack.
                    </p>
                </div>

                <div className="auth-cards">

                    <div className="auth-card">
                        <h3>Welcome Back</h3>

                        <p>
                            Login to continue your fitness journey.
                        </p>

                        <form onSubmit={handleLogin}>

                            <label htmlFor="login-email">
                                Email
                            </label>

                            <input
                                id="login-email"
                                type="email"
                                placeholder="Enter your email"
                                value={loginEmail}
                                onChange={(e) =>
                                    setLoginEmail(e.target.value)
                                }
                                required
                            />

                            <label htmlFor="login-password">
                                Password
                            </label>

                            <input
                                id="login-password"
                                type="password"
                                placeholder="Enter your password"
                                value={loginPassword}
                                onChange={(e) =>
                                    setLoginPassword(e.target.value)
                                }
                                required
                            />

                            <button type="submit">
                                Login
                            </button>

                        </form>
                    </div>

                    <div className="auth-card">
                        <h3>Create Your Account</h3>

                        <p>
                            Join FitTrack and start tracking today.
                        </p>

                        <form onSubmit={handleRegister}>

                            <label htmlFor="register-name">
                                Name
                            </label>

                            <input
                                id="register-name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                            <label htmlFor="register-email">
                                Email
                            </label>

                            <input
                                id="register-email"
                                type="email"
                                placeholder="Enter your email"
                                value={registerEmail}
                                onChange={(e) =>
                                    setRegisterEmail(e.target.value)
                                }
                                required
                            />

                            <label htmlFor="register-password">
                                Password
                            </label>

                            <input
                                id="register-password"
                                type="password"
                                placeholder="Create a password"
                                value={registerPassword}
                                onChange={(e) =>
                                    setRegisterPassword(e.target.value)
                                }
                                required
                            />

                            <button type="submit">
                                Create Account
                            </button>

                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Auth;