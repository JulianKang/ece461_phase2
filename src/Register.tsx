import React, { useState, useEffect, SyntheticEvent } from 'react';

function Register() {
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<boolean>(false);

    useEffect(() => {
        const match = password === confirmPassword;
        setPasswordError(!match);
    }, [password, confirmPassword]);

    const validateRegisterForm = (e: SyntheticEvent) => {
        e.preventDefault(); // Prevent the form from submitting

        if (password !== confirmPassword) {
            // Passwords don't match, the error will be displayed
            setPasswordError(true);
        } else {
            // Passwords match, navigate to the Sign-In page
            window.location.href = "signIn";
        }
    };

    return (
        <div className="register-form">
            <h2>Register</h2>
            <form onSubmit={validateRegisterForm}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    name="confirm-password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordError && (
                    <p className="error-message">Passwords do not match</p>
                )}
                <button className="button register">Register</button>
            </form>
        </div>
    );
}

export default Register;