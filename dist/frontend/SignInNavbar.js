"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
function SignInNavbar() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "navbar", children: [(0, jsx_runtime_1.jsx)("a", { href: "/", children: (0, jsx_runtime_1.jsx)("div", { className: "logo", children: (0, jsx_runtime_1.jsx)("img", { src: "placeholder.jpg", alt: "Logo" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "links", children: [(0, jsx_runtime_1.jsx)("a", { href: "signIn", children: "Sign In" }), (0, jsx_runtime_1.jsx)("span", { className: "separator", children: "|" }), (0, jsx_runtime_1.jsx)("a", { href: "register", children: "Register Account" })] })] }));
}
exports.default = SignInNavbar;
