(function () {
  const SHARE_URL = QUIZCatalog.getShareText();
  const READY_QUIZZES = {
    sbti: window.SBTIQuizData,
    gbti: window.GBTIQuizData,
    cbti: window.CBTIQuizData
  };

  const state = {
    route: 'home',
    activeQuizId: null,
    phase: 'intro',
    quizState: null,
    result: null,
    pendingSequentialSelection: null,
    sequentialPagerUnlocked: false
  };

  const shell = document.getElementById('appShell');
  const toast = document.getElementById('toast');

  function readCache(storageKey) {
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function writeCache(storageKey, payload) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (error) {
      // Ignore storage errors on restricted browsers.
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  async function copyShareUrl() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(SHARE_URL);
      } else {
        throw new Error('clipboard unavailable');
      }
      showToast('已复制站点链接');
    } catch (error) {
      showToast('复制失败，请手动复制 https://sbt-i.com');
    }
  }

  function formatSavedAt(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  function getQuiz(id) {
    return READY_QUIZZES[id] || null;
  }

  function resetSequentialPending() {
    state.pendingSequentialSelection = null;
    window.clearTimeout(resetSequentialPending.timer);
  }

  function resetSequentialPager() {
    state.sequentialPagerUnlocked = false;
  }

  function setRoute(nextRoute, quizId = null) {
    state.route = nextRoute;
    state.activeQuizId = quizId;
    renderApp();
  }

  function renderLanding() {
    const cards = QUIZCatalog.listQuizzes().map((quizMeta) => {
      const readyQuiz = getQuiz(quizMeta.id);
      const cache = readyQuiz ? readCache(readyQuiz.storageKey) : null;
      const introItems = readyQuiz?.introItems || [];

      return `
        <article class="quiz-card ${quizMeta.status === 'coming-soon' ? 'soon' : ''}">
          <div class="quiz-card-head">
            <span class="quiz-pill">${quizMeta.shortName}</span>
            <span class="quiz-status">${quizMeta.status === 'coming-soon' ? 'COMING SOON' : 'READY'}</span>
          </div>
          <div>
            <h3>${quizMeta.name.replace(' 测试', '')}</h3>
            <p>${readyQuiz?.description || '该测试入口正在整理中。'}</p>
          </div>
          ${cache ? `
            <div class="cache-snippet">
              <strong>上次结果：${cache.title}</strong>
              <span>${cache.badge || ''}${cache.savedAt ? ` · ${formatSavedAt(cache.savedAt)}` : ''}</span>
            </div>
          ` : ''}
          <div class="quiz-meta-list">
            ${introItems.slice(0, 2).map((item) => `
              <div class="quiz-meta-item">
                <strong>${item.title}</strong>
                <span>${item.text}</span>
              </div>
            `).join('')}
          </div>
          <button class="btn ${quizMeta.status === 'coming-soon' ? 'btn-secondary' : 'btn-primary'} btn-full" data-action="${quizMeta.status === 'coming-soon' ? 'coming-soon' : 'open-quiz'}" data-quiz-id="${quizMeta.id}">
            ${quizMeta.status === 'coming-soon' ? '敬请期待' : '进入测试'}
          </button>
        </article>
      `;
    }).join('');

    shell.innerHTML = `
      <section class="panel hero-panel">
        <div class="topbar">
          <div class="brand">
            <img class="brand-mark" src="./apple-touch-icon.png" alt="SBTI" width="48" height="48" />
            <div class="brand-copy">
              <strong>SBTI Lab</strong>
              <span>一个入口，承载多种人格测试</span>
            </div>
          </div>
          <div class="topbar-actions">
            <button class="btn btn-secondary" data-action="copy-site-link">复制站点链接</button>
          </div>
        </div>

        <div class="hero-grid">
          <div class="hero-copy">
            <span class="eyebrow">人格测试集合站</span>
            <h1>SBTI，人格测试里的另一种切法。</h1>
            <p><strong>SBTI</strong> 是本站的主测试。它不急着把你塞进一个大类标签里，而是从自我、情感、态度、行动和社交五个方向切开来看，给你一份更细一点、也更有互联网语境的人格画像。<strong>GBTI</strong> 与 <strong>CBTI</strong> 则作为补充测试，用更轻量的方式延伸这种观察。</p>
            <div class="hero-stats">
              <div class="hero-stat"><strong>3</strong><span>已可用测试</span></div>
              <div class="hero-stat"><strong>独立数据</strong><span>按测试拆分维护</span></div>
              <div class="hero-stat"><strong>单入口</strong><span>统一分享链接</span></div>
            </div>
          </div>
          <div class="hero-side">
            <div class="hero-card">
              <h2>这个测试在测什么</h2>
              <p>SBTI 关注的不只是“你像哪一类人”，而是你在自我认知、关系安全感、规则感、行动风格和社交边界上的具体倾向。它更像一份层次化的人格切片，而不是一句话打包定义你。</p>
            </div>
            <div class="hero-card">
              <h2>你会得到什么</h2>
              <p>完成测试后，你会看到人格代号、核心解读和十五维度落点。它适合拿来自我观察、朋友互测和轻度分享，但不承担医学、心理或职业判断的角色。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="card-grid">${cards}</section>

      <section class="info-grid">
        <article class="panel info-card">
          <span class="info-kicker">About</span>
          <h2>关于 SBTI</h2>
          <p>SBTI 是本站的主测试，也是整个站点说明的核心。它基于五大模型、十五个维度来组织题目与结果，从人格感受、关系模式到行动风格，尝试给出一份比常规标签更细的娱乐向画像。</p>
        </article>
        <article class="panel info-card">
          <span class="info-kicker">Structure</span>
          <h2>测试结构</h2>
          <p>当前版本包含 30 道主线题，含隐藏分支。测试采用逐题作答，系统会根据每个维度的落点组合出最终人格代号，并在结果页展示对应解读，而不是只返回一个简短结论。</p>
        </article>
        <article class="panel info-card">
          <span class="info-kicker">Output</span>
          <h2>结果说明</h2>
          <p>完成测试后，你会看到人格代号、人格解读与十五维度评分。结果更适合做自我观察、朋友对照和轻量分享，不用于医学诊断、心理评估、职业筛选或其他高风险判断。</p>
        </article>
        <article class="panel info-card">
          <span class="info-kicker">Extensions</span>
          <h2>补充测试</h2>
          <p>除 SBTI 外，站内还提供 GBTI 与 CBTI 两类场景化测试。它们不是主叙事，而是基于股市语境和程序员职场语境，对你的风格倾向做更轻一点、更好分享的补充观察。</p>
        </article>
      </section>
    `;
  }

  function createWorkspaceFrame(quiz, content) {
    return `
      <section class="workspace active">
        <div class="panel workspace-frame">
          <div class="workspace-header">
            <div class="workspace-title">
              <span class="eyebrow">${quiz.eyebrow || quiz.kicker || quiz.title}</span>
              <h2>${quiz.title}</h2>
              <p>${quiz.description}</p>
            </div>
            <div class="workspace-actions">
              <button class="btn btn-ghost" data-action="go-home">返回首页</button>
              <button class="btn btn-secondary" data-action="copy-site-link">复制站点链接</button>
            </div>
          </div>
          ${content}
        </div>
      </section>
    `;
  }

  function renderIntro(quiz) {
    const cache = readCache(quiz.storageKey);
    const introCards = quiz.introItems.map((item) => `
      <div class="intro-item">
        <strong>${item.title}</strong>
        <p>${item.text}</p>
      </div>
    `).join('');

    const cacheBlock = cache ? `
      <div class="intro-card">
        <h3>上次结果</h3>
        <div class="cache-snippet">
          <strong>${cache.title}</strong>
          <span>${cache.badge || ''}${cache.savedAt ? ` · ${formatSavedAt(cache.savedAt)}` : ''}</span>
        </div>
        <p style="margin-top:12px;color:var(--muted);line-height:1.8;">结果缓存只保存在当前设备。重新提交同一测试后，会覆盖旧结果。</p>
        <div class="quiz-actions" style="margin-top:14px;">
          <button class="btn btn-secondary" data-action="view-cache" data-quiz-id="${quiz.id}">查看上次结果</button>
        </div>
      </div>
    ` : `
      <div class="intro-card">
        <h3>结果缓存</h3>
        <p style="margin:0;color:var(--muted);line-height:1.8;">你第一次完成这个测试后，结果会缓存在本地，首页卡片和测试介绍都会显示摘要。</p>
      </div>
    `;

    shell.innerHTML = createWorkspaceFrame(quiz, `
      <div class="intro-grid">
        <div class="intro-card">
          <h3>${quiz.subtitle}</h3>
          <div class="intro-list">${introCards}</div>
        </div>
        ${cacheBlock}
      </div>
      <div class="quiz-actions" style="margin-top:18px;">
        <button class="btn btn-primary" data-action="start-quiz" data-quiz-id="${quiz.id}">开始测试</button>
      </div>
    `);
  }

  function renderSequentialQuiz(quiz) {
    const question = quiz.getCurrentQuestion(state.quizState);
    const totalQuestions = quiz.getQuestionCount(state.quizState);
    const currentStep = Math.min(state.quizState.currentIndex + 1, totalQuestions);
    const progress = Math.round((currentStep / totalQuestions) * 100);
    const questionLabel = question.dim || question.category || quiz.getProgressHint(state.quizState);
    const isAnswerLocked = state.pendingSequentialSelection !== null;
    const storedAnswer = Array.isArray(state.quizState.answers)
      ? state.quizState.answers[state.quizState.currentIndex]
      : state.quizState.answers?.[question.id];
    const selectedIndex = Array.isArray(state.quizState.answers)
      ? storedAnswer
      : question.options.findIndex((option) => Number(option.value) === Number(storedAnswer));
    const hasCurrentAnswer = selectedIndex !== -1 && selectedIndex !== null && selectedIndex !== undefined;
    const optionButtons = question.options.map((option, index) => `
      <button
        class="single-option ${state.pendingSequentialSelection === index ? 'is-selected is-committing' : selectedIndex === index ? 'is-selected' : ''}"
        data-action="answer-sequential"
        data-option-index="${index}"
        ${isAnswerLocked ? 'disabled' : ''}
      >
        <span>${['A', 'B', 'C', 'D'][index] || index + 1}</span>
        <strong>${option.text || option.label}</strong>
      </button>
    `).join('');

    shell.innerHTML = createWorkspaceFrame(quiz, `
      <section class="quiz-panel">
        <div class="quiz-progress">
          <span>${quiz.getProgressText(state.quizState)}</span>
          <span>${quiz.getProgressHint(state.quizState)}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${progress}%"></div>
        </div>
        <div class="single-question" style="margin-top:18px;">
          <span class="eyebrow">${questionLabel}</span>
          <h3>${question.text}</h3>
          <p>${quiz.id === 'cbti' ? '原版支持上一题，这里也保留了后退入口。点击选项后会自动进入下一题。' : quiz.id === 'sbti' ? 'SBTI 现在也改成逐题作答，避免整屏铺满题目。点击选项后会自动进入下一题。' : '点击一个选项后会直接进入下一题。'}</p>
          <div class="option-list" style="margin-top:18px;">${optionButtons}</div>
        </div>
        <div class="quiz-actions" style="margin-top:18px;">
          <button class="btn btn-secondary" data-action="prev-sequential" ${state.quizState.currentIndex <= 0 || isAnswerLocked ? 'disabled' : ''}>上一题</button>
          ${state.sequentialPagerUnlocked ? `<button class="btn btn-secondary" data-action="next-sequential" ${state.quizState.currentIndex >= totalQuestions - 1 || !hasCurrentAnswer || isAnswerLocked ? 'disabled' : ''}>下一题</button>` : ''}
          <button class="btn btn-ghost" data-action="restart-quiz" data-quiz-id="${quiz.id}" ${isAnswerLocked ? 'disabled' : ''}>重新开始</button>
        </div>
      </section>
    `);
  }

  function renderResult(quiz) {
    const result = state.result;
    const sections = (result.sections || []).map((section) => {
      if (section.type === 'list') {
        return `
          <section class="result-section">
            <h4>${section.title}</h4>
            <div class="section-list">
              ${section.items.map((item) => `
                <div class="section-list-item">
                  <strong>${item.label} · ${item.value}</strong>
                  <span>${item.description}</span>
                </div>
              `).join('')}
            </div>
          </section>
        `;
      }

      if (section.type === 'chips') {
        return `
          <section class="result-section">
            <h4>${section.title}</h4>
            <div class="chip-list">
              ${section.items.map((item) => `<span class="chip">${item}</span>`).join('')}
            </div>
          </section>
        `;
      }

      if (section.type === 'quote') {
        return `
          <section class="result-section">
            <h4>${section.title}</h4>
            <div class="quote">${section.body}</div>
          </section>
        `;
      }

      return `
        <section class="result-section">
          <h4>${section.title}</h4>
          <p>${section.body}</p>
        </section>
      `;
    }).join('');

    const media = result.imageSrc
      ? `<div class="result-media"><img src="${result.imageSrc}" alt="${result.imageAlt || result.title}" /></div>`
      : result.emoji
        ? `<div class="result-media"><div class="result-emoji">${result.emoji}</div></div>`
        : '';

    shell.innerHTML = createWorkspaceFrame(quiz, `
      <section class="result-panel">
        ${media}
        <span class="result-kicker">${result.kicker || quiz.kicker}</span>
        <h3 class="result-title">${result.title}</h3>
        <p class="result-subtitle">${result.subtitle || result.desc || ''}</p>
        <span class="result-badge">${result.badge || '测试结果已生成'}</span>
        <div class="result-sections">${sections}</div>
        <div class="notice">${result.note || '本测试仅供娱乐。'}</div>
        <div class="quiz-actions" style="margin-top:18px;">
          <button class="btn btn-secondary" data-action="copy-site-link">复制站点链接</button>
          <button class="btn btn-primary" data-action="restart-quiz" data-quiz-id="${quiz.id}">重新测试</button>
        </div>
      </section>
    `);
  }

  function startQuiz(quizId) {
    const quiz = getQuiz(quizId);
    if (!quiz) return;
    resetSequentialPending();
    resetSequentialPager();
    state.activeQuizId = quizId;
    state.phase = 'intro';
    state.quizState = quiz.getInitialState();
    state.result = null;
    renderApp();
  }

  function beginQuizFlow(quizId) {
    const quiz = getQuiz(quizId);
    if (!quiz) return;
    resetSequentialPending();
    resetSequentialPager();
    state.activeQuizId = quizId;
    state.phase = 'quiz';
    state.result = null;
    state.quizState = quiz.getInitialState();
    quiz.prepareState(state.quizState);
    renderApp();
  }

  function answerSequential(optionIndex) {
    const quiz = getQuiz(state.activeQuizId);
    const question = quiz.getCurrentQuestion(state.quizState);
    quiz.answerCurrentQuestion(state.quizState, question.options[optionIndex], optionIndex, question);
    state.pendingSequentialSelection = null;
    if (quiz.isComplete(state.quizState)) {
      state.result = quiz.computeResult(state.quizState);
      writeCache(quiz.storageKey, state.result.cache);
      state.phase = 'result';
    }
    renderApp();
  }

  function queueSequentialAnswer(optionIndex) {
    if (state.pendingSequentialSelection !== null) return;
    state.pendingSequentialSelection = optionIndex;
    renderApp();
    window.clearTimeout(resetSequentialPending.timer);
    resetSequentialPending.timer = window.setTimeout(() => {
      answerSequential(optionIndex);
    }, 150);
  }

  function renderApp() {
    if (state.route === 'home' || !state.activeQuizId) {
      renderLanding();
      return;
    }

    const quiz = getQuiz(state.activeQuizId);
    if (!quiz) {
      renderLanding();
      return;
    }

    if (state.phase === 'intro') {
      renderIntro(quiz);
      return;
    }

    if (state.phase === 'quiz') {
      renderSequentialQuiz(quiz);
      return;
    }

    renderResult(quiz);
  }

  shell.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    const quizId = actionEl.dataset.quizId;

    if (action === 'copy-site-link') {
      copyShareUrl();
      return;
    }

    if (action === 'coming-soon') {
      showToast('该测试入口还在整理中');
      return;
    }

    if (action === 'open-quiz') {
      setRoute('workspace', quizId);
      startQuiz(quizId);
      return;
    }

    if (action === 'go-home') {
      resetSequentialPending();
      resetSequentialPager();
      state.route = 'home';
      state.activeQuizId = null;
      state.phase = 'intro';
      state.quizState = null;
      state.result = null;
      renderApp();
      return;
    }

    if (action === 'start-quiz') {
      beginQuizFlow(quizId);
      return;
    }

    if (action === 'restart-quiz') {
      beginQuizFlow(quizId);
      return;
    }

    if (action === 'view-cache') {
      const quiz = getQuiz(quizId);
      if (!quiz) return;
      const cache = readCache(quiz.storageKey);
      if (!cache) {
        showToast('当前设备还没有缓存结果');
        return;
      }
      state.activeQuizId = quizId;
      state.phase = 'result';
      state.result = {
        title: cache.title,
        kicker: '上次测试结果',
        subtitle: cache.badge || '',
        desc: cache.desc,
        badge: cache.badge || '本地缓存',
        imageSrc: cache.imageSrc,
        imageAlt: cache.title,
        note: cache.savedAt ? `缓存于 ${formatSavedAt(cache.savedAt)}` : '当前设备缓存',
        sections: [
          {
            title: '结果摘要',
            type: 'paragraph',
            body: cache.desc || '这个缓存结果没有留下额外摘要。'
          }
        ]
      };
      setRoute('workspace', quizId);
      return;
    }

    if (action === 'prev-sequential') {
      const quiz = getQuiz(state.activeQuizId);
      if (!quiz || typeof quiz.stepBack !== 'function') return;
      resetSequentialPending();
      state.sequentialPagerUnlocked = true;
      quiz.stepBack(state.quizState);
      renderApp();
      return;
    }

    if (action === 'next-sequential') {
      const quiz = getQuiz(state.activeQuizId);
      if (!quiz) return;
      const totalQuestions = quiz.getQuestionCount(state.quizState);
      if (state.quizState.currentIndex >= totalQuestions - 1) return;
      state.quizState.currentIndex += 1;
      renderApp();
      return;
    }
  });

  shell.addEventListener('click', (event) => {
    const optionButton = event.target.closest('[data-action="answer-sequential"]');
    if (!optionButton) return;
    queueSequentialAnswer(Number(optionButton.dataset.optionIndex));
  });

  renderApp();
})();
