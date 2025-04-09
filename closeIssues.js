import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'dkg-0717';
const REPO_NAME = 'threadbare-storyquest-template-copy';

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

async function closeAllIssues() {
  try {
    let page = 1;
    let issuesFetched = true;
    
    while (issuesFetched) {
      const issues = await octokit.issues.listForRepo({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        state: 'open',
        per_page: 100,
        page: page,   
      });

      if (issues.data.length === 0) {
        issuesFetched = false;
        console.log('No more open issues to close.');
        return;
      }

      for (let issue of issues.data) {
        try {
          await octokit.issues.update({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            issue_number: issue.number,
            state: 'closed',  
          });
          console.log(`Issue #${issue.number} closed.`);
        } catch (error) {
          console.error(`Error closing issue #${issue.number}:`, error);
        }
      }

      page++;
    }

    console.log('All open issues closed.');
  } catch (error) {
    console.error('Error fetching issues:', error);
  }
}

closeAllIssues();