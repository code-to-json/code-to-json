"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
function get(obj, propname) {
    if (obj && typeof obj === 'object')
        return obj[propname];
    else
        return undefined;
}
function isEmpty(obj) {
    var none = obj === null || obj === undefined;
    if (none) {
        return none;
    }
    if (typeof obj.size === 'number') {
        return !obj.size;
    }
    var objectType = typeof obj;
    if (objectType === 'object') {
        var size = get(obj, 'size');
        if (typeof size === 'number') {
            return !size;
        }
    }
    if (typeof obj.length === 'number' && objectType !== 'function') {
        return !obj.length;
    }
    if (objectType === 'object') {
        var length_1 = get(obj, 'length');
        if (typeof length_1 === 'number') {
            return !length_1;
        }
    }
    return false;
}
exports.isEmpty = isEmpty;
function isBlank(obj) {
    return isEmpty(obj) || (typeof obj === 'string' && /\S/.test(obj) === false);
}
exports.isBlank = isBlank;
function isPresent(obj) {
    return !isBlank(obj);
}
exports.isPresent = isPresent;
function isDirectoryThatExists(pathString) {
    return fs.existsSync(pathString) && fs.lstatSync(pathString).isDirectory();
}
exports.isDirectoryThatExists = isDirectoryThatExists;
//# sourceMappingURL=validators.js.map