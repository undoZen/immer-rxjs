# immer-rxjs
This small library helps you use Immer with RxJS. It exports only one function, you can use it to replace rxjs's `map` operator:

## `produce()`

```javascript
import produce from 'immer-rxjs'
source$.pipe(produce(producer, skipCompare))
```

The `producer` function is like Immer's [Curried producers](https://immerjs.github.io/immer/docs/curried-produce) except that it expect new value from `source$` (like `action` from curried producer) be the first argument and `draft` to the be second.

you can edit draft object like in immer producer:

```javascript
import {produce} from 'immer-rxjs'

source$.pipe(
  produce((newValueFromSource, draft) {
    // draft will be previous value from source$, starting with undefined
    if (isPrimitive(draft)) {
      return newValueFromSource
    }
    draft.someProp = newValueFromSource.someProp
  })
)
```

or you can just return new value from it, that way you can treat it like a `map` operator replacement.

By default, your edited draft or returned value will be compared with previous value by `fast-json-patch` and then reapplied, in order to make sure when the previous value and current value are structurally the same, they will be identical. So you can save your React render call or other things base on value equality check.

```javascript
import immerMap from 'immer-rxjs'

const sub$ = new Subject()
sub$.pipe(
  immerMap(a => ({...a, a.b: a.b + 1})),
  buffer(2),
).subscript(([v1, v2]) => {
  console.log(v1) // {b: 3}
  console.log(v1 === v2) // true
})
sub$.next({b: 2})
sub$.next({b: 2})
```

You can suppress the value comparision by pass second value `true` to `produce()`, this way you just use  to get `previousValue` as `draft` to edit.

## `mapIdentity()`
just like run `map(identity())`, it also exports as default, so you can do:
```javascript
import immerify from 'immer-rxjs'
source$.pipe(immerify())
```

# License
MIT
