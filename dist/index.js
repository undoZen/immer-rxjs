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
    var tslib_1 = require("tslib");
    var immer_1 = tslib_1.__importDefault(require("immer"));
    var rxjs_1 = require("rxjs");
    var operators_1 = require("rxjs/operators");
    function defaultMapFn(current, last) {
        Object.assign(last, current);
    }
    function produceOperator(fn, initValue) {
        if (fn === void 0) { fn = defaultMapFn; }
        if (initValue === void 0) { initValue = immer_1.default({}, function () { }); }
        return rxjs_1.pipe(operators_1.scan(function (last, current) {
            return immer_1.default(last, function (draft) {
                return fn(current, draft);
            });
        }, initValue));
    }
    exports.default = produceOperator;
});
