(function (global) {
  const RESULT_CACHE_KEY = 'sbti:last-result:v1';

  function getFirstUnansweredQuestionId(visibleQuestions, answers) {
    const first = visibleQuestions.find((question) => answers[question.id] === undefined);
    return first ? first.id : null;
  }

  function normalizeScoreMap(map) {
    if (!map || typeof map !== 'object') return {};
    return Object.fromEntries(
      Object.entries(map)
        .filter(([key, value]) => (typeof key === 'string') && (typeof value === 'string' || typeof value === 'number'))
        .map(([key, value]) => [key, value])
    );
  }

  function buildCachedResultPayload(result) {
    return {
      version: 1,
      savedAt: Number(result.savedAt || Date.now()),
      modeKicker: String(result.modeKicker || ''),
      badge: String(result.badge || ''),
      sub: String(result.sub || ''),
      special: Boolean(result.special),
      imageSrc: String(result.imageSrc || ''),
      type: {
        code: String(result.type?.code || ''),
        cn: String(result.type?.cn || ''),
        desc: String(result.type?.desc || ''),
        intro: String(result.type?.intro || '')
      },
      rawScores: normalizeScoreMap(result.rawScores),
      levels: normalizeScoreMap(result.levels)
    };
  }

  function isValidCachedResult(data) {
    return Boolean(
      data &&
      data.version === 1 &&
      Number.isFinite(data.savedAt) &&
      data.type &&
      typeof data.type.code === 'string' &&
      data.type.code &&
      typeof data.type.cn === 'string' &&
      typeof data.type.desc === 'string' &&
      typeof data.type.intro === 'string' &&
      typeof data.modeKicker === 'string' &&
      typeof data.badge === 'string' &&
      typeof data.sub === 'string' &&
      typeof data.special === 'boolean' &&
      typeof data.imageSrc === 'string' &&
      data.rawScores &&
      typeof data.rawScores === 'object' &&
      data.levels &&
      typeof data.levels === 'object'
    );
  }

  function readCachedResult(storage) {
    if (!storage || typeof storage.getItem !== 'function') return null;

    try {
      const raw = storage.getItem(RESULT_CACHE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      return isValidCachedResult(parsed) ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function writeCachedResult(storage, result) {
    if (!storage || typeof storage.setItem !== 'function') return false;

    try {
      const payload = buildCachedResultPayload(result);
      storage.setItem(RESULT_CACHE_KEY, JSON.stringify(payload));
      return true;
    } catch (error) {
      return false;
    }
  }

  function formatSavedAt(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  function getQuestionFocusTargetSelector() {
    return '.question';
  }

  global.SBTIHelpers = {
    RESULT_CACHE_KEY,
    getFirstUnansweredQuestionId,
    buildCachedResultPayload,
    isValidCachedResult,
    readCachedResult,
    writeCachedResult,
    formatSavedAt,
    getQuestionFocusTargetSelector
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
