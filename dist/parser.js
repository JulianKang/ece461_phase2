"use strict";
/*
This file is part of ECE461Project.

ECE461Projectis free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

ECE461Project is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar. If not, see https://www.gnu.org/licenses/.
*/
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUrls = exports.getInfo = void 0;
var fs = __importStar(require("fs"));
var getInfo = function (url) {
    // Your logic to handle and process the URL goes here
};
exports.getInfo = getInfo;
var processUrls = function (filePath) {
    return new Promise(function (resolve, reject) {
        // Read the file content
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                return;
            }
            if (!data.trim()) {
                return;
            }
            // Split lines and process each URL
            var urls = data.split('\n').filter(function (url) { return url.trim() !== ''; }); // this will filter out any empty lines
            if (urls.length === 0) {
                return;
            }
            resolve(urls);
        });
    });
};
exports.processUrls = processUrls;
// Check if this module is being run directly
if (require.main === module) {
    var filePath = process.argv[2];
    if (!filePath) {
        process.exit(1);
    }
    (0, exports.processUrls)(filePath);
}
