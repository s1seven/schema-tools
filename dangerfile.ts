import { danger, markdown, message, warn } from 'danger';

const BIG_PR_LIMIT = 600;
let errorNumber = 0;

async function splitBigPR() {
  const linesCount = await danger.git.linesOfCode('**/*');
  // exclude fixtures and auto generated files
  const excludeLinesCount = await danger.git.linesOfCode('{**/schemaTypes.ts,fixtures/**,package*.json}');
  const totalLinesCount = linesCount - excludeLinesCount;

  if (totalLinesCount > BIG_PR_LIMIT) {
    warn(`:exclamation: Big PR (${++errorNumber})`);
    markdown(
      `> (${errorNumber}) : Pull Request size seems relatively large. If Pull Request contains multiple changes, please split each into separate PRs which will make them easier to review.`,
    );
  }
}

function updatePackageLock() {
  const packageChanged = danger.git.modified_files.includes('package.json');
  const lockfileChanged = danger.git.modified_files.includes('package-lock.json');
  if (packageChanged && !lockfileChanged) {
    warn(`:exclamation: package-lock.json (${++errorNumber})`);
    markdown(
      `> (${errorNumber}) : Changes were made to package.json, but not to package-lock.json - <i>'Perhaps you need to run \`npm install\`?'</i>`,
    );
  }
}

function positiveFeedback() {
  if (danger.github.pr.deletions > danger.github.pr.additions) {
    message(':thumbsup: You removed more code than added!');
  }
}

(async function () {
  await splitBigPR();
  positiveFeedback();
  updatePackageLock();
})();
