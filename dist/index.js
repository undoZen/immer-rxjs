import produce from "immer";
import { pipe, identity } from "rxjs";
import { scan } from "rxjs/operators";
function isPrimitive(val) {
    if (typeof val === "object") {
        return val === null;
    }
    return typeof val !== "function";
}
export default function produceOperator(fn, initValue) {
    if (!fn) {
        fn = identity;
    }
    return pipe(scan((last, current) => {
        if (isPrimitive(last) || isPrimitive(current)) {
            return produce(current, () => { });
        }
        return produce(last, (draft) => fn(current, draft));
    }, produce(initValue, () => { })));
}
