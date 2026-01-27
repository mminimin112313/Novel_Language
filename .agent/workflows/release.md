# Release Workflow
Trigger: `/release [version]`

## Goal
Prepare the codebase for a new release.

## Steps
1. **Changelog**: Update `CHANGELOG.md` with recent commits.
2. **Version**: Bump version in `package.json` (if applicable).
3. **Check**: Run full test suite.
4. **Build**: Run production build to verify no errors.
5. **Tag**: `git tag v[version]`
