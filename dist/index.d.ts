import { Draft } from "immer";
import { Observable, UnaryFunction } from "rxjs";
export default function produceOperator<T, P>(fn: (current: P, draft: T | Partial<T & P> | Draft<Partial<T & P>>) => Partial<T & P> | void, initValue: T): UnaryFunction<Observable<P>, Observable<Partial<T & P>>>;
