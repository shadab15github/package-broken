// NOTE: fake placeholder credentials for scanner testing only. None of these are real.
const config = {
  jwtSecret: 'hardcoded-dev-secret-do-not-use',
  db: {
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'demo_app',
  },
  awsAccessKeyId: 'AKIAIOSFODNN7EXAMPLE',
  awsSecretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  stripeKey: 'sk_test_51H0000000000000000000000EXAMPLE',
  slackWebhook: 'https://hooks.slack.com/services/T00000000/B00000000/EXAMPLETOKEN0000',
  githubToken: 'ghp_EXAMPLE0000000000000000000000000000',
  adminPassword: 'admin',
};

module.exports = config;
