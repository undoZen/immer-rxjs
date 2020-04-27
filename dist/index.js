(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "immer", "rxjs", "rxjs/operators"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const immer_1 = tslib_1.__importDefault(require("immer"));
    const rxjs_1 = require("rxjs");
    const operators_1 = require("rxjs/operators");
    function defaultMapFn(current, last) {
        Object.assign(last, current);
    }
    function produceOperator(fn = defaultMapFn, initValue) {
        initValue = immer_1.default(initValue || {}, () => { });
        return rxjs_1.pipe(operators_1.scan((last, current) => {
            return immer_1.default(last, (draft) => fn(current, draft));
        }, initValue));
    }
    exports.default = produceOperator;
});
