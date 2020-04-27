import produce from "immer";
import { pipe } from "rxjs";
import { scan } from "rxjs/operators";
function defaultMapFn(current, last) {
    Object.assign(last, current);
}
export default function produceOperator(fn = defaultMapFn, initValue) {
    initValue = produce(initValue || {}, () => { });
    return pipe(scan((last, current) => {
        return produce(last, (draft) => fn(current, draft));
    }, initValue));
}
