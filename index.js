require('dotenv').config()

module.exports = app => {
  // Trigger whenever a label is assigned to an issue.
  app.on('issues.labeled', async context => {
    // Get Repository Privacy Information.
    let privacy = context.payload.repository.private

    // Only Tweet for Public Repositories.
    if (privacy === false) {
      // Get Labels in the labeled issue.
      let issueLabels = context.payload.issue.labels

      // Initialize an array with label names.
      let labels = []

      // Iterate through each label and store it's name.
      issueLabels.forEach(function (element) {
        labels.push(element.name)
      })

      // Check whether an issue contains 'help' or 'help wanted' label.
      if (labels.includes('help') || labels.includes('help wanted')) {
        // Get Issue and Repository details for the tweet.
        let issueURL = context.payload.issue.html_url
        let repositoryName = context.payload.repository.full_name

        // Initialize Twitter client.
        let Twitter = require('twit')
        let t = new Twitter({
          consumer_key: process.env.CUSTOMER_KEY,
          consumer_secret: process.env.CUSTOMER_SECRET,
          access_token: process.env.ACCESS_TOKEN,
          access_token_secret: process.env.ACCESS_TOKEN_SECRET,
          timeout_ms: 60 * 1000  // optional HTTP request timeout to apply to all requests.
        })

        // Form a message for the tweet.
        let tweet = `
      📢 We need help with an️ issue in ${repositoryName}. 
      
      Issue URL : ${issueURL}
      
      Your Help is much appreciated! Thanks 🙂
      
      #githubIssueHelp #ghIssueHelp`

        // Post the tweet!
        t.post('statuses/update', { status: tweet }, function (err, data, response) {
          if (err) {
            app.log(response)
          }
        })
      }
    }
  })
}
