'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var produce = _interopDefault(require('immer'));
var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var isPrimitive = _interopDefault(require('is-primitive'));
var fastJsonPatch = require('fast-json-patch');

function newProduce(current, last, fn, skipCompare) {
  return produce(last, draft => {
    let patches;
    let returned;
    const result = produce(last, innerDraft => {
      returned = fn(current, innerDraft);
      if (returned === undefined) {
        return;
      }
      if (!skipCompare) {
        patches = fastJsonPatch.compare(last, returned);
      }
    });
    if (skipCompare) {
      return result;
    }
    if (!patches) {
      patches = fastJsonPatch.compare(last, result);
    }
    fastJsonPatch.applyPatch(draft, patches);
  });
}

function produceOperator(fn, skipCompare) {
  if (!fn) {
    fn = rxjs.identity;
  }
  return rxjs.pipe(
    operators.scan(([last], current) => {
      if (isPrimitive(last) || isPrimitive(current)) {
        return [produce(current, () => {})];
      }
      return [newProduce(current, last, fn, skipCompare)];
    }, []),
    operators.pluck(0)
  );
}

module.exports = produceOperator;
