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

const html = readText('/Users/maxxie/Desktop/nsbh/sbti/index.html');

assert(!html.includes('href="/app.css"'), 'Local stylesheet path should not use a root-relative URL');
assert(!html.includes('src="/app.js"'), 'Local script path should not use a root-relative URL');
assert(!html.includes('src="/quiz-catalog.js"'), 'Catalog script should not use a root-relative URL');
assert(!html.includes('src="/data/cbti-data.js"'), 'CBTI data script should not use a root-relative URL');
assert(html.includes('src="./data/cbti-data.js"'), 'Index should include the CBTI data script');
assert(!html.includes('并预留 CBTI 入口'), 'Index metadata should not describe CBTI as reserved anymore');
assert(!html.includes('CBTI 入口已预留'), 'Social metadata should not describe CBTI as reserved anymore');
assert(
  html.includes('SBTI 人格测试为主'),
  'Index metadata should prioritize SBTI in the site description'
);
assert(
  html.includes('SBTI 人格测试，多维人格测试集合站'),
  'Page title should prioritize SBTI for SEO'
);
assert(
  html.includes('当前提供 SBTI、GBTI 与 CBTI'),
  'Index metadata should still mention the other connected quizzes as secondary'
);
assert(
  html.includes("window.location.protocol !== 'file:'"),
  'Analytics loader should skip execution for file://'
);

console.log('index-paths tests passed');
