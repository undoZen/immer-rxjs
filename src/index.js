import produce from 'immer';
import { pipe, identity } from 'rxjs';
import { scan, pluck } from 'rxjs/operators';
import { applyPatch, compare } from 'fast-json-patch';
import isPrimitive from 'is-primitive';

function produceOperator(fn) {
  return pipe(
    scan(([last], current) => {
      return [produce(last, draft => fn(draft, current))];
    }, []),
    pluck(0),
  );
}
function mapOperator(fn) {
  return produceOperator((last, current) => {
    current = fn(current);
    if (isPrimitive(last) || isPrimitive(current)) {
      return current;
    }
    return produce(last, draft => {
      applyPatch(draft, compare(last, current));
    });
  });
}
function mapIdentity() {
  return mapOperator(identity);
}
export default mapIdentity;
export { produceOperator as produce, mapOperator as map, mapIdentity };
