(function (global) {
const questions = [
  {
    dim: "频率", text: "你买入一只股票后，多久看一次盘？",
    options: [
      { text: "每隔几分钟就看一眼，不看难受", scores: { freq: 2 } },
      { text: "一天看个两三次，假装在上班", scores: { freq: 1 } },
      { text: "一周看一两次，佛系持有", scores: { freq: -1 } },
      { text: "买完就忘了，想起来才看，已经过去仨月", scores: { freq: -2 } }
    ]
  },
  {
    dim: "频率", text: "你的持仓周期通常是？",
    options: [
      { text: "日内就想了结，隔夜我怕鬼故事", scores: { freq: 2 } },
      { text: "几天到两周，短线快打", scores: { freq: 1 } },
      { text: "几个月吧，给它时间表演", scores: { freq: -1 } },
      { text: "以年为单位（或者被套成了'长期投资'）", scores: { freq: -2 } }
    ]
  },
  {
    dim: "风险", text: "你看好一只股票时，怎么买？",
    options: [
      { text: "全仓直接梭哈，犹豫就会败北", scores: { risk: 2 } },
      { text: "先买大半仓，涨了再加满", scores: { risk: 1 } },
      { text: "分批建仓，控制仓位", scores: { risk: -1 } },
      { text: "先买一点点试水，主要是试胆量", scores: { risk: -2 } }
    ]
  },
  {
    dim: "风险", text: "你的持仓通常有几只股票？",
    options: [
      { text: "一只，All in 信仰！分散是不可能分散的", scores: { risk: 2 } },
      { text: "两三只重仓，集中火力", scores: { risk: 1 } },
      { text: "五到十只分散持有，不把鸡蛋放一个篮子", scores: { risk: -1 } },
      { text: "直接买基金/ETF，篮子都不要了直接买超市", scores: { risk: -2 } }
    ]
  },
  {
    dim: "决策", text: "你买股票主要靠什么决策？",
    options: [
      { text: "群里大佬喊单 / 朋友推荐 / 热搜上看到的", scores: { logic: 2 } },
      { text: "直觉！感觉这个板块要起飞了", scores: { logic: 1 } },
      { text: "看K线、MACD、均线等技术面", scores: { logic: -1 } },
      { text: "深入研究财报、行业和基本面", scores: { logic: -2 } }
    ]
  },
  {
    dim: "决策", text: "持有的股票突然大跌 5%，你怎么办？",
    options: [
      { text: "慌了，先割再说，保命要紧", scores: { logic: 2 } },
      { text: "打开股吧看看大家什么反应，随大流", scores: { logic: 1 } },
      { text: "查一下跌的原因，该扛扛该跑跑", scores: { logic: -1 } },
      { text: "基本面没变就加仓，别人恐惧我贪婪", scores: { logic: -2 } }
    ]
  },
  {
    dim: "决策", text: "你怎么选择买入时机？",
    options: [
      { text: "看到涨停板就冲！犹豫你就输了", scores: { logic: 2 } },
      { text: "感觉差不多了就买，时机靠缘分", scores: { logic: 1 } },
      { text: "等技术指标出现买入信号", scores: { logic: -1 } },
      { text: "估值进入合理区间才考虑，耐心是美德", scores: { logic: -2 } }
    ]
  },
  {
    dim: "心态", text: "大盘暴跌 3% 那天晚上，你在干什么？",
    options: [
      { text: "翻来覆去睡不着，算了一整晚亏多少", scores: { mind: 2 } },
      { text: "疯狂刷股吧 / 雪球，寻求心理安慰", scores: { mind: 1 } },
      { text: "看了一眼，然后该追剧追剧", scores: { mind: -1 } },
      { text: "根本没注意到跌了，第二天才知道", scores: { mind: -2 } }
    ]
  },
  {
    dim: "心态", text: "你的账户浮亏 20%，心态如何？",
    options: [
      { text: "焦虑到影响生活，天天失眠", scores: { mind: 2 } },
      { text: "有点难受，但还能忍，偶尔长叹一声", scores: { mind: 1 } },
      { text: "安慰自己是'长期投资'，内心基本平静", scores: { mind: -1 } },
      { text: "无所谓，来都来了，就当交学费", scores: { mind: -2 } }
    ]
  },
  {
    dim: "心态", text: "你炒股最大的感受是什么？",
    options: [
      { text: "每天坐过山车，心脏已经练出八块腹肌", scores: { mind: 2 } },
      { text: "又爱又恨，想戒戒不掉，比烟瘾还大", scores: { mind: 1 } },
      { text: "就图个乐，赚钱是意外，亏钱是日常", scores: { mind: -1 } },
      { text: "我已经悟了，涨跌皆是浮云", scores: { mind: -2 } }
    ]
  }
];

const types = {
  "短梭感慌": {
    name: "赌场VIP韭菜", emoji: "🎰",
    subtitle: "高频梭哈 · 凭感觉 · 还慌得一批",
    dims: ["短线狂魔", "梭哈选手", "感觉派", "焦虑体质"],
    dimColors: ["red", "red", "gold", "red"],
    tags: ["#全村的希望", "#庄家最爱", "#亏麻了还要冲", "#打工还债"],
    desc: "你是股市里最勇猛也最惨烈的存在。每天高频操作，全靠直觉梭哈，亏了就慌，慌了就割，割完就后悔，后悔完又冲。你的账户曲线比你的心电图还刺激。庄家看到你上线，就像看到财神爷来了。",
    quote: "我不是在抄底，就是在被抄家的路上"
  },
  "短梭感佛": {
    name: "快乐赌狗", emoji: "🐶",
    subtitle: "高频梭哈 · 凭感觉 · 但心态超好",
    dims: ["短线狂魔", "梭哈选手", "感觉派", "佛系心态"],
    dimColors: ["red", "red", "gold", "green"],
    tags: ["#亏了也嘻嘻", "#乐观主义战士", "#散户之光", "#情绪稳定"],
    desc: "你是股市里的一股清流——梭哈是日常，亏钱是习惯，但你的心态好到让人嫉妒。涨了请客吃饭，跌了发个段子。你不是在炒股，你是在玩一款大型真人体验游戏。身边的人都搞不懂：亏这么多了你怎么还能笑得出来？",
    quote: "钱没了可以再赚，但快乐不能没有"
  },
  "短梭理慌": {
    name: "量化韭菜", emoji: "📉",
    subtitle: "高频梭哈 · 讲技术 · 但总是慌",
    dims: ["短线狂魔", "梭哈选手", "理性派", "焦虑体质"],
    dimColors: ["red", "red", "green", "red"],
    tags: ["#伪量化", "#MACD战士", "#画线大师", "#技术面焦虑"],
    desc: "你自认为是技术流高手，MACD金叉死叉倒背如流，布林带张口闭口挂嘴边。但每次信号出来你都全仓杀入，然后盯着分时图焦虑到手抖。你的技术分析没问题，问题是你的心脏跟不上你的仓位。",
    quote: "指标都对了，就是账户不对"
  },
  "短梭理佛": {
    name: "日内战神", emoji: "⚔️",
    subtitle: "高频重仓 · 理性决策 · 心态稳如狗",
    dims: ["短线狂魔", "梭哈选手", "理性派", "佛系心态"],
    dimColors: ["red", "red", "green", "green"],
    tags: ["#真大佬", "#纪律严明", "#止损坚决", "#别人家的股民"],
    desc: "你可能是这16种人格里最接近赚钱的一种。短线快进快出，敢于重仓出击，但每一笔都有逻辑支撑，亏了也不慌，止损坚决。别人追涨杀跌，你在纪律面前冷酷无情。唯一的问题是：你确定你不是在幻想自己是这个类型？",
    quote: "市场永远是对的，不对的是不听话的手"
  },
  "短稳感慌": {
    name: "追涨杀跌圣体", emoji: "🎢",
    subtitle: "频繁操作 · 胆子不大 · 追高割肉",
    dims: ["短线狂魔", "谨慎选手", "感觉派", "焦虑体质"],
    dimColors: ["red", "green", "gold", "red"],
    tags: ["#精准反指", "#买了就跌卖了就涨", "#主力对手盘", "#反向财神"],
    desc: "你是股市里的人形反向指标。操作频繁但仓位不大，每次都是看别人赚了才跟进，结果一买就跌；跌了慌了割肉，一割就涨。朋友们已经学会了：你买什么他们就卖什么。你不是在炒股，你是在给市场送温暖。",
    quote: "如果我是巴菲特的对手盘，那巴菲特应该感谢我"
  },
  "短稳感佛": {
    name: "摸鱼炒股人", emoji: "🐟",
    subtitle: "小打小闹 · 跟着感觉 · 图个乐呵",
    dims: ["短线狂魔", "谨慎选手", "感觉派", "佛系心态"],
    dimColors: ["red", "green", "gold", "green"],
    tags: ["#上班偷偷看盘", "#小赌怡情", "#社畜的快乐", "#无所谓了"],
    desc: "你的炒股日常：上班摸鱼看盘，买个几百几千块意思意思，涨了开心一下，跌了也无所谓。同事问你在看什么，你说在看\u2018天气预报\u2019。你不指望靠炒股发财，就是给搬砖生活找点刺激。说实话，你买的那点仓位，连手续费都快覆盖不了。",
    quote: "我炒的不是股，是寂寞"
  },
  "短稳理慌": {
    name: "焦虑分析师", emoji: "🔬",
    subtitle: "研究很多 · 下手很轻 · 焦虑很重",
    dims: ["短线狂魔", "谨慎选手", "理性派", "焦虑体质"],
    dimColors: ["red", "green", "green", "red"],
    tags: ["#过度思考", "#选择困难", "#纸上富翁", "#分析瘫痪"],
    desc: "你是那种研究了三天三夜、分析了十几个指标、写了一页纸的交易计划，最后只敢买100股的人。买完之后每分钟看一次，涨2%纠结要不要卖，跌1%纠结要不要割。你的分析能力配得上百万资金，但你的胆量只配得上你的仓位。",
    quote: "我分析了一切，除了我自己的恐惧"
  },
  "短稳理佛": {
    name: "稳健短线客", emoji: "🎯",
    subtitle: "技术流 · 轻仓快打 · 心态平和",
    dims: ["短线狂魔", "谨慎选手", "理性派", "佛系心态"],
    dimColors: ["red", "green", "green", "green"],
    tags: ["#小富即安", "#稳扎稳打", "#风控达人", "#慢慢变富"],
    desc: "你是股市里的老司机，开得不快但很稳。轻仓短线，技术面驱动，赚了不贪，亏了不慌。你可能不会一夜暴富，但也不会一夜暴负。在这个充满疯狂的市场里，你是少数能全身而退的人。唯一的遗憾是：你偶尔会后悔没有胆子大一点。",
    quote: "慢就是快，少就是多，除了我的收益"
  },
  "长梭感慌": {
    name: "被套哲学家", emoji: "🔗",
    subtitle: "重仓长拿 · 凭感觉买 · 天天焦虑",
    dims: ["长线选手", "梭哈选手", "感觉派", "焦虑体质"],
    dimColors: ["green", "red", "gold", "red"],
    tags: ["#深套不割", "#被迫价投", "#焦虑持股", "#我悟了又没完全悟"],
    desc: "你当初凭感觉重仓杀入，满怀信心等翻倍。结果一路下跌，从短线变中线，从中线变长线，从长线变传家宝。你开始研究价值投资、巴菲特语录，试图说服自己这是\u2018长期持有\u2019。但每天打开账户看到那个绿油油的数字，你的内心在尖叫。",
    quote: "不是我选择了价值投资，是价值投资选择了我"
  },
  "长梭感佛": {
    name: "信仰充值者", emoji: "⛪",
    subtitle: "重仓一只 · 信念满满 · 死都不卖",
    dims: ["长线选手", "梭哈选手", "感觉派", "佛系心态"],
    dimColors: ["green", "red", "gold", "green"],
    tags: ["#信仰无敌", "#XX永远的神", "#粉丝型股东", "#钻石手"],
    desc: "你不是在炒股，你是在信仰。你All in的那只股票，就是你的宗教、你的信仰、你的精神支柱。跌了？加仓！再跌？继续加！利空？是主力洗盘！你在股吧里日夜布道，怼空头比巴菲特还坚定。你的账户可能血亏，但你的信仰从未动摇。",
    quote: "你可以质疑我的判断，但不能质疑我的信仰"
  },
  "长梭理慌": {
    name: "深套研究员", emoji: "📚",
    subtitle: "研究透了还是被套 · 怀疑人生中",
    dims: ["长线选手", "梭哈选手", "理性派", "焦虑体质"],
    dimColors: ["green", "red", "green", "red"],
    tags: ["#研报读了800篇", "#基本面没问题但K线有问题", "#怀疑人生", "#理论与实践的差距"],
    desc: "你是认真做过功课的人。财报、行研、DCF模型、行业对比，全都研究透了。你用一套严密的逻辑证明了这只股票值得重仓。然后它就跌了。你反复检查自己的分析，找不到任何问题。于是你开始怀疑：是不是市场错了？还是我学的都是假的？",
    quote: "我研究了一切，除了市场不讲道理这件事"
  },
  "长梭理佛": {
    name: "价值投资大师", emoji: "🧘",
    subtitle: "深度研究 · 重仓长持 · 心态如佛",
    dims: ["长线选手", "梭哈选手", "理性派", "佛系心态"],
    dimColors: ["green", "red", "green", "green"],
    tags: ["#巴菲特门徒", "#时间的朋友", "#逆向投资", "#知行合一"],
    desc: "恭喜你，你是传说中的价值投资者——可能是这16种人格里最有可能赚到钱的类型。你深入研究基本面，敢于重仓持有，而且心态平和，不被短期波动影响。唯一的问题是：在中国A股市场，这个策略到底管不管用，你也说不准。",
    quote: "别人恐惧我贪婪，别人贪婪我更贪婪……等等，不对"
  },
  "长稳感慌": {
    name: "养基焦虑症", emoji: "😰",
    subtitle: "定投基金 · 每天查看 · 天天焦虑",
    dims: ["长线选手", "谨慎选手", "感觉派", "焦虑体质"],
    dimColors: ["green", "green", "gold", "red"],
    tags: ["#定投焦虑", "#每天打开支付宝看一眼", "#基金绿了心也绿了", "#理财小白"],
    desc: "你的理财方式很稳健——定投基金，长期持有。但你的心态完全跟不上。每天打开支付宝看收益，绿了就焦虑，红了就想赎回。朋友说\u2018定投就别看了\u2019，但你做不到。你的基金其实还好，只是你的心理承受能力需要升级。",
    quote: "我定投了三年，头发也掉了三年"
  },
  "长稳感佛": {
    name: "躺平理财人", emoji: "🛋️",
    subtitle: "买了就忘 · 佛系躺赚 · 人间清醒",
    dims: ["长线选手", "谨慎选手", "感觉派", "佛系心态"],
    dimColors: ["green", "green", "gold", "green"],
    tags: ["#真·躺平", "#人间清醒", "#钱在那里又跑不了", "#年底想起来看一眼"],
    desc: "你可能是心态最好的股民。买了一些基金或者几只股票，然后就彻底忘了。半年后想起来打开一看——哟，还涨了点。你没有什么投资理论，也不看财报，但你的收益可能比80%的人都强，因为你完美避开了追涨杀跌的所有坑。",
    quote: "我不理财，财也不离我……大概吧"
  },
  "长稳理慌": {
    name: "过度研究者", emoji: "🤯",
    subtitle: "研报看了800篇 · 分散投资 · 但还是不放心",
    dims: ["长线选手", "谨慎选手", "理性派", "焦虑体质"],
    dimColors: ["green", "green", "green", "red"],
    tags: ["#研报收藏家", "#知识焦虑", "#越研究越怕", "#完美主义者"],
    desc: "你是股市里的学霸。各种研报、分析、数据你都看了，资产配置合理，风险分散到位。但你就是不放心——今天担心美联储加息，明天担心地缘冲突，后天又怕黑天鹅。你的投资组合其实没问题，有问题的是你总觉得哪里有问题。",
    quote: "我已经分析了所有风险，除了我自己就是最大的风险"
  },
  "长稳理佛": {
    name: "退休理财达人", emoji: "👴",
    subtitle: "完美配置 · 长期持有 · 心态无敌",
    dims: ["长线选手", "谨慎选手", "理性派", "佛系心态"],
    dimColors: ["green", "green", "green", "green"],
    tags: ["#教科书级投资", "#全绿灯", "#你不炒股你做资配", "#无聊但有效"],
    desc: "你是投资领域的模范生。资产配置合理，深入研究后才下手，分散持有降低风险，而且心态平和不受市场波动影响。听起来很完美？确实很完美。唯一的问题是——你可能在股民圈子里一个朋友都交不到，因为你太无聊了。没有爆仓故事，没有涨停板狂喜，你的投资生活平淡得像白开水。但白开水最健康，不是吗？",
    quote: "我的投资收益很稳定，我的社交生活也很稳定——稳定地为零"
  }
};


  global.GBTIQuizData = {
    id: "gbti",
    mode: "sequential-score",
    title: "GBTI 股市人格测试",
    kicker: "Gu-shi Behavior Type Indicator",
    eyebrow: "2026 全网爆火",
    subtitle: "10道题，测出你在股市里的真实人格",
    description: "从频率、风险、决策和心态四条轴线里，识别你到底是梭哈战士还是被套哲学家。",
    status: "ready",
    badgeText: "新上架分支测试",
    storageKey: "quiz-result:gbti:v1",
    shareLabel: "复制站点链接",
    heroStats: [
      { value: "10", label: "灵魂拷问" },
      { value: "16", label: "股市人格" },
      { value: "四维", label: "判断坐标" }
    ],
    introItems: [
      { title: "测什么？", text: "你的操作频率、风险偏好、决策依据和心态管理。" },
      { title: "怎么测？", text: "每题累加四维倾向，最终组合成 16 种股市人格。" },
      { title: "结果风格", text: "偏调侃、偏梗图，适合拉群互损，不适合当投资建议。" }
    ],
    getInitialState() {
      return { currentIndex: 0, answers: new Array(questions.length).fill(null), scores: { freq: 0, risk: 0, logic: 0, mind: 0 } };
    },
    prepareState(state) {
      state.currentIndex = 0;
      state.answers = new Array(questions.length).fill(null);
      state.scores = { freq: 0, risk: 0, logic: 0, mind: 0 };
    },
    getQuestionCount() {
      return questions.length;
    },
    getCurrentQuestion(state) {
      return questions[state.currentIndex];
    },
    answerCurrentQuestion(state, option, optionIndex) {
      state.answers[state.currentIndex] = optionIndex;
      Object.entries(option.scores).forEach(([key, value]) => {
        state.scores[key] += value;
      });
      state.currentIndex += 1;
    },
    stepBack(state) {
      if (state.currentIndex <= 0) return;
      state.currentIndex -= 1;
      const previousAnswer = state.answers[state.currentIndex];
      if (previousAnswer === null || previousAnswer === undefined) return;
      const previousOption = questions[state.currentIndex].options[previousAnswer];
      if (!previousOption) return;
      Object.entries(previousOption.scores).forEach(([key, value]) => {
        state.scores[key] -= value;
      });
    },
    isComplete(state) {
      return state.currentIndex >= questions.length;
    },
    getProgressText(state) {
      return `第 ${Math.min(state.currentIndex + 1, questions.length)} / ${questions.length} 题`;
    },
    getProgressHint(state) {
      const current = this.getCurrentQuestion(state);
      return current ? current.dim : "结果生成中";
    },
    computeResult(state) {
      const freqType = state.scores.freq > 0 ? "短" : "长";
      const riskType = state.scores.risk > 0 ? "梭" : "稳";
      const logicType = state.scores.logic > 0 ? "感" : "理";
      const mindType = state.scores.mind > 0 ? "慌" : "佛";
      const typeKey = freqType + riskType + logicType + mindType;
      const type = types[typeKey];
      const dimNames = ["操作频率", "风险偏好", "决策依据", "心态管理"];

      return {
        cache: {
          title: `${type.name} · ${typeKey}型`,
          desc: type.desc,
          badge: type.subtitle,
          imageSrc: "",
          savedAt: Date.now(),
          extra: { typeKey }
        },
        title: type.name,
        kicker: `${typeKey} 型`,
        subtitle: type.subtitle,
        desc: type.desc,
        badge: "股市人格已生成",
        emoji: type.emoji,
        note: "本测试仅供娱乐，不构成任何投资建议。下一次追涨杀跌请自行承担后果。",
        sections: [
          {
            title: "四维侧写",
            type: "chips",
            items: type.dims.map((item, index) => `${dimNames[index]} · ${item}`)
          },
          {
            title: "人格解读",
            type: "paragraph",
            body: type.desc
          },
          {
            title: "典型台词",
            type: "quote",
            body: type.quote
          },
          {
            title: "关键词",
            type: "chips",
            items: type.tags
          }
        ]
      };
    }
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
