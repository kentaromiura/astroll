const babylon = require('babylon');
const fs = require('fs');
const path = require('path');

const astroll = require('..');

const fixtureText = String(
  fs.readFileSync(
    path.resolve(__dirname, './__fixtures__/jestExample.txt')
  )
);

test('Should be able to find toMatchSnapshot', () => {

  const file = babylon.parse(fixtureText, {
    sourceType: 'module',
    plugins: ['jsx']
  });

  const state = {
    found: []
  };

  astroll(file, {
    Identifier(node, state) {
      if (node.name === 'toMatchSnapshot') {
        state.found.push(node);
      }
    }
  }, state);

  expect(state.found.length).toBe(1);

});

test('Should get the correct `test` parent from the snapshot', () => {
  const file = babylon.parse(fixtureText, {
    sourceType: 'module',
    plugins: ['jsx']
  });

  const state = {
    found: []
  };

  astroll(file, {
    Identifier(node, state, parents) {
      if (node.name === 'toMatchSnapshot') {
        state.found.push({node, parents});
      }
    }
  }, state);

  const toMatchSnapshot = state.found[0];
  let findCall = toMatchSnapshot.parents.reverse().find(
    parent => parent.callee && parent.callee.name === 'test'
  );

  expect(
    findCall.arguments[0].value
  ).toBe('something very important to test');
});
