"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("@michaelcoxon/utilities");
var HeaderHelpers;
(function (HeaderHelpers) {
    function contentTypeToString(contentType) {
        if (contentType) {
            if (contentType.encoding) {
                return contentType.contentType + "; charset=" + contentType.encoding;
            }
            else {
                return contentType.contentType;
            }
        }
    }
    HeaderHelpers.contentTypeToString = contentTypeToString;
    function stringToContentType(strContentType) {
        if (strContentType) {
            var _a = strContentType.split(';')
                .map(function (i) { return utilities_1.Strings.trim(i); })
                .filter(function (i) { return !utilities_1.Strings.isNullOrEmpty(i); }), mediaType = _a[0], charset = _a[1];
            var contentType = {
                contentType: mediaType,
                encoding: undefined
            };
            if (charset) {
                var _b = strContentType.split('=')
                    .map(function (i) { return utilities_1.Strings.trim(i); })
                    .filter(function (i) { return !utilities_1.Strings.isNullOrEmpty(i); }), name_1 = _b[0], value = _b[1];
                contentType.encoding = value;
            }
            return contentType;
        }
    }
    HeaderHelpers.stringToContentType = stringToContentType;
})(HeaderHelpers = exports.HeaderHelpers || (exports.HeaderHelpers = {}));
