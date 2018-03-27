"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var HttpClientEnums_1 = require("../interfaces/HttpClientEnums");
var HttpRequestHeaderCollection_1 = require("../HttpRequestHeaderCollection");
var HttpResponseHeaderCollection_1 = require("../HttpResponseHeaderCollection");
var KnownHeaderNames_1 = require("../interfaces/KnownHeaderNames");
var Exceptions_1 = require("../Exceptions");
var RequestContent_1 = require("../RequestContent");
var utilities_1 = require("@michaelcoxon/utilities");
var ResponseContentHandlers_1 = require("../ResponseContentHandlers");
var MUST_EXECUTE_RESPONSE_FIRST_MESSAGE = "Must execute response first";
var XhrHttpRequest = /** @class */ (function () {
    function XhrHttpRequest(method, uri, filters, headers, ignoreCache, timeout) {
        if (filters === void 0) { filters = []; }
        if (headers === void 0) { headers = new HttpRequestHeaderCollection_1.HttpRequestHeaderCollection([{
                name: KnownHeaderNames_1.KnownHeaderNames.accept,
                value: "application/json, text/javascript, text/plain"
            }]); }
        if (ignoreCache === void 0) { ignoreCache = false; }
        if (timeout === void 0) { timeout = 5000; }
        this.method = method;
        this.uri = uri;
        this._filters = filters;
        this.headers = headers;
        this._timeout = timeout;
        this.xhr = new XMLHttpRequest();
        this._cancelled = false;
        this._prepared = false;
        this._executed = false;
        this.content = new RequestContent_1.EmptyRequestContent();
        if (ignoreCache) {
            this.headers.add(KnownHeaderNames_1.KnownHeaderNames.cacheControl, 'no-cache');
        }
    }
    Object.defineProperty(XhrHttpRequest.prototype, "cancelled", {
        /** returns true if the request was cancelled */
        get: function () {
            return this._cancelled;
        },
        enumerable: true,
        configurable: true
    });
    XhrHttpRequest.prototype.executeAsync = function () {
        var _this = this;
        if (this._executed) {
            throw new Exceptions_1.InvalidOperationException('Request already executed. Create a new Request');
        }
        this._executed = true;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var sent_1, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // prepare the request
                        return [4 /*yield*/, this._prepareRequestAsync()];
                    case 1:
                        // prepare the request
                        _a.sent();
                        this.xhr.onload = function (evt) {
                            var response = _this._prepareResponse();
                            response.executeAsync(_this);
                            resolve(response);
                        };
                        this.xhr.onerror = function (evt) {
                            var response = _this._prepareErrorResponse();
                            response.executeAsync(_this);
                            resolve(response);
                        };
                        this.xhr.ontimeout = function (evt) {
                            var response = _this._prepareTimeoutResponse();
                            response.executeAsync(_this);
                            resolve(response);
                        };
                        sent_1 = false;
                        //send the content
                        return [4 /*yield*/, this.content.executeAsync(function (data) {
                                if (sent_1) {
                                    throw new Exceptions_1.InvalidOperationException("can only call the content writer once");
                                }
                                sent_1 = true;
                                _this.xhr.send(data);
                            })];
                    case 2:
                        //send the content
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        ex_1 = _a.sent();
                        reject(ex_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    XhrHttpRequest.prototype._prepareRequestAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this._prepared) {
                            throw new Exceptions_1.InvalidOperationException('Request already prepared. Create a new Request');
                        }
                        this._prepared = true;
                        this.xhr.open(this.method, this.uri);
                        if (!this.content) {
                            this.content = new RequestContent_1.EmptyRequestContent();
                        }
                        _a = this;
                        return [4 /*yield*/, this._applyFiltersAsync()];
                    case 1:
                        _a._cancelled = _b.sent();
                        // if we cancelled the request then lets bail out here
                        if (!this._cancelled) {
                            // start applying parameters to xhr now
                            this._setHeaders();
                            this.xhr.timeout = this._timeout;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * applies the filters to the request
     * @returns true if the request should be cancelled.
     */
    XhrHttpRequest.prototype._applyFiltersAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var notCancel, _i, _a, filter, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        notCancel = true;
                        _i = 0, _a = this._filters;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        filter = _a[_i];
                        return [4 /*yield*/, filter.canHandleRequestAsync(this)];
                    case 2:
                        if (!_c.sent()) return [3 /*break*/, 5];
                        _b = notCancel;
                        if (!_b) return [3 /*break*/, 4];
                        return [4 /*yield*/, filter.handleRequestAsync(this)];
                    case 3:
                        _b = (!(_c.sent()) || true);
                        _c.label = 4;
                    case 4:
                        notCancel = _b;
                        _c.label = 5;
                    case 5:
                        if (!notCancel) {
                            return [3 /*break*/, 7];
                        }
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, !notCancel];
                }
            });
        });
    };
    XhrHttpRequest.prototype._setHeaders = function () {
        // content can override the request headers
        var headers = Object.assign({}, this.headers.toObject(), this.content.headers.toObject());
        var names = Object.getOwnPropertyNames(headers);
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            var headerValue = headers[name_1];
            if (headerValue != undefined) {
                if (Array.isArray(headerValue)) {
                    for (var value in headerValue) {
                        this.xhr.setRequestHeader(name_1, value);
                    }
                }
                else {
                    this.xhr.setRequestHeader(name_1, headerValue.toString());
                }
            }
        }
    };
    XhrHttpRequest.prototype._prepareResponse = function () {
        return new XhrHttpResponse(this._filters);
    };
    XhrHttpRequest.prototype._prepareErrorResponse = function () {
        return new XhrErrorHttpResponse('There was a problem with the request', this._filters);
    };
    XhrHttpRequest.prototype._prepareTimeoutResponse = function () {
        return new XhrErrorHttpResponse("The request timed out after " + this._timeout + " seconds", this._filters);
    };
    return XhrHttpRequest;
}());
exports.XhrHttpRequest = XhrHttpRequest;
var XhrHttpResponse = /** @class */ (function () {
    function XhrHttpResponse(filters) {
        if (filters === void 0) { filters = []; }
        var _this = this;
        this._filters = filters;
        this._cancelled = false;
        var lazyException = new utilities_1.Lazy(function () { throw new Exceptions_1.InvalidOperationException(MUST_EXECUTE_RESPONSE_FIRST_MESSAGE); });
        this._lazyOk = lazyException;
        this._lazyStatus = lazyException;
        this._lazyStatusText = lazyException;
        this._lazyHeaders = lazyException;
        this._lazyresponse = lazyException;
        this._lazyresponseType = lazyException;
        this._lazyContentAsync = new utilities_1.LazyAsync(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            throw new Exceptions_1.InvalidOperationException(MUST_EXECUTE_RESPONSE_FIRST_MESSAGE);
        }); }); });
    }
    Object.defineProperty(XhrHttpResponse.prototype, "cancelled", {
        get: function () {
            return this._cancelled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XhrHttpResponse.prototype, "request", {
        get: function () {
            if (!this._request) {
                throw new Exceptions_1.InvalidOperationException(MUST_EXECUTE_RESPONSE_FIRST_MESSAGE);
            }
            return this._request;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XhrHttpResponse.prototype, "response", {
        get: function () {
            return this._lazyresponse.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XhrHttpResponse.prototype, "responseType", {
        get: function () {
            return this._lazyresponseType.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XhrHttpResponse.prototype, "status", {
        get: function () {
            return this._lazyStatus.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XhrHttpResponse.prototype, "statusText", {
        get: function () {
            return this._lazyStatusText.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XhrHttpResponse.prototype, "headers", {
        get: function () {
            return this._lazyHeaders.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XhrHttpResponse.prototype, "contentAsync", {
        get: function () {
            return this._lazyContentAsync.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XhrHttpResponse.prototype, "ok", {
        get: function () {
            return this._lazyOk.value;
        },
        enumerable: true,
        configurable: true
    });
    XhrHttpResponse.prototype.executeAsync = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(request instanceof XhrHttpRequest)) {
                            throw new utilities_1.ArgumentException('request', 'request must be of type XhrHttpRequest');
                        }
                        this._request = request;
                        this._lazyOk = new utilities_1.Lazy(function () { return request.xhr.status >= 200 && request.xhr.status < 300; });
                        this._lazyStatus = new utilities_1.Lazy(function () { return request.xhr.status; });
                        this._lazyStatusText = new utilities_1.Lazy(function () { return request.xhr.statusText; });
                        this._lazyHeaders = new utilities_1.Lazy(function () { return XhrHttpResponse._createHttpResponseHeaderCollection(request.xhr.getAllResponseHeaders()); });
                        this._lazyresponse = new utilities_1.Lazy(function () { return request.xhr.response; });
                        this._lazyresponseType = new utilities_1.Lazy(function () { return XhrHttpResponse._mapResponseType(request.xhr.responseType); });
                        this._lazyContentAsync = new utilities_1.LazyAsync(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, ResponseContentHandlers_1.ResponseContentHandlerCollection.handleAsync(this)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); });
                        _a = this;
                        return [4 /*yield*/, this._applyFiltersAsync()];
                    case 1:
                        _a._cancelled = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * applies the filters to the response
     * @returns true if the response should be cancelled.
     */
    XhrHttpResponse.prototype._applyFiltersAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var notCancel, _i, _a, filter, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        notCancel = true;
                        _i = 0, _a = this._filters;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        filter = _a[_i];
                        return [4 /*yield*/, filter.canHandleResponseAsync(this)];
                    case 2:
                        if (!_c.sent()) return [3 /*break*/, 5];
                        _b = notCancel;
                        if (!_b) return [3 /*break*/, 4];
                        return [4 /*yield*/, filter.handleResponseAsync(this)];
                    case 3:
                        _b = (!(_c.sent()) || true);
                        _c.label = 4;
                    case 4:
                        notCancel = _b;
                        _c.label = 5;
                    case 5:
                        if (!notCancel) {
                            return [3 /*break*/, 7];
                        }
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, !notCancel];
                }
            });
        });
    };
    XhrHttpResponse._createHttpResponseHeaderCollection = function (xhrHeaders) {
        var collection = new HttpResponseHeaderCollection_1.HttpResponseHeaderCollection();
        var headers = xhrHeaders.split(utilities_1.Strings.newLine);
        for (var _i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
            var header = headers_1[_i];
            var _a = utilities_1.Strings.trim(header).split(':', 2), name_2 = _a[0], value = _a[1];
            collection.add(name_2, value);
        }
        return collection;
    };
    XhrHttpResponse._mapResponseType = function (xhrResponseType) {
        switch (xhrResponseType) {
            case "": return HttpClientEnums_1.HttpResponseType.unknown;
            case "arraybuffer": return HttpClientEnums_1.HttpResponseType.arrayBuffer;
            case "blob": return HttpClientEnums_1.HttpResponseType.blob;
            case "document": return HttpClientEnums_1.HttpResponseType.document;
            case "json": return HttpClientEnums_1.HttpResponseType.json;
            case "text": return HttpClientEnums_1.HttpResponseType.text;
            default:
                throw new utilities_1.NotSupportedException("The response type '" + xhrResponseType + "' is not supported.");
        }
    };
    return XhrHttpResponse;
}());
exports.XhrHttpResponse = XhrHttpResponse;
var XhrErrorHttpResponse = /** @class */ (function (_super) {
    __extends(XhrErrorHttpResponse, _super);
    function XhrErrorHttpResponse(message, filters) {
        var _this = _super.call(this, filters) || this;
        _this.message = message;
        return _this;
    }
    return XhrErrorHttpResponse;
}(XhrHttpResponse));
exports.XhrErrorHttpResponse = XhrErrorHttpResponse;
