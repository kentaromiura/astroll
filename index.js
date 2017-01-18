const excludes = excludeList => key => !excludeList.includes(key);

// property we can safely ignore.
const byIgnoreList = excludes([
  'type',
  'start',
  'end',
  'loc',
  'tokens',
  'sourceType'
]);

const keys = node => Object.keys(node).filter(byIgnoreList);

const walker = (node, visitors, state, parents = []) => {
  if (typeof node !== 'object') return;
  keys(node).forEach(key => {
    let nextCallback = null;
    let visitNode = node[key];
    if (!visitNode) return;
    const nextParents = parents.slice().concat(node);

    if (Array.isArray(visitNode)) {
      visitNode.forEach(child => walker(child, visitors, state, nextParents));
    } else {
      if (nextCallback = visitors[visitNode.type]) {
        nextCallback(visitNode, state, nextParents);
      }
      walker(visitNode, visitors, state, nextParents);
    }
  });
};

module.exports = walker;
