'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var produce = _interopDefault(require('immer'));
var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var isPrimitive = _interopDefault(require('is-primitive'));

function produceOperator(fn) {
  if (!fn) {
    fn = rxjs.identity;
  }
  return rxjs.pipe(
    operators.scan((last, current) => {
      if (isPrimitive(last) || isPrimitive(current)) {
        return produce(current, () => {});
      }
      return produce(last, (draft) => fn(current, draft));
    }, null)
  );
}

module.exports = produceOperator;
