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
exports.__esModule = true;
exports.eventProcessor = exports.InvalidBodyError = exports.EmptyBodyError = void 0;
var ajv_1 = require("ajv");
var ajv = new ajv_1["default"]();
var EmptyBodyError = /** @class */ (function (_super) {
    __extends(EmptyBodyError, _super);
    function EmptyBodyError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EmptyBodyError;
}(Error));
exports.EmptyBodyError = EmptyBodyError;
var InvalidBodyError = /** @class */ (function (_super) {
    __extends(InvalidBodyError, _super);
    function InvalidBodyError(errors) {
        var _this = _super.call(this) || this;
        _this.errors = errors;
        return _this;
    }
    return InvalidBodyError;
}(Error));
exports.InvalidBodyError = InvalidBodyError;
var eventProcessor = function (schema, event) {
    if (event.body === null) {
        throw new EmptyBodyError();
    }
    var validate = ajv.compile(schema);
    var body = JSON.parse(event.body);
    if (!validate(body)) {
        throw new InvalidBodyError(validate.errors);
    }
    return body;
};
exports.eventProcessor = eventProcessor;
