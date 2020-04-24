# immer-rxjs
This small library helps you use Immer with RxJS. It exports only one function, you can use it to replace rxjs's `map` operator.

## update in 3.0.0
At beginning I want to compute and reapply patches by fast-json-patch so I could be sure if the produced value is structurally identical to previous value, the result will be identically be the same, but late on I find that is a bad idea (user should be clear about that) so I turned it off by default in 2.0.0 and removed it in 3.0.0.

## Usage

Let's just review the final source code here:

```javascript
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
```

so how we use it:

## `produce()`
```javascript
import produce from 'immer-rxjs'
source$.pipe(produce(producer))
```

The `produce` function is like Immer's [Curried producers](https://immerjs.github.io/immer/docs/curried-produce) except that it expect new value from `source$` (like `action` of curried producer) be the first argument and `draft` to be the second.

You can edit draft object like in immer producer:

```javascript
import {produce} from 'immer-rxjs'

source$.pipe(
  produce((newValueFromSource, draft) {
    // draft will be previous value you produced here, starting with an empty object
    draft.someProp = newValueFromSource.someProp
  })
)
```

or you can just return new value from it, that way you can treat it like a `map` operator replacement. but it's not recommended as below

not recommended to do this since it return new object every time:
```javascript
import immerMap from 'immer-rxjs'
const sub$ = new Subject();
sub$
  .pipe(
    immerMap((a) => ({ ...a, b: a.b + 1 })),
    bufferCount(2)
  )
  .subscribe(([v1, v2]) => {
    console.log(v1); // {b: 3}
    console.log(v2); // {b: 3}
    console.log(v1 === v2); // false
  });
sub$.next({ b: 2 });
sub$.next({ b: 2 });
```

this is better
```javascript
import immerMap from 'immer-rxjs'
const sub$ = new Subject();
sub$
  .pipe(
    immerMap((a, draft) => {
      Object.assign(draft, { b: a.b + 1 });
    }),
    bufferCount(2)
  )
  .subscribe(([v1, v2]) => {
    console.log(v1); // {b: 3}
    console.log(v2); // {b: 3}
    console.log(v1 === v2); // true
  });
sub$.next({ b: 2 });
sub$.next({ b: 2 });
```

## `immerify()`
default fn is `(current, last) => {Object.assign(last, current)}`, you can do:
```javascript
import immerify from 'immer-rxjs'
const sub$ = new Subject();
sub$
  .pipe(immerify())
  .subscribe(([v1, v2]) => {
    console.log(v1); // {b: 2}
    console.log(v2); // {b: 2}
    console.log(v1 === v2); // true
  });
sub$.next({ b: 2 });
sub$.next({ b: 2 });
```

# License
MIT
