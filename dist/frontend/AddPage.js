"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var axios_1 = __importDefault(require("axios"));
var Schemas = __importStar(require("../schemas"));
var Evaluate = Schemas.Evaluate;
require("./style.css");
var jszip_1 = __importDefault(require("jszip"));
var AddPage = function () {
    var _a = (0, react_1.useState)({}), packageData = _a[0], setPackageData = _a[1];
    var _b = (0, react_1.useState)(''), errorMessage = _b[0], setErrorMessage = _b[1];
    var _c = (0, react_1.useState)('Ready'), status = _c[0], setStatus = _c[1];
    var handleNpmUrlChange = function (e) {
        setPackageData(__assign(__assign({}, packageData), { Content: undefined, URL: e.target.value, JSProgram: "if (process.argv.length === 7) {\nconsole.log('Success')\nprocess.exit(0)\n} else {\nconsole.log('Failed')\nprocess.exit(1)\n}\n" }));
        setErrorMessage('');
    };
    var handleFileChange = function (e) {
        if (e.target.files) {
            var file_1 = e.target.files[0];
            var zipReader_1 = new FileReader();
            zipReader_1.onload = function () { return __awaiter(void 0, void 0, void 0, function () {
                var zip, zipFile_1, fileContents_1, zipContent, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!file_1) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            zip = new jszip_1.default();
                            return [4 /*yield*/, zip.loadAsync(zipReader_1.result)];
                        case 2:
                            zipFile_1 = _a.sent();
                            fileContents_1 = {};
                            return [4 /*yield*/, Promise.all(Object.keys(zipFile_1.files).map(function (fileName) { return __awaiter(void 0, void 0, void 0, function () {
                                    var fileData;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, zipFile_1.files[fileName].async('base64')];
                                            case 1:
                                                fileData = _a.sent();
                                                // console.log('fileData: ', fileData);
                                                fileContents_1[fileName] = fileData;
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }))];
                        case 3:
                            _a.sent();
                            zipContent = JSON.stringify(fileContents_1);
                            setPackageData(__assign(__assign({}, packageData), { URL: undefined, Content: zipContent, JSProgram: "if (process.argv.length === 7) {\nconsole.log('Success')\nprocess.exit(0)\n} else {\nconsole.log('Failed')\nprocess.exit(1)\n}\n" }));
                            setErrorMessage('');
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            console.log('Error while processing the ZIP file:', error_1);
                            setErrorMessage('Error unzipping the file.');
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); };
            zipReader_1.readAsArrayBuffer(file_1);
        }
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setStatus('Uploading...');
                    console.log('isPackageContent: ', Evaluate.isPackageContent(packageData.Content));
                    console.log('isPackageURL: ', Evaluate.isPackageURL(packageData.URL));
                    console.log('isJSProgram: ', Evaluate.isPackageJSProgram(packageData.JSProgram));
                    if (!packageData.URL && !packageData.Content) {
                        setErrorMessage('Please provide either a URL or a file.');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post('http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package', packageData)];
                case 2:
                    response = _a.sent();
                    console.log(response.data);
                    setStatus('Success');
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    setStatus('Failed');
                    if (axios_1.default.isAxiosError(error_2)) {
                        setErrorMessage(error_2.message);
                        console.log(error_2.message);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsx)("div", { className: "upload-package-page", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "npmUrl", children: "NPM Package URL:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "npmUrl", onChange: handleNpmUrlChange, placeholder: "Enter npmjs package URL" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "packageFile", children: "Package File (zip):" }), (0, jsx_runtime_1.jsx)("input", { type: "file", id: "packageFile", onChange: handleFileChange, accept: ".zip" })] }), (0, jsx_runtime_1.jsxs)("p", { children: [" Status: ", status] }), errorMessage && (0, jsx_runtime_1.jsx)("p", { className: "error-message", children: errorMessage }), (0, jsx_runtime_1.jsx)("button", { type: "submit", children: "Upload Package" })] }) }));
};
exports.default = AddPage;
