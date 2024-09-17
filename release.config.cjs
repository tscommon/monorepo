/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ['main'],
  repositoryUrl: 'https://github.com/tscommon/monorepo',
  extends: 'semantic-release-monorepo',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/github', { assets: ['dist/**'] }],
    '@semantic-release/npm',
  ],
};
