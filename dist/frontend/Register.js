"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
function Register() {
    var _a = (0, react_1.useState)(''), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(''), username = _b[0], setUsername = _b[1];
    var _c = (0, react_1.useState)(''), password = _c[0], setPassword = _c[1];
    var _d = (0, react_1.useState)(''), confirmPassword = _d[0], setConfirmPassword = _d[1];
    var _e = (0, react_1.useState)(false), passwordError = _e[0], setPasswordError = _e[1];
    (0, react_1.useEffect)(function () {
        var match = password === confirmPassword;
        setPasswordError(!match);
    }, [password, confirmPassword]);
    var validateRegisterForm = function (e) {
        e.preventDefault(); // Prevent the form from submitting
        if (password !== confirmPassword) {
            // Passwords don't match, the error will be displayed
            setPasswordError(true);
        }
        else {
            // Passwords match, navigate to the Sign-In page
            window.location.href = "signIn";
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "register-form", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Register" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: validateRegisterForm, children: [(0, jsx_runtime_1.jsx)("input", { type: "email", name: "email", placeholder: "Email", required: true, value: email, onChange: function (e) { return setEmail(e.target.value); } }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "username", placeholder: "Username", required: true, value: username, onChange: function (e) { return setUsername(e.target.value); } }), (0, jsx_runtime_1.jsx)("input", { type: "password", name: "password", placeholder: "Password", required: true, value: password, onChange: function (e) { return setPassword(e.target.value); } }), (0, jsx_runtime_1.jsx)("input", { type: "password", name: "confirm-password", placeholder: "Confirm Password", required: true, value: confirmPassword, onChange: function (e) { return setConfirmPassword(e.target.value); } }), passwordError && ((0, jsx_runtime_1.jsx)("p", { className: "error-message", children: "Passwords do not match" })), (0, jsx_runtime_1.jsx)("button", { className: "button register", children: "Register" })] })] }));
}
exports.default = Register;
