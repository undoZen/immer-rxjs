'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var produce = _interopDefault(require('immer'));
var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var isPrimitive = _interopDefault(require('is-primitive'));

function newProduce(current, last, fn) {
  return produce(last, (draft) => fn(current, draft));
}

function produceOperator(fn) {
  if (!fn) {
    fn = rxjs.identity;
  }
  return rxjs.pipe(
    operators.scan((last, current) => {
      if (isPrimitive(last) || isPrimitive(current)) {
        return produce(current, () => {});
      }
      return newProduce(current, last, fn);
    }, null)
  );
}

module.exports = produceOperator;
