/* 
If this is your first time editing/reading a Dangerfile, here's a summary:
It's a JS runtime which helps you provide continuous feedback inside GitHub.

You can see the docs here: http://danger.systems/js

If you want to test changes to Danger locally, I'd recommend checking out an existing PR
and then running the `danger pr` command from the terminal.

For example:

`npx danger pr https://github.com/facebook/react/pull/11865
*/

import { danger, markdown, message, warn } from 'danger';

const BIG_PR_LIMIT = 600;
const MAX_ALLOWED_EMPTY_CHECKBOXES = 2;
const MIN_TICKED_CHECKBOXES_FOR_PRAISE = 6;
const DESCRIPTION_TITLE_LENGTH = '# Description'.length;
let errorNumber = 0;

function warnAndGenerateMarkdown(warning: string, markdownStr: string): void {
  errorNumber += 1;
  warn(`${warning} (${errorNumber})`);
  markdown(`> (${errorNumber}) : ${markdownStr}`);
}

async function splitBigPR() {
  const linesCount = await danger.git.linesOfCode('**/*');
  // exclude fixtures and auto generated files
  const excludeLinesCount = await danger.git.linesOfCode('{**/schemaTypes.ts,fixtures/**,package*.json}');
  const totalLinesCount = linesCount - excludeLinesCount;

  if (totalLinesCount > BIG_PR_LIMIT) {
    warnAndGenerateMarkdown(
      ':exclamation: Big PR',
      'Pull Request size seems relatively large. If Pull Request contains multiple changes, please split each into separate PRs which will make them easier to review.',
    );
  }
}

function updatePackageLock() {
  const packageChanged = danger.git.modified_files.includes('package.json');
  const lockfileChanged = danger.git.modified_files.includes('package-lock.json');

  if (packageChanged && !lockfileChanged) {
    warnAndGenerateMarkdown(
      ':exclamation: package-lock.json',
      "Changes were made to package.json, but not to package-lock.json - <i>'Perhaps you need to run `npm install`?'</i>",
    );
  }
}

function positiveFeedback() {
  if (danger.github.pr.deletions > danger.github.pr.additions) {
    message(':thumbsup: You removed more code than added!');
  }
}

function checkCheckboxesAreTicked() {
  const prDescriptionChecklist = danger.github.pr.body?.split('## Checklist:')[1];
  const emptyCheckboxes = prDescriptionChecklist.match(/\[ \]/g).length || 0;
  const tickedCheckboxes = prDescriptionChecklist.match(/\[x\]/g).length || 0;

  if (emptyCheckboxes > MAX_ALLOWED_EMPTY_CHECKBOXES) {
    warnAndGenerateMarkdown(
      ':exclamation: checkboxes',
      `There are ${emptyCheckboxes} empty checkboxes, have you updated the checklist?`,
    );
  }

  if (tickedCheckboxes >= MIN_TICKED_CHECKBOXES_FOR_PRAISE) {
    message(':thumbsup: You ticked most of the checkboxes!');
  }
}

function checkDescriptionLength() {
  const prDescription = danger.github.pr.body?.split('## Type of change')[0];
  const descriptionLength = prDescription.replace(/<!--(.|\r\n)*-->/gm, '').trim().length || 0;

  if (descriptionLength <= DESCRIPTION_TITLE_LENGTH) {
    warnAndGenerateMarkdown(':exclamation: description', 'Have you added a description?');
  }
}

(async function () {
  await splitBigPR();
  positiveFeedback();
  updatePackageLock();
  checkCheckboxesAreTicked();
  checkDescriptionLength();
})();
