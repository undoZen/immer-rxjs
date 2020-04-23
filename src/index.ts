import produce, { Draft } from "immer";
import { pipe, identity, Observable, UnaryFunction } from "rxjs";
import { scan } from "rxjs/operators";

function isPrimitive(val: any): boolean {
  if (typeof val === "object") {
    return val === null;
  }
  return typeof val !== "function";
}

export default function produceOperator<T, P>(
  fn: (
    current: P,
    draft: T | Partial<T & P> | Draft<Partial<T & P>>
  ) => Partial<T & P> | void,
  initValue: T
): UnaryFunction<Observable<P>, Observable<Partial<T & P>>> {
  if (!fn) {
    fn = identity;
  }
  return pipe(
    scan((last, current) => {
      if (isPrimitive(last) || isPrimitive(current)) {
        return produce(current, () => {});
      }
      return produce(last, (draft) => fn(current, draft)) as Partial<T & P>;
    }, produce(initValue, () => {}) as Partial<T & P>)
  );
}
