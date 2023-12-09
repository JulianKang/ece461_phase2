"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
function Buttons() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "buttons-container", children: [(0, jsx_runtime_1.jsx)("button", { className: "button sign-in", onClick: function () { return window.location.href = 'signIn'; }, children: "Sign In" }), (0, jsx_runtime_1.jsx)("button", { className: "button register", onClick: function () { return window.location.href = 'register'; }, children: "Register User" })] }));
}
exports.default = Buttons;
