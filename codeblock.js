/**
 * TEST: Save and click the "Snippet" tab to see how to execute this as an API
 */
var Promise = require('bluebird@2.9.26');
var request = require('request@2.56.0');

var JIRA_AUTH;

module.exports = function(context, cb) {
  //jira auth token
  JIRA_AUTH = context.data.JIRA_AUTH

  var completedIssuesAdded = context.data.completedIssuesAdded
  var completedIssuesPlanned = context.data.completedIssuesPlanned

  var incompletedIssuesAdded = context.data.incompletedIssuesAdded
  var incompletedIssuesPlanned = context.data.incompletedIssuesPlanned

  var completedIssuesAddedPromises = []
  completedIssuesAdded.forEach(function(issue) {
    completedIssuesAddedPromises.push(jira.getIssueData(issue))
  })

  var completedIssuesPlannedPromises = []
  completedIssuesPlanned.forEach(function(issue) {
    completedIssuesPlannedPromises.push(jira.getIssueData(issue))
  })

  var incompletedIssuesAddedPromises = []
  incompletedIssuesAdded.forEach(function(issue) {
    incompletedIssuesAddedPromises.push(jira.getIssueData(issue))
  })

  var incompletedIssuesPlannedPromises = []
  incompletedIssuesPlanned.forEach(function(issue) {
    incompletedIssuesPlannedPromises.push(jira.getIssueData(issue))
  })

  Promise.all(completedIssuesAddedPromises, completedIssuesPlannedPromises,
              incompletedIssuesAddedPromises, incompletedIssuesPlannedPromises).then(function(issues) {
    cb(null, { completedIssuesAdded: issues[0], completedIssuesPlanned: issues[1], incompleteIssuesAdded: issues[2], incompleteIssuesPlanned: issues[3]})
  })
};

var jira = {

  getIssueData: function(issue) {
    return new Promise(function(resolve, reject) {
      var url = `https://thrillistmediagroup.atlassian.net/rest/api/2/issue/${issue}`
      console.log(url)
      var options = {
        method: 'GET',
  		url: url,
  		headers: { authorization: `Basic ${JIRA_AUTH}` }
      };

      request(options, function(err, resp) {
        console.log("issue response")
        if (!err) { console.log(`no errors for ${issue}`); return resolve(JSON.parse(resp.body)) }
        else { return reject(err) }
      })

    })
  }

}
