import produce, { Draft } from "immer";
import { pipe, identity, Observable, UnaryFunction } from "rxjs";
import { scan } from "rxjs/operators";

function isPrimitive(val: any): boolean {
  if (typeof val === "object") {
    return val === null;
  }
  return typeof val !== "function";
}

export default function produceOperator<T, P, Q = Partial<T & P>>(
  fn?: (current: T, draft: Partial<T & Q>) => T | P | Q | void,
  initValue?: P
): UnaryFunction<Observable<T>, Observable<Partial<T & Q>>> {
  if (!fn) {
    fn = identity;
  }
  initValue = produce(initValue, () => {}) as P;
  return pipe(
    scan<T, Partial<T & Q>>((last, current) => {
      if (isPrimitive(last) || isPrimitive(current)) {
        return produce(current, () => {});
      }
      return produce(last, (draft) =>
        fn!(current, draft as Partial<T & Q>)
      ) as Q;
    }, initValue)
  );
}
