# After creating a repository from this template

A template copies files only. Repository settings, branch protection and security
features must be turned on again in each new repository. Everything below is free
for public repositories.

## One-time settings

With the [GitHub CLI](https://cli.github.com/), from the repository root:

```bash
gh repo edit --delete-branch-on-merge --enable-auto-merge --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false
```

```bash
gh repo edit --enable-secret-scanning --enable-secret-scanning-push-protection
```

```bash
gh api -X PUT "repos/{owner}/{repo}/vulnerability-alerts"
```

```bash
gh api -X PUT "repos/{owner}/{repo}/automated-security-fixes"
```

```bash
gh api -X PUT "repos/{owner}/{repo}/private-vulnerability-reporting"
```

Or in the browser: **Settings → General** for the merge options and
**Settings → Advanced Security** for the rest.

## Protect `main`

Push at least once first so the `check` job exists, then:

```bash
gh api -X POST "repos/{owner}/{repo}/rulesets" --input .github/rulesets/main.json
```

The ruleset in `.github/rulesets/main.json`:

- requires a pull request to change `main` (no approval needed, so it works for a
  solo developer; raise `required_approving_review_count` for a team),
- requires the `check` job to pass on the latest commit,
- requires linear history and resolved review threads,
- blocks force pushes and deletion.

Repository administrators may bypass it for emergencies. Remove `bypass_actors`
from the file before applying it if nobody should.

## Releases

Tag a commit on `main` to publish a release with the built place attached:

```bash
git tag v0.1.0
```

```bash
git push origin v0.1.0
```

The workflow does not publish to Roblox. `default.project.json` deliberately leaves
Studio-authored content unmanaged, so the built file contains code only and
publishing it would replace the live place with an empty world. Publish from
Studio, or add an Open Cloud step only if Rojo manages your entire place.
