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
const catalogCode = readText(`${root}/quiz-catalog.js`);
eval(catalogCode);

const catalog = globalThis.QUIZCatalog;

assert(catalog, 'QUIZCatalog should be defined');
assert(typeof catalog.getQuizConfig === 'function', 'Catalog should expose getQuizConfig');
assert(typeof catalog.getShareText === 'function', 'Catalog should expose getShareText');

const sbti = catalog.getQuizConfig('sbti');
assert(sbti.id === 'sbti', 'Should load SBTI config');
assert(sbti.status === 'ready', 'SBTI should be ready');

const gbti = catalog.getQuizConfig('gbti');
assert(gbti.id === 'gbti', 'Should load GBTI config');
assert(gbti.status === 'ready', 'GBTI should be ready');

const cbti = catalog.getQuizConfig('cbti');
assert(cbti.id === 'cbti', 'Should load CBTI config');
assert(cbti.status === 'ready', 'CBTI should be ready once its data file is connected');

const missing = catalog.getQuizConfig('missing');
assert(missing === null, 'Unknown quiz should return null');

const shareText = catalog.getShareText('gbti');
assert(
  shareText === 'https://sbt-i.com',
  'All quiz share actions should copy the canonical site URL only'
);

console.log('quiz-catalog tests passed');
