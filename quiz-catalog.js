(function (global) {
  const QUIZZES = {
    sbti: {
      id: 'sbti',
      name: 'SBTI 人格测试',
      shortName: 'SBTI',
      status: 'ready',
      href: '#sbti'
    },
    gbti: {
      id: 'gbti',
      name: 'GBTI 股市人格测试',
      shortName: 'GBTI',
      status: 'ready',
      href: '#gbti'
    },
    cbti: {
      id: 'cbti',
      name: 'CBTI 程序员人格测试',
      shortName: 'CBTI',
      status: 'ready',
      href: '#cbti'
    }
  };

  function getQuizConfig(id) {
    return QUIZZES[id] || null;
  }

  function listQuizzes() {
    return Object.values(QUIZZES);
  }

  function getShareText() {
    return 'https://sbt-i.com';
  }

  global.QUIZCatalog = {
    getQuizConfig,
    listQuizzes,
    getShareText
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
