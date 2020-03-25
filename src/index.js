import produce from "immer";
import { pipe, identity } from "rxjs";
import { scan, pluck } from "rxjs/operators";
import isPrimitive from "is-primitive";
import newProduce from "./produce";

function produceOperator(fn, skipCompare) {
  if (!fn) {
    fn = identity;
  }
  return pipe(
    scan(([last], current) => {
      if (isPrimitive(last) || isPrimitive(current)) {
        return [produce(current, () => {})];
      }
      return [newProduce(current, last, fn, skipCompare)];
    }, []),
    pluck(0)
  );
}

export default produceOperator;
