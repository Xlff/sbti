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
const cbtiCode = readText(`${root}/data/cbti-data.js`);
eval(cbtiCode);

const cbti = globalThis.CBTIQuizData;

assert(cbti, 'CBTIQuizData should be defined');
assert(cbti.id === 'cbti', 'CBTI quiz id should be cbti');
assert(cbti.status === 'ready', 'CBTI quiz should be ready');
assert(cbti.mode === 'sequential-score', 'CBTI should use sequential score mode');
assert(cbti.getQuestionCount() === 8, 'CBTI should expose the original 8 questions');

const initial = cbti.getInitialState();
cbti.prepareState(initial);
assert(initial.currentIndex === 0, 'CBTI state should start at the first question');
assert(cbti.getCurrentQuestion(initial).category === '职场生存', 'CBTI first question category should match source data');

const firstOption = cbti.getCurrentQuestion(initial).options[0];
cbti.answerCurrentQuestion(initial, firstOption, 0);
assert(initial.currentIndex === 1, 'Answering one CBTI question should advance to the next question');
assert(initial.answers[0] === 0, 'CBTI should remember the selected option index for step back');

cbti.stepBack(initial);
assert(initial.currentIndex === 0, 'CBTI stepBack should return to the previous question');
assert(initial.answers[0] === 0, 'CBTI stepBack should preserve the stored answer for selected-state rendering');
assert(initial.scores['锅都是别人的'] === 0, 'CBTI stepBack should roll back boosted persona scores');

const result = cbti.computeResult({
  currentIndex: 8,
  answers: [],
  scores: {
    环境都配不明白: 0,
    增删改查小王子: 0,
    'CV 工程师': 12,
    锅都是别人的: 1,
    'PPT 比代码溜': 0,
    开源白嫖怪: 0,
    卷王本王: 0,
    带薪拉屎小能手: 0,
    公司永动机: 0,
    三不管外包仔: 0,
    年年述职年年挂: 0,
    小组长背锅专业户: 0,
    职场游牧民: 0,
    活化石摆烂怪: 0,
    技术宅男本宅: 0,
    会议背景板: 0,
    '35 岁待宰羔羊': 0,
    大厂高P困难户: 0,
    '小厂 CTO 打杂王': 0
  }
});

assert(result.title === 'CV 工程师', 'CBTI result should pick the highest scoring persona');
assert(result.sections[0].title === '人格解读', 'CBTI result should include a description section');
assert(result.sections[1].title === '匹配度 Top 5', 'CBTI result should include top-5 scores');
assert(result.cache.title === 'CV 工程师', 'CBTI result cache should keep the winner title');

console.log('cbti-data tests passed');
