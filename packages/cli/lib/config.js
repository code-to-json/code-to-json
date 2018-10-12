"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var validators_1 = require("./validators");
var path = __importStar(require("path"));
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(message, feedback) {
        var _this = _super.call(this, message + ("\n" + JSON.stringify(feedback))) || this;
        _this.feedback = feedback;
        return _this;
    }
    ValidationError.prototype.toString = function () {
        var _this = this;
        return _super.prototype.toString.call(this) + "\n" + Object.keys(this.feedback)
            .map(function (f) {
            return "  " + f.toUpperCase() + "\n   " + _this.feedback[f].join('\n') + "\n";
        })
            .join('');
    };
    return ValidationError;
}(Error));
exports.ValidationError = ValidationError;
function validateProjectPath(rawPath, errors) {
    var pathErrors = [];
    if (typeof rawPath !== 'string') {
        pathErrors.push('path must be a string');
    }
    if (validators_1.isEmpty(rawPath)) {
        pathErrors.push('path must not be empty');
    }
    if (validators_1.isDirectoryThatExists(path.join(process.cwd(), rawPath))) {
        console.error('----', path.join(process.cwd(), rawPath));
        pathErrors.push('path must point to a folder that exists');
    }
    if (pathErrors.length > 0) {
        errors.path = pathErrors;
    }
}
function validateConfig(rawOptions) {
    var validationErrors = {};
    var projPath = rawOptions.project;
    validateProjectPath(projPath, validationErrors);
    if (Object.keys(validationErrors).length === 0) {
        return ['ok', { projectPath: projPath }];
    }
    else {
        return [
            'error',
            new ValidationError('configuration is invalid', validationErrors)
        ];
    }
}
exports.validateConfig = validateConfig;
//# sourceMappingURL=config.js.map