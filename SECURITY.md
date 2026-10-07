# Security

Please do not report a vulnerability or exploit in a public issue.

Use **Security → Report a vulnerability** on this repository to open a private
report. Include what is affected, how to reproduce it and what an attacker gains.
You will get a reply there.

Never commit secrets. API keys and other credentials belong in a local `.env`
file, which is ignored by Git, or in GitHub Actions secrets.
