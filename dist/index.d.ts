import { Observable, UnaryFunction } from "rxjs";
export default function produceOperator<T, P extends object, Q = Partial<T & P>>(fn?: (current: T, draft: Partial<T & Q>) => P | Q | void, initValue?: P): UnaryFunction<Observable<T>, Observable<Partial<T & Q>>>;
