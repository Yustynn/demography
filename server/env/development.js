process.env.TOKEN_SECRET = "qE19G2Lnmf8EXE60gdztw8ajMHfTc0S9"; // BOBBY NOTE: This looks like a dupe with the token listed below
module.exports = {
  // "DATABASE_URI": "mongodb://localhost:27017/demography",
  "DATABASE_URI": "mongodb://BobbyM:dashjspassword@ds061405.mongolab.com:61405/heroku_8krs0wlv",
  "SESSION_SECRET": "Optimus Prime is my real dad",
  "TWITTER": {
    "consumerKey": "INSERT_TWITTER_CONSUMER_KEY_HERE",
    "consumerSecret": "INSERT_TWITTER_CONSUMER_SECRET_HERE",
    "callbackUrl": "INSERT_TWITTER_CALLBACK_HERE"
  },
  "FACEBOOK": {
    "clientID": "INSERT_FACEBOOK_CLIENTID_HERE",
    "clientSecret": "INSERT_FACEBOOK_CLIENT_SECRET_HERE",
    "callbackURL": "INSERT_FACEBOOK_CALLBACK_HERE"
  },
  "GOOGLE": {
    "clientID": "298064356219-e3hi8qkfat96nsvmae2ojggorn5mcn7n.apps.googleusercontent.com",
    "clientSecret": "rIwPdYD8FBtQu0aEsprOb9Bl",
    "callbackURL": "http://localhost:1337/auth/google/callback"
  },
  "TOKEN_SECRET": "qE19G2Lnmf8EXE60gdztw8ajMHfTc0S9", //http://randomkeygen.com/
  "PHANTOM_SECRET": "56b79c90350318795f366482",
  "PHANTOM_API": "eyJhbGciOiJIUzI1NiJ9.NTZiNzljOTAzNTAzMTg3OTVmMzY2NDgy.JpvhWq8fKnFaUzp8KJoQ3YEvWMI8-h0_Un7LnYyuBio",
  "SCREENSHOT_URL" : 'http://localhost:1337/users/',
  "S3": {
    "ACCESS_KEY_ID":"AKIAI6V5AMRSDNVYREGA",
    "SECRET_ACCESS_KEY":"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",
    "SCREENSHOT_URL" : 'https://s3.amazonaws.com/dashjs/'
  }
};
