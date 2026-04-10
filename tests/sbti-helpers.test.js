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
const helpersCode = readText(`${root}/sbti-helpers.js`);
eval(helpersCode);

const helpers = globalThis.SBTIHelpers;

assert(helpers, 'SBTIHelpers should be defined');

const firstUnanswered = helpers.getFirstUnansweredQuestionId(
  [{ id: 'q1' }, { id: 'q2' }, { id: 'q3' }],
  { q1: 1, q3: 3 }
);
assert(firstUnanswered === 'q2', 'Should find the first unanswered question');

const noMissing = helpers.getFirstUnansweredQuestionId(
  [{ id: 'q1' }, { id: 'q2' }],
  { q1: 1, q2: 2 }
);
assert(noMissing === null, 'Should return null when all questions are answered');

const payload = helpers.buildCachedResultPayload({
  savedAt: 1712745600000,
  modeKicker: '你的主类型',
  badge: '匹配度 92%',
  special: false,
  sub: '维度命中度较高，当前结果可视为你的第一人格画像。',
  type: {
    code: 'CTRL',
    cn: '拿捏者',
    desc: '描述文本',
    intro: '简介文本'
  },
  imageSrc: '/image/CTRL.png'
});

assert(payload.version === 1, 'Cached payload should have a version');
assert(payload.type.code === 'CTRL', 'Cached payload should preserve the result type');

const fakeStorage = {
  store: {},
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  }
};

helpers.writeCachedResult(fakeStorage, payload);
const restored = helpers.readCachedResult(fakeStorage);

assert(restored.type.cn === '拿捏者', 'Restored cache should preserve Chinese type name');
assert(restored.imageSrc === '/image/CTRL.png', 'Restored cache should preserve result image');
const formattedTime = helpers.formatSavedAt(1712745600000);
assert(
  /^2024-04-10 \d{2}:\d{2}$/.test(formattedTime),
  'Saved time should be formatted as YYYY-MM-DD HH:mm'
);

assert(
  typeof helpers.getQuestionFocusTargetSelector === 'function',
  'Helpers should expose question focus target selector'
);
assert(
  helpers.getQuestionFocusTargetSelector() === '.question',
  'Question focus should target the card container instead of the first radio input'
);

console.log('sbti-helpers tests passed');
