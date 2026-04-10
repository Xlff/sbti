ObjC.import('Foundation');

function readText(path) {
  const content = $.NSString.stringWithContentsOfFileEncodingError(
    path,
    $.NSUTF8StringEncoding,
    null
  );
  if (!content) {
    throw new Error(`Unable to read file: ${path}`);
  }
  return ObjC.unwrap(content);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const root = '/Users/maxxie/Desktop/nsbh/sbti';
const gbtiCode = readText(`${root}/data/gbti-data.js`);
eval(gbtiCode);

const gbti = globalThis.GBTIQuizData;

assert(gbti, 'GBTIQuizData should be defined');
assert(gbti.id === 'gbti', 'GBTI quiz id should be gbti');
assert(gbti.mode === 'sequential-score', 'GBTI should stay in sequential score mode');

const initial = gbti.getInitialState();
gbti.prepareState(initial);
assert(initial.currentIndex === 0, 'GBTI state should start at the first question');
assert(gbti.getCurrentQuestion(initial).dim === '频率', 'GBTI first question dimension should match source data');

const firstOption = gbti.getCurrentQuestion(initial).options[0];
gbti.answerCurrentQuestion(initial, firstOption, 0);
assert(initial.currentIndex === 1, 'GBTI should advance after answering a question');
assert(initial.answers[0] === 0, 'GBTI should remember which option was selected');
assert(initial.scores.freq === 2, 'GBTI should add the selected option score');

gbti.stepBack(initial);
assert(initial.currentIndex === 0, 'GBTI stepBack should move back one question');
assert(initial.answers[0] === 0, 'GBTI stepBack should preserve the previous answer for selected-state rendering');
assert(initial.scores.freq === 0, 'GBTI stepBack should revert the score delta');

console.log('gbti-data tests passed');
