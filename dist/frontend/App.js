"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
// import SignInNavbar from './SignInNavbar';
// import Buttons from './Buttons';
// import SignIn from './SignIn';
// import Register from './Register';
var HomeNavbar_1 = __importDefault(require("./HomeNavbar"));
var HomePage_1 = __importDefault(require("./HomePage"));
var PackagePage_1 = __importDefault(require("./PackagePage"));
var AddPage_1 = __importDefault(require("./AddPage"));
var PackageNavbar_1 = __importDefault(require("./PackageNavbar"));
function App() {
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(HomeNavbar_1.default, {}), (0, jsx_runtime_1.jsx)(HomePage_1.default, {})] }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/home", element: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(HomeNavbar_1.default, {}), (0, jsx_runtime_1.jsx)(HomePage_1.default, {})] }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/package/:packageId", element: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(PackageNavbar_1.default, {}), (0, jsx_runtime_1.jsx)(PackagePage_1.default, {})] }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/add", element: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(HomeNavbar_1.default, {}), (0, jsx_runtime_1.jsx)(AddPage_1.default, {})] }) })] }) }));
}
exports.default = App;
