import produce from "immer";
import { pipe, identity } from "rxjs";
import { scan } from "rxjs/operators";
import isPrimitive from "is-primitive";

function produceOperator(fn, initValue) {
  if (!fn) {
    fn = identity;
  }
  return pipe(
    scan((last, current) => {
      if (!last && initValue) {
        last = produce(initValue, () => {});
      }
      if (isPrimitive(last) || isPrimitive(current)) {
        return produce(current, () => {});
      }
      return produce(last, (draft) => fn(current, draft));
    }, null)
  );
}

export default produceOperator;
