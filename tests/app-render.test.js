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

function countOccurrences(text, pattern) {
  return text.split(pattern).length - 1;
}

function countSelectedOptions(html) {
  const matches = html.match(/class="single-option is-selected\b/g);
  return matches ? matches.length : 0;
}

class FakeElement {
  constructor(id) {
    this.id = id;
    this.innerHTML = '';
    this.textContent = '';
    this.dataset = {};
    this.listeners = {};
    this.classList = {
      add() {},
      remove() {}
    };
  }

  addEventListener(type, handler) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(handler);
  }

  triggerAction(action, dataset = {}) {
    const target = {
      dataset: { action, ...dataset },
      closest(selector) {
        if (selector === '[data-action]') return this;
        if (selector === `[data-action="${action}"]`) return this;
        return null;
      }
    };

    (this.listeners.click || []).forEach((handler) => handler({ target }));
  }

  querySelector() {
    return null;
  }
}

const root = '/Users/maxxie/Desktop/nsbh/sbti';
const shell = new FakeElement('appShell');
const toast = new FakeElement('toast');
const timeoutQueue = [];

globalThis.window = globalThis;
globalThis.navigator = { clipboard: { writeText() { return Promise.resolve(); } } };
globalThis.localStorage = {
  store: {},
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  }
};
globalThis.document = {
  head: { appendChild() {} },
  createElement() {
    return {
      defer: false,
      src: '',
      setAttribute() {}
    };
  },
  getElementById(id) {
    if (id === 'appShell') return shell;
    if (id === 'toast') return toast;
    return null;
  }
};
globalThis.location = { protocol: 'file:' };
globalThis.setTimeout = function (fn) {
  timeoutQueue.push(fn);
  return timeoutQueue.length;
};
globalThis.clearTimeout = function () {};
globalThis.HTMLInputElement = function HTMLInputElement() {};

function flushTimers() {
  while (timeoutQueue.length) {
    const job = timeoutQueue.shift();
    job();
  }
}

[
  'quiz-catalog.js',
  'data/sbti-data.js',
  'data/gbti-data.js',
  'data/cbti-data.js',
  'app.js'
].forEach((file) => {
  eval(readText(`${root}/${file}`));
});

assert(shell.innerHTML.includes('CBTI'), 'Landing page should expose the CBTI entry card');
assert(shell.innerHTML.includes('SBTI，人格测试里的另一种切法。'), 'Landing page should use the new user-facing SBTI headline');
assert(shell.innerHTML.includes('关于 SBTI'), 'Landing page should include the formal SBTI explainer section');
assert(shell.innerHTML.includes('30 道主线题，含隐藏分支'), 'Landing page should describe the real SBTI test structure');
assert(!shell.innerHTML.includes('主站核心内容'), 'Landing page should not use developer-facing hero copy');

shell.triggerAction('open-quiz', { quizId: 'cbti' });
assert(shell.innerHTML.includes('CBTI 程序员人格测试'), 'Opening CBTI should render the workspace intro');

shell.triggerAction('start-quiz', { quizId: 'cbti' });
assert(shell.innerHTML.includes('领导突然让你临时改需求'), 'Starting CBTI should render the first CBTI question');
assert(!shell.innerHTML.includes('data-action="next-sequential"'), 'Sequential quiz should not show next before the user navigates back');
assert(
  countOccurrences(shell.innerHTML, '职场生存') >= 2,
  'CBTI question view should show the category label in both progress hint and question eyebrow'
);
shell.triggerAction('answer-sequential', { optionIndex: '0' });
assert(shell.innerHTML.includes('single-option is-selected is-committing'), 'Sequential answers should show a selected animation state before advancing');
flushTimers();
assert(shell.innerHTML.includes('遇到一个从没见过的 bug'), 'CBTI should advance to the next question after selecting an option');
shell.triggerAction('prev-sequential');
assert(shell.innerHTML.includes('领导突然让你临时改需求'), 'Prev on CBTI should return to the previous question');
assert(shell.innerHTML.includes('single-option is-selected'), 'Prev on CBTI should restore the previously selected option state');
assert(countSelectedOptions(shell.innerHTML) === 1, 'Prev on CBTI should restore exactly one selected option');
assert(shell.innerHTML.includes('data-action="next-sequential"'), 'Prev on CBTI should unlock the next button');
shell.triggerAction('next-sequential');
assert(shell.innerHTML.includes('遇到一个从没见过的 bug'), 'Next on CBTI should return to the following question after a backtrack');

shell.triggerAction('go-home');
shell.triggerAction('open-quiz', { quizId: 'sbti' });
shell.triggerAction('start-quiz', { quizId: 'sbti' });
assert(shell.innerHTML.includes('上一题'), 'SBTI should now use the sequential quiz shell');
assert(!shell.innerHTML.includes('提交并查看结果'), 'SBTI should no longer render the old batch submit footer');
shell.triggerAction('answer-sequential', { optionIndex: '0' });
flushTimers();
shell.triggerAction('prev-sequential');
assert(countSelectedOptions(shell.innerHTML) === 1, 'Prev on SBTI should not render multiple selected options');
assert(shell.innerHTML.includes('data-action="next-sequential"'), 'Prev on SBTI should also unlock the next button');

console.log('app-render tests passed');
