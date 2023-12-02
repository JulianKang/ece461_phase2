"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateError = exports.Server_Error = void 0;
/*
 * ALL SERVER RELATED ERRORS BY CODE
 * 400: Bad Request, missing field, improper format, invalid authentication token
 * 401: Unauthorized permission, or username/password is invalid
 * 404: Not Found, ie package does not exist
 * 409: Conflict, ie package already exists
 * 413: Payload Too Large, ie too many packages returned
 * 424: Failed Dependency, ie package is not uploaded due to the disqualified rating.
 * 500: Internal Server Error, ex database error
 * 501: Not Implemented, ie API endpoint not implemented
 */
var DEFAULT_SERVER_ERRORS = {
    400: "Bad Request",
    401: "Unauthorized",
    404: "Not Found",
    409: "Conflict",
    413: "Payload Too Large",
    424: "Failed Dependency",
    500: "Internal Server Error",
    501: "Not Implemented"
};
var Server_Error = /** @class */ (function (_super) {
    __extends(Server_Error, _super);
    function Server_Error(num, str) {
        var _this = this;
        var message = str != null ? str :
            num in DEFAULT_SERVER_ERRORS ? DEFAULT_SERVER_ERRORS[num] :
                "Unknown Server Error or Default Error not Found";
        _this = _super.call(this, message) || this;
        _this.name = num.toString();
        _this.num = num;
        return _this;
    }
    return Server_Error;
}(Error));
exports.Server_Error = Server_Error;
var AggregateError = /** @class */ (function (_super) {
    __extends(AggregateError, _super);
    function AggregateError(errors) {
        var _this = _super.call(this, 'Multiple errors occurred') || this;
        _this.num = 500;
        _this.name = 'AggregateError';
        _this.errors = errors;
        if (errors[0] instanceof Server_Error) {
            _this.num = errors[0].num;
        }
        return _this;
    }
    return AggregateError;
}(Error));
exports.AggregateError = AggregateError;
