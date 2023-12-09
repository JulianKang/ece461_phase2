"use strict";
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
var Schemas = __importStar(require("../schemas"));
var axios_1 = __importDefault(require("axios"));
require("./style.css");
function HomePage() {
    var _this = this;
    var _a = (0, react_1.useState)(''), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = (0, react_1.useState)([]), packages = _b[0], setPackages = _b[1];
    var handleSearch = function () { return __awaiter(_this, void 0, void 0, function () {
        var response_1, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    console.log(searchTerm);
                    if (!(searchTerm === '')) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios_1.default.post('http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/packages', [{
                                Version: "*",
                                Name: "*"
                            }])];
                case 1:
                    response_1 = _a.sent();
                    setPackages(response_1.data[0]);
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, axios_1.default.post("http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/package/byRegEx", { RegEx: searchTerm })];
                case 3:
                    response = _a.sent();
                    setPackages(response.data);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error fetching packages:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleReset = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.delete('http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/reset')];
                case 1:
                    _a.sent();
                    // Reset the package list and search term
                    setPackages([]);
                    setSearchTerm('');
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error resetting database:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleAdd = function () {
        // Logic for adding a package
        window.location.href = "/add";
        // This will need more details like a form input for package details
    };
    (0, react_1.useEffect)(function () {
        var fetchPackages = function () { return __awaiter(_this, void 0, void 0, function () {
            var temp, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        temp = [{
                                Version: "*",
                                Name: "*"
                            }];
                        console.log("isQuery:", Schemas.Evaluate.isPackageQuery(temp[0]));
                        return [4 /*yield*/, axios_1.default.post('http://ec2-18-191-52-162.us-east-2.compute.amazonaws.com/api/packages', temp)];
                    case 1:
                        response = _a.sent();
                        console.log(response.data[0]);
                        setPackages(response.data[0]);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error fetching packages:', error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchPackages();
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "home-page", children: [(0, jsx_runtime_1.jsxs)("div", { className: "search-section", children: [(0, jsx_runtime_1.jsx)("input", { type: "button", value: "Add Package", onClick: handleAdd, style: { marginTop: '10px', marginLeft: '10px', marginRight: '5px' } }), (0, jsx_runtime_1.jsx)("input", { type: "button", value: "Reset Database", onClick: handleReset, style: { marginTop: '10px', marginLeft: '5px', marginRight: '5px', float: 'right' } }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, maxLength: 100, placeholder: "Enter regex pattern for package search", style: { width: '300px', marginTop: '10px', marginLeft: '5px', marginRight: '10px' } }), (0, jsx_runtime_1.jsx)("input", { type: "button", value: "Search", onClick: handleSearch })] }), (0, jsx_runtime_1.jsx)("div", { className: "package-table", children: (0, jsx_runtime_1.jsxs)("table", { style: { marginTop: '10px', marginLeft: '10px' }, children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { style: { border: '1px solid #000', padding: '8px' }, children: "Package Name" }), (0, jsx_runtime_1.jsx)("th", { style: { border: '1px solid #000', padding: '8px' }, children: "Package Version" }), (0, jsx_runtime_1.jsx)("th", { style: { border: '1px solid #000', padding: '8px' }, children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: packages.map(function (pkg, index) { return ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: pkg.Name }), (0, jsx_runtime_1.jsx)("td", { children: pkg.Version }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("a", { href: "/package/".concat(pkg.ID, "/"), children: "View" }) })] }, index)); }) })] }) })] }));
}
exports.default = HomePage;
