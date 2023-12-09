"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var axios_1 = __importDefault(require("axios"));
require("./style.css");
// import Evaluate = Schemas.Evaluate;
// import { Buffer } from 'buffer';
var PackagePage = function () {
    // Access the packageId parameter from the route
    var packageId = (0, react_router_dom_1.useParams)().packageId;
    var _a = (0, react_1.useState)(), rating = _a[0], setRating = _a[1];
    // Fetch package data using the packageId
    var handleRate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/".concat(packageId, "/rate"))];
                case 1:
                    response = _a.sent();
                    setRating(response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching packages:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // const downloadPackage = async () => {
    //   try {
    //     const response = await axios.get(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}`, { responseType: 'blob' });
    //     const url = window.URL.createObjectURL(new Blob([response.data]));
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', `${packageId}.zip`);
    //     document.body.appendChild(link);
    //     link.click();
    //   } catch (error) {
    //     console.error('Error downloading package:', error);
    //   }
    // };
    //   const downloadPackage = async () => {
    //     try {
    //         const response = await axios.get(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}`, { responseType: 'text' });
    //         const zipBuffer = Buffer.from(response.data, 'base64');
    //         const blob = new Blob([zipBuffer], { type: 'application/zip' });
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', `${packageId}.zip`);
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link); // Clean up
    //     } catch (error) {
    //         console.error('Error downloading package:', error);
    //     }
    // };
    // const downloadPackage = async () => {
    //   try {
    //       const response = await axios.get(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}`, { responseType: 'text' });
    //       const base64Response = response.data;
    //       // Decoding the base64 string to binary data
    //       const binaryString = window.atob(base64Response);
    //       const len = binaryString.length;
    //       const bytes = new Uint8Array(len);
    //       for (let i = 0; i < len; i++) {
    //           bytes[i] = binaryString.charCodeAt(i);
    //       }
    //       // Creating a Blob from binary data
    //       const blob = new Blob([bytes], { type: 'application/zip' });
    //       const url = window.URL.createObjectURL(blob);
    //       const link = document.createElement('a');
    //       link.href = url;
    //       link.setAttribute('download', `${packageId}.zip`);
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link); // Clean up
    //   } catch (error) {
    //       console.error('Error downloading package:', error);
    //   }
    // };
    // const downloadPackage = async () => {
    //   try {
    //       const response = await axios.get(`http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/${packageId}`, { responseType: 'text' });
    //       let base64Response = response.data;
    //       // Replace URL-safe base64 characters if necessary
    //       base64Response = base64Response.replace(/-/g, '+').replace(/_/g, '/');
    //       // Remove any whitespace
    //       base64Response = base64Response.replace(/\s/g, '');
    //       const binaryString = window.atob(base64Response);
    //       const len = binaryString.length;
    //       const bytes = new Uint8Array(len);
    //       for (let i = 0; i < len; i++) {
    //           bytes[i] = binaryString.charCodeAt(i);
    //       }
    //       const blob = new Blob([bytes], { type: 'application/zip' });
    //       const url = window.URL.createObjectURL(blob);
    //       const link = document.createElement('a');
    //       link.href = url;
    //       link.setAttribute('download', `${packageId}.zip`);
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //   } catch (error) {
    //       console.error('Error downloading package:', error);
    //   }
    // };
    function base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var len = binaryString.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
    var downloadPackage = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, base64Response, arrayBuffer, blob, url, link, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/".concat(packageId), { responseType: 'text' })];
                case 1:
                    response = _a.sent();
                    base64Response = JSON.parse(response.data).data.Content;
                    arrayBuffer = base64ToArrayBuffer(base64Response);
                    blob = new Blob([arrayBuffer], { type: 'application/zip' });
                    url = window.URL.createObjectURL(blob);
                    link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', "".concat(packageId, ".zip"));
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link); // Clean up
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error downloading package:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        handleRate();
    });
    // Display package details on the page
    return ((0, jsx_runtime_1.jsxs)("div", { className: "package-details", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Package Details" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Package ID: ", packageId] }), (0, jsx_runtime_1.jsx)("h3", { children: "Package Ratings" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Bus Factor: ", rating === null || rating === void 0 ? void 0 : rating.BusFactor] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Correctness: ", rating === null || rating === void 0 ? void 0 : rating.Correctness] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Ramp Up: ", rating === null || rating === void 0 ? void 0 : rating.RampUp] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Responsive Maintainer: ", rating === null || rating === void 0 ? void 0 : rating.ResponsiveMaintainer] }), (0, jsx_runtime_1.jsxs)("p", { children: ["License Score: ", rating === null || rating === void 0 ? void 0 : rating.LicenseScore] }), (0, jsx_runtime_1.jsxs)("p", { children: ["GoodPinningPractice: ", rating === null || rating === void 0 ? void 0 : rating.GoodPinningPractice] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Pull Request: ", rating === null || rating === void 0 ? void 0 : rating.PullRequest] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Net Score: ", rating === null || rating === void 0 ? void 0 : rating.NetScore] }), (0, jsx_runtime_1.jsx)("button", { onClick: downloadPackage, className: "download-button", children: "Download Package" })] }));
};
exports.default = PackagePage;
