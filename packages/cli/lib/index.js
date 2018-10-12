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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander = __importStar(require("commander"));
var config_1 = require("./config");
var pkg = require('../../package.json');
var actionInvoked = false;
var prog = commander
    .version(pkg.version)
    .name('code-to-json')
    .arguments('<project>')
    .description('a thing')
    .option('-c,--config <path to tsconfig>', 'path to tsconfig.json')
    .action(function (project) {
    actionInvoked = true;
    setTimeout(function () {
        var allOpts = __assign({ project: project }, prog.opts());
        var validationResult = config_1.validateConfig(allOpts);
        debugger;
        if (validationResult[0] === 'error') {
            prog.outputHelp();
            throw validationResult[1];
        }
        else {
            console.log('Valid config!', validationResult[1]);
            process.exit(0);
        }
    }, 0);
})
    .parse(process.argv);
if (!actionInvoked) {
    setTimeout(function () {
        console.log(prog.help());
        process.exit(1);
    }, 0);
}
//# sourceMappingURL=index.js.map