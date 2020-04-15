import produce from "immer";
import { applyPatch, compare } from "fast-json-patch";
export default function newProduce(current, last, fn, skipCompare) {
  return produce(last, (draft) => {
    let patches;
    let returned;
    const result = produce(last, (innerDraft) => {
      returned = fn(current, innerDraft);
      if (returned === undefined) {
        return;
      }
      if (!skipCompare) {
        patches = compare(last, returned);
      }
    });
    if (skipCompare) {
      return result;
    }
    if (!patches) {
      patches = compare(last, result);
    }
    applyPatch(draft, patches);
  });
}
