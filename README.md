# immer-rxjs
This small library helps you use Immer with RxJS. It exports two main functions:

## `produce()`

Use it as Immer's [Curried producers](https://immerjs.github.io/immer/docs/curried-produce).

```javascript
import {produce} from 'immer-rxjs'

source$.pipe(
  produce((draft, newValueFromSource) {
    // draft will be last value, undefined if it's the first
    if (isPrimitive(draft)) {
      return newValueFromSource
    }
    draft.someProp = newValueFromSource.someProp
  })
)
```

## `map()`
a map function leveraging `fast-json-patch` and `is-primitive` module to "immerify" your mapped object.

```javascript
import {map} from 'immer-rxjs'

const sub$ = new Subject()
sub$.pipe(
  map(a => ({...a, a.b: a.b + 1}))
)
sub$.next({b: 2})
sub$.next({b: 2})
// which results {b: 3} and {b: 3} and you know what? they tow are identical!
// so you can save your React render call or other things base on value check
```

## `mapIdentity()`
just like run `map(identity())`, it also exports as default, so you can do:
```javascript
import immerify from 'immer-rxjs'
source$.pipe(immerify())
```

# License
MIT
