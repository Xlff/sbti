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
const originalRandom = Math.random;
Math.random = () => 0;
eval(readText(`${root}/data/sbti-data.js`));
Math.random = originalRandom;

const sbti = globalThis.SBTIQuizData;

assert(sbti, 'SBTIQuizData should be defined');
assert(sbti.id === 'sbti', 'SBTI quiz id should be sbti');
assert(sbti.mode === 'sequential-choice', 'SBTI should use sequential single-question mode');

const initial = sbti.getInitialState();
Math.random = () => 0;
sbti.prepareState(initial);
Math.random = originalRandom;

assert(initial.currentIndex === 0, 'SBTI state should start at the first question');
assert(typeof sbti.getCurrentQuestion(initial).id === 'string', 'SBTI should expose the current question in sequential mode');
assert(typeof sbti.getQuestionCount(initial) === 'number', 'SBTI should expose a question count for sequential progress');

const firstQuestion = sbti.getCurrentQuestion(initial);
const firstOption = firstQuestion.options[0];
sbti.answerCurrentQuestion(initial, firstOption, 0, firstQuestion);
assert(initial.currentIndex === 1, 'SBTI should advance after one answer');
assert(initial.answers[firstQuestion.id] === Number(firstOption.value), 'SBTI should persist the selected answer value');

sbti.stepBack(initial);
assert(initial.currentIndex === 0, 'SBTI stepBack should move back one question');
assert(initial.answers[firstQuestion.id] === Number(firstOption.value), 'SBTI stepBack should preserve the prior answer for selected-state rendering');

console.log('sbti-data tests passed');
