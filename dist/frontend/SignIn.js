"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
function SignIn() {
    var validateLoginForm = function (e) {
        e.preventDefault(); // Prevent the form from submitting
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var invalidCreds = document.getElementById("invalid-credentials");
        // Hardcoded username and password for testing (replace with real credentials)
        var hardcodedUsername = "team14";
        var hardcodedPassword = "pass";
        if (username === hardcodedUsername && password === hardcodedPassword) {
            // Redirect to the home page on successful login
            if (invalidCreds) {
                invalidCreds.style.display = "none";
            }
            window.location.href = "home";
            return false; // Prevent form submission (you've already redirected)
        }
        else {
            // Display an error message for incorrect credentials
            if (invalidCreds) {
                invalidCreds.style.display = "block";
            }
            return false; // Prevent form submission
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "sign-in-form", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Sign In" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: validateLoginForm, children: [(0, jsx_runtime_1.jsx)("p", { id: "invalid-credentials", className: "error-message hide", children: "Invalid credentials" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "username", name: "username", placeholder: "Username", required: true }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "password", name: "password", placeholder: "Password", required: true }), (0, jsx_runtime_1.jsx)("button", { className: "button sign-in", children: "Sign In" })] })] }));
}
exports.default = SignIn;
