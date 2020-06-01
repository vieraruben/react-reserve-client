const dev = {
  s3: {
    REGION: "us-east-2",
    BUCKET: ""
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://mc4kf96w2k.execute-api.us-east-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_MIKZWkpWY",
    APP_CLIENT_ID: "fqlmurmn14mh9t6or5ab5jlam",
    IDENTITY_POOL_ID: "us-east-2:ac777ed0-c4d5-424c-8c4c-2cb2028906a9"
  }
};

const config = dev

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
