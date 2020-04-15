# immer-rxjs
This small library helps you use Immer with RxJS. It exports only one function, you can use it to replace rxjs's `map` operator:

## `produce()`

```javascript
import produce from 'immer-rxjs'
source$.pipe(produce(producer, applyCompare))
```

The `produce` function is like Immer's [Curried producers](https://immerjs.github.io/immer/docs/curried-produce) except that it expect new value from `source$` (like `action` of curried producer) be the first argument and `draft` to be the second.

You can edit draft object like in immer producer:

```javascript
import {produce} from 'immer-rxjs'

source$.pipe(
  produce((newValueFromSource, draft) {
    // draft will be previous value from source$, starting with undefined
    if (isPrimitive(draft)) {
      return newValueFromSource
    }
    draft.someProp = newValueFromSource.someProp
  }, true)
)
```

or you can just return new value from it, that way you can treat it like a `map` operator replacement.

If you pass second argument as true, your edited draft or returned value will be compared with previous value by `fast-json-patch` and then reapplied, in order to make sure when the previous value and current value are structurally the same, they will be identical. So you can save your React render call or other things base on value equality check.

```javascript
import immerMap from 'immer-rxjs'

const sub$ = new Subject()
sub$.pipe(
  immerMap(a => ({...a, a.b: a.b + 1}), true),
  buffer(2),
).subscript(([v1, v2]) => {
  console.log(v1) // {b: 3}
  console.log(v2) // {b: 3}
  console.log(v1 === v2) // true
})
sub$.next({b: 2})
sub$.next({b: 2})
```

Default value of `applyCompare` is `false`, just leave it if you just want to use `immerMap()` to get `previousValue` as `draft` to edit.

## `mapIdentity()`
Like running `map(identity())`, it also exports as default, so you can do:
```javascript
import immerify from 'immer-rxjs'
source$.pipe(immerify())
```

# License
MIT
