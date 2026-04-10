(function (global) {
const personas = {
  环境都配不明白:
    "你每天问的最多的问题是「这个环境怎么配？」刚学会 git add，就敢说自己会版本管理了。领导让你改个按钮颜色，你能研究一下午。不是这代码怎么这么难写啊？？？能跑起来就谢天谢地了，至于为什么能跑？那是哲学问题。",

  增删改查小王子:
    "你就是公司流水线上最稳定的螺丝钉。增删改查写了三年，感觉自己已经是数据库大师了。你不关心架构，只关心今天中午食堂吃什么，下午茶有没有奶茶。别问技术，问就是「能跑就行」。",

  "CV 工程师":
    "Ctrl+C 和 Ctrl+V 是你的左右护法，StackOverflow 是你的技术总监。你坚信天下代码一大抄，改个变量名就是原创。AI 补全是你的亲爹，ChatGPT 是你的再生父母，GitHub Copilot 是你失散多年的亲哥。不会复制粘贴的程序员不是好码农！",

  锅都是别人的:
    "这个 bug 肯定是测试环境的问题！肯定是产品需求没说清楚！肯定是前端传参有问题！反正不可能是我的问题。复盘会上你永远能找到背锅的倒霉蛋，甩锅技术出神入化。什么叫做你把同事的剩余价值献给领导了？",

  "PPT 比代码溜":
    "你的 PPT 比代码写得好，架构图画得比项目还复杂。什么微服务、中台、领域驱动，张口就来。一问落地方案就开始打太极：「这个要看具体业务场景。」代码三年没写过，但会议从不缺席，嘴遁等级 MAX。画饼画到自己都信了。",

  开源白嫖怪:
    "GitHub 上 star 了 8000 个项目，自己的代码 star 数是 3，其中 2 个还是自己小号点的。你逢人就说自己给某某开源项目提过 PR，但其实只是改了个 README 的错别字。简历上写着「活跃的开源贡献者」，实际上只会提 issue 当伸手党。你就是传说中的「开源白嫖怪」。",

  卷王本王:
    "别人下班你加班，别人周末你上班，别人请假你全勤。你把领导的朋友圈点赞完了，把同事的绩效卷完了，最后发现工资还是那么多。你觉得这是奋斗，领导觉得这是应该的。你就是传说中的「公司毒瘤」，同事背地里都在骂你。卷王本王，实至名归。",

  带薪拉屎小能手:
    "工作日不在群里讲话是想干什么，给资本家当走狗吗？你把带薪拉屎的时间精确到分钟，厕所隔间是你的办公室分部。电脑上永远开着三个窗口：代码、文档、摸鱼网站，Boss 键按得比谁都快。你是新时代的摸鱼领袖，公司的头号废物，干啥啥不行，摸鱼第一名。",

  公司永动机:
    "项目延期你背锅，需求变更你背锅，线上故障你背锅。你每天默默干活从不邀功，但出了问题第一个想到你。你的座右铭是「多做事少说话」，领导的评价是「踏实肯干」，实际翻译过来就是「老实人，好欺负」。不是这砖怎么搬不完啊？？？你就是公司的永动机，不给钱也能转。",

  三不管外包仔:
    "你在甲方公司上班，用的是乙方公司的邮箱，拿的是外包公司的工资。甲方的下午茶你吃不到，正式员工的期权你拿不到，裁员的时候你第一个走。你就像公司的临时工，干最累的活，背最重的锅。劳动法在哪？你就是传说中的「三不管人员」，谁都能使唤你。",

  年年述职年年挂:
    "你能独立完成需求，但永远接不到核心项目。晋升述职准备了三个月，PPT 改了八百遍，最后被告知「再等等，今年 HC 不够」。你的技术不差，但就是没有存在感。你怀疑自己是不是公司最透明的那个人，领导路过你工位都不带看你一眼的。年年述职年年挂，你就是晋升的绝缘体。",

  小组长背锅专业户:
    "你刚当上小组长就开始背锅，美其名曰「技术小 Leader」，实际上就是背锅 Leader。你给下属画饼，领导给你画饼，大家都在饼海里畅游。你的日常就是开会、写周报、应付各种甩锅和扯皮。代码？那是什么东西？你已经三个月没碰过代码了，但你每天脸上挂着命很苦的商业化笑容。",

  职场游牧民:
    "你的简历比小说还精彩，每家公司都待不到一年。你把跳槽当升职，把试用期当体验卡。你精通面试八股文，背算法题比背单词还溜。你不是在跳槽，就是在准备跳槽的路上。HR 看到你的简历直接扔垃圾桶：「这人怎么跟打游击似的？」你就是职场游牧民，四海为家，到哪都是外人。",

  活化石摆烂怪:
    "你在公司待了五年，技术还停留在入职那天。你的生存之道是「不出错就是最大的功劳」。新技术你不学，新项目你不接，每天准时下班雷打不动。你觉得公司开不掉你，实际上领导早就想换人了，只是暂时找不到替代品。你就是公司的「活化石」，见证了无数新人来了又走，而你依然坚挺。摆烂界的扛把子，佛系到让人怀疑人生。",

  技术宅男本宅:
    "技术确实牛逼，但就是藏不住一身屌丝气质。你穿着拖鞋和大裤衩去见客户，讲技术方案时抠脚。你觉得技术才是硬道理，形象都是虚的。结果客户看你的眼神像看搬砖的，项目黄了一半都怪你形象不行。虽然你的技术已经够得上当专家了，但由内而外的屌丝气质让客户完全不能信任你。你就是传说中的「技术宅男」，能处理服务器宕机，处理不了人际关系。",

  会议背景板:
    "你的日历被会议填满，一天八个会，每个会都要你参加。你在会上从不发言，但不叫你又不行。开会时你在写代码，写代码时你在开会。你怀疑公司付你工资就是让你凑人数的，你的工位就是会议室的传送门。你就是会议界的「背景板」，存在感为零但缺一不可。你的梦想是有一天能不开会，但这辈子估计没戏。",

  "35 岁待宰羔羊":
    "你今年 35，技术不如年轻人，体力不如年轻人，工资还比年轻人高。你每天焦虑到失眠，疯狂学新技术想证明自己还有价值。你害怕裁员，害怕降薪，害怕被优化。你觉得自己就是公司随时要扔掉的旧手机，用了好几年，该换新款了。你每天刷脉脉看裁员消息，生怕下一个就是自己。你就是职场的「待宰羔羊」，随时准备领 N+1。",

  大厂高P困难户:
    "你在大厂混到了高级别，能带团队了，但其实就是高级螺丝钉。你负责的系统很核心，但你说了不算。晋升述职了三年，年年都是「再努力努力，差一点点」。你的期权套现了几百万，但你知道这辈子可能就到这儿了。你就是传说中的「被 35 岁优化预备队」。你每天活在焦虑中，一边数着钱一边怀疑人生。",

  "小厂 CTO 打杂王":
    "你在十几个人的创业公司当 CTO，听起来很牛逼，实际上就是全栈打杂。前端后端运维客服你都要干，周末还要修路由器，甚至要帮老板装个打印机。老板给你画饼说上市就分期权，你觉得自己是在创业，实际上只是在打工。你是 CTO，也是 CEO（Chief Everything Officer）。你就是公司的「万金油」，哪里需要哪里搬，比 502 胶水还万能。",
};

const questions = [
  {
    id: 1,
    category: "职场生存",
    text: "领导突然让你临时改需求，上线时间不变，你的第一反应是？",
    options: [
      {
        text: "先甩锅给产品经理，说需求不明确",
        boost: { 锅都是别人的: 5, 职场游牧民: 2 },
      },
      {
        text: "默默加班干活，反正说了也没用",
        boost: { 公司永动机: 6, 牛马本马: 3 },
      },
      {
        text: "立刻开始画饼：架构要优化，需要时间",
        boost: { "PPT 比代码溜": 5, 小组长背锅专业户: 2 },
      },
      {
        text: "摸鱼拖到最后一天再说",
        boost: { 带薪拉屎小能手: 5, 活化石摆烂怪: 2 },
      },
    ],
  },
  {
    id: 2,
    category: "技术能力",
    text: "遇到一个从没见过的 bug，你会？",
    options: [
      {
        text: "StackOverflow + ChatGPT 疯狂搜索",
        boost: { "CV 工程师": 6, 增删改查小王子: 2 },
      },
      {
        text: "先看看能不能重启解决",
        boost: { 环境都配不明白: 6, 三不管外包仔: 2 },
      },
      {
        text: "分析日志，定位问题根源",
        boost: { 技术宅男本宅: 6, 大厂高P困难户: 2 },
      },
      {
        text: "找个借口说这不是我的问题",
        boost: { 锅都是别人的: 4, 会议背景板: 2 },
      },
    ],
  },
  {
    id: 3,
    category: "职场心态",
    text: "同事下班了，你还在加班，此时你的内心OS是？",
    options: [
      { text: "我要卷死他们，让领导看到我的努力", boost: { 卷王本王: 7 } },
      {
        text: "又是被动加班的一天，命苦啊",
        boost: { 公司永动机: 5, 年年述职年年挂: 2 },
      },
      {
        text: "其实我在摸鱼，只是看起来在加班",
        boost: { 带薪拉屎小能手: 6, 会议背景板: 2 },
      },
      {
        text: "准备跳槽，这破公司待不下去了",
        boost: { 职场游牧民: 6, "35 岁待宰羔羊": 2 },
      },
    ],
  },
  {
    id: 4,
    category: "工作方式",
    text: "你的日常工作主要是？",
    options: [
      {
        text: "开会、写周报、画饼",
        boost: { 小组长背锅专业户: 6, "PPT 比代码溜": 3, 会议背景板: 2 },
      },
      {
        text: "增删改查，重复劳动",
        boost: { 增删改查小王子: 7, 三不管外包仔: 2 },
      },
      { text: "全栈打杂，什么都干", boost: { "小厂 CTO 打杂王": 7 } },
      {
        text: "写代码、调 bug、背锅",
        boost: { 公司永动机: 5, "CV 工程师": 2 },
      },
    ],
  },
  {
    id: 5,
    category: "职场定位",
    text: "在公司里，你的角色更像是？",
    options: [
      {
        text: "背锅侠，出事第一个想到我",
        boost: { 公司永动机: 6, 小组长背锅专业户: 2 },
      },
      { text: "外包，干活最多，待遇最差", boost: { 三不管外包仔: 7 } },
      {
        text: "小组长，天天开会写周报",
        boost: { 小组长背锅专业户: 6, "PPT 比代码溜": 2 },
      },
      {
        text: "透明人，存在感为零",
        boost: { 年年述职年年挂: 5, 会议背景板: 4 },
      },
    ],
  },
  {
    id: 6,
    category: "职场压力",
    text: "你最害怕的事情是？",
    options: [
      { text: "35岁被优化，失业", boost: { "35 岁待宰羔羊": 8 } },
      {
        text: "晋升失败，一直原地踏步",
        boost: { 年年述职年年挂: 6, 大厂高P困难户: 2 },
      },
      {
        text: "技术跟不上，被年轻人替代",
        boost: { "35 岁待宰羔羊": 5, 活化石摆烂怪: 3 },
      },
      {
        text: "什么都不怕，佛系躺平",
        boost: { 带薪拉屎小能手: 5, 活化石摆烂怪: 5 },
      },
    ],
  },
  {
    id: 7,
    category: "公司类型",
    text: "你在什么类型的公司？",
    options: [
      {
        text: "大厂，螺丝钉一颗",
        boost: { 大厂高P困难户: 6, 年年述职年年挂: 3, 会议背景板: 2 },
      },
      {
        text: "小厂/创业公司，一人撑起一片天",
        boost: { "小厂 CTO 打杂王": 7 },
      },
      { text: "外包公司，甲方的临时工", boost: { 三不管外包仔: 8 } },
      {
        text: "中型公司，不上不下",
        boost: { 增删改查小王子: 3, 会议背景板: 3, 年年述职年年挂: 2 },
      },
    ],
  },
  {
    id: 8,
    category: "工作态度",
    text: "对于加班，你的看法是？",
    options: [
      { text: "加班是福报，我要奋斗", boost: { 卷王本王: 8 } },
      { text: "被迫加班，没办法", boost: { 公司永动机: 6, 三不管外包仔: 2 } },
      {
        text: "加什么班？准时下班",
        boost: { 活化石摆烂怪: 6, 带薪拉屎小能手: 3 },
      },
      {
        text: "假装加班，实际摸鱼",
        boost: { 带薪拉屎小能手: 7, 会议背景板: 2 },
      },
    ],
  },
];

  function createInitialScores() {
    const scores = {};
    Object.keys(personas).forEach((persona) => {
      scores[persona] = 0;
    });
    return scores;
  }

  function sortScores(scoreMap) {
    return Object.entries(scoreMap).sort((left, right) => right[1] - left[1]);
  }

  global.CBTIQuizData = {
    id: 'cbti',
    mode: 'sequential-score',
    title: 'CBTI 程序员人格测试',
    kicker: 'Programmer Persona Test',
    eyebrow: '💻 程序员人格测试',
    subtitle: '8道选择题 · 技术30% + 职场70%',
    description: '测测你在码农生态链中的真实定位，结果偏损，灵感来源于贴吧老哥、职场观察和互联网工位日常。',
    status: 'ready',
    badgeText: '新接入测试',
    storageKey: 'quiz-result:cbti:v1',
    shareLabel: '复制站点链接',
    heroStats: [
      { value: '8', label: '灵魂拷问' },
      { value: '19', label: '程序员人格' },
      { value: '职场向', label: '结果风格' }
    ],
    introItems: [
      { title: '测什么？', text: '你的技术能力、工作方式、职场心态与生存姿势。' },
      { title: '怎么测？', text: '8 道题逐题作答，系统根据加权分数匹配最像你的程序员人格。' },
      { title: '结果风格', text: '保留原始毒舌文案，去掉扫码和长截图，只保留站点统一分享。' }
    ],
    getInitialState() {
      return { currentIndex: 0, answers: new Array(questions.length).fill(null), scores: createInitialScores() };
    },
    prepareState(state) {
      state.currentIndex = 0;
      state.answers = new Array(questions.length).fill(null);
      state.scores = createInitialScores();
    },
    getQuestionCount() {
      return questions.length;
    },
    getCurrentQuestion(state) {
      return questions[state.currentIndex];
    },
    answerCurrentQuestion(state, option, optionIndex) {
      const resolvedIndex = Number.isInteger(optionIndex)
        ? optionIndex
        : questions[state.currentIndex].options.indexOf(option);
      state.answers[state.currentIndex] = resolvedIndex;
      Object.entries(option.boost || {}).forEach(([persona, points]) => {
        state.scores[persona] += points;
      });
      state.currentIndex += 1;
    },
    stepBack(state) {
      if (state.currentIndex <= 0) return;
      state.currentIndex -= 1;
      const previousAnswer = state.answers[state.currentIndex];
      if (previousAnswer !== null && previousAnswer !== undefined) {
        const previousOption = questions[state.currentIndex].options[previousAnswer];
        if (!previousOption) return;
        Object.entries(previousOption.boost || {}).forEach(([persona, points]) => {
          state.scores[persona] -= points;
        });
      }
    },
    isComplete(state) {
      return state.currentIndex >= questions.length;
    },
    getProgressText(state) {
      return `第 ${Math.min(state.currentIndex + 1, questions.length)} / ${questions.length} 题`;
    },
    getProgressHint(state) {
      const current = this.getCurrentQuestion(state);
      return current ? current.category : '结果生成中';
    },
    computeResult(state) {
      const sortedScores = sortScores(state.scores);
      const [winnerPersona, winnerScore] = sortedScores[0];
      const topFive = sortedScores.slice(0, 5);
      const maxScore = Math.max(...sortedScores.map((item) => item[1]), 0);
      return {
        cache: {
          title: winnerPersona,
          desc: personas[winnerPersona],
          badge: '程序员人格已生成',
          imageSrc: '',
          savedAt: Date.now(),
          extra: { winnerScore }
        },
        title: winnerPersona,
        kicker: '你的程序员人格',
        subtitle: '看看你是哪款打工人',
        desc: personas[winnerPersona],
        badge: `最高匹配 ${winnerScore} 分`,
        emoji: '💻',
        note: '本测试仅供娱乐，如有雷同纯属互联网工位生态过于真实。分享时统一复制站点链接。',
        sections: [
          {
            title: '人格解读',
            type: 'paragraph',
            body: personas[winnerPersona]
          },
          {
            title: '匹配度 Top 5',
            type: 'list',
            items: topFive.map(([persona, score]) => {
              const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
              return {
                label: persona,
                value: `${score}分`,
                description: `相对匹配度 ${percent}%`
              };
            })
          }
        ]
      };
    }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
