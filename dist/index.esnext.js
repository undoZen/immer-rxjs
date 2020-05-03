import produce from "immer";
import { pipe } from "rxjs";
import { scan } from "rxjs/operators";
function defaultMapFn(current, last) {
    Object.assign(last, current);
}
export default function produceOperator(fn, initValue) {
    if (fn === void 0) { fn = defaultMapFn; }
    if (initValue === void 0) { initValue = produce({}, function () { }); }
    return pipe(scan(function (last, current) {
        return produce(last, function (draft) {
            return fn(current, draft);
        });
    }, initValue));
}
