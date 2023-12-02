import React, { SyntheticEvent } from 'react';

function SignIn() {
    const validateLoginForm = (e: SyntheticEvent) => {
        e.preventDefault(); // Prevent the form from submitting
        const username = (document.getElementById("username") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;
        const invalidCreds = document.getElementById("invalid-credentials");

        // Hardcoded username and password for testing (replace with real credentials)
        const hardcodedUsername = "team14";
        const hardcodedPassword = "pass";

        if (username === hardcodedUsername && password === hardcodedPassword) {
            // Redirect to the home page on successful login
            if (invalidCreds) {
                invalidCreds.style.display = "none";
            }
            window.location.href = "home";
            return false; // Prevent form submission (you've already redirected)
        } else {
            // Display an error message for incorrect credentials
            if (invalidCreds) {
                invalidCreds.style.display = "block";
            }
            return false; // Prevent form submission
        }
    };

    return (
        <div className="sign-in-form">
            <h2>Sign In</h2>
            <form onSubmit={validateLoginForm}>
                <p id="invalid-credentials" className="error-message hide">Invalid credentials</p>
                <input type="text" id="username" name="username" placeholder="Username" required />
                <input type="password" id="password" name="password" placeholder="Password" required />
                <button className="button sign-in">Sign In</button>
            </form>
        </div>
    );
}

export default SignIn;