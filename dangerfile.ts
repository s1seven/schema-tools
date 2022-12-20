import { danger, markdown, message, warn } from 'danger';

const BIG_PR_LIMIT = 600;
let errorCount = 0;

(async function () {
  const linesCount = await danger.git.linesOfCode('**/*');
  // exclude fixtures and auto generated files
  const excludeLinesCount = await danger.git.linesOfCode('{**/schemaTypes.ts,fixtures/**}');
  const totalLinesCount = linesCount - excludeLinesCount;

  if (totalLinesCount > BIG_PR_LIMIT) {
    warn(`:exclamation: Big PR (${++errorCount})`);
    markdown(
      `> (${errorCount}) : Pull Request size seems relatively large. If Pull Request contains multiple changes, please split each into separate PRs which will make them easier to review.`,
    );
  }

  if (danger.github.pr.deletions > danger.github.pr.additions) {
    message(':thumbsup: You removed more code than added!');
  }
})();
