import produce from "immer";
import { pipe, identity } from "rxjs";
import { scan } from "rxjs/operators";
import isPrimitive from "is-primitive";

function newProduce(current, last, fn) {
  return produce(last, (draft) => fn(current, draft));
}

function produceOperator(fn) {
  if (!fn) {
    fn = identity;
  }
  return pipe(
    scan((last, current) => {
      if (isPrimitive(last) || isPrimitive(current)) {
        return produce(current, () => {});
      }
      return newProduce(current, last, fn);
    }, null)
  );
}

export default produceOperator;
