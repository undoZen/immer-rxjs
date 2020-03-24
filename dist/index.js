'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var produce = _interopDefault(require('immer'));
var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var fastJsonPatch = require('fast-json-patch');
var isPrimitive = _interopDefault(require('is-primitive'));

function produceOperator(fn) {
  return rxjs.pipe(
    operators.scan(([last], current) => {
      return [produce(last, draft => fn(draft, current))];
    }, []),
    operators.pluck(0),
  );
}
function mapOperator(fn) {
  return produceOperator((last, current) => {
    current = fn(current);
    if (isPrimitive(last) || isPrimitive(current)) {
      return current;
    }
    return produce(last, draft => {
      fastJsonPatch.applyPatch(draft, fastJsonPatch.compare(last, current));
    });
  });
}
function mapIdentity() {
  return mapOperator(rxjs.identity);
}

exports.default = mapIdentity;
exports.map = mapOperator;
exports.mapIdentity = mapIdentity;
exports.produce = produceOperator;
