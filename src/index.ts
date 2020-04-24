import produce from "immer";
import { pipe, Observable, UnaryFunction } from "rxjs";
import { scan } from "rxjs/operators";

function defaultMapFn<T, P>(current: T, last: P): void {
  Object.assign(last, current);
}
export default function produceOperator<
  T,
  P extends object,
  Q = Partial<T & P>
>(
  fn: (current: T, draft: Partial<T & Q>) => P | Q | void = defaultMapFn,
  initValue?: P
): UnaryFunction<Observable<T>, Observable<Partial<T & Q>>> {
  initValue = produce(initValue || {}, () => {}) as P;
  return pipe(
    scan<T, Partial<T & Q>>((last, current) => {
      return produce(last, (draft) =>
        fn!(current, draft as Partial<T & Q>)
      ) as Q;
    }, initValue)
  );
}
