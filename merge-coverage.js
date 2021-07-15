/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { existsSync, readdirSync, readFileSync } = require('fs');
const { createCoverageMap } = require('istanbul-lib-coverage');
const { createReporter } = require('istanbul-api');

async function main(argv) {
  const reporters = argv[2] || ['json', 'lcov', 'jest-sonar'];
  const packagesFolders = readdirSync(path.resolve('./packages'), { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.resolve('./packages', dirent.name));

  const map = createCoverageMap({});
  packagesFolders.forEach((projectPath) => {
    const coveragePath = path.resolve(projectPath, './coverage/coverage-final.json');
    if (!existsSync(coveragePath)) {
      return;
    }
    let coverage = JSON.parse(readFileSync(coveragePath, 'utf8'));
    if (process.env.CI) {
      // fix invalid file path in Github actions
      coverage = Object.keys(coverage).reduce((acc, key) => {
        const filePath = key.replace('/home/runner/work/schema-tools/schema-tools', '/github/workspace');
        const newKey = filePath;
        coverage[key].path = filePath;
        return { ...acc, [newKey]: coverage[key] };
      }, {});
    }
    map.merge(coverage);
  });

  const reporter = createReporter();
  reporter.addAll(reporters);
  reporter.write(map);
  console.log('Created a merged coverage report in ./coverage');
}

main(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
