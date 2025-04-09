import { Octokit } from "@octokit/rest";
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);  

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;  
const TARGET_REPO = 'dkg-0717/threadbare-storyquest-template-copy';

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

async function uploadToTargetRepo() {
  try {
    const [labels, issues, pulls, milestones, comments] = await Promise.all([
      readFile(path.join(__dirname, 'output', 'labels.json'), 'utf-8'),
      readFile(path.join(__dirname, 'output', 'issues.json'), 'utf-8'),
      readFile(path.join(__dirname, 'output', 'pulls.json'), 'utf-8'),
      readFile(path.join(__dirname, 'output', 'milestones.json'), 'utf-8'),
      readFile(path.join(__dirname, 'output', 'comments.json'), 'utf-8'),
    ]);

    const repo = TARGET_REPO;
    const labelsData = JSON.parse(labels);  
    const issuesData = JSON.parse(issues);  
    const pullsData = JSON.parse(pulls);
    const commentsData = JSON.parse(comments);

    for (let label of labelsData) {
      try {
        await octokit.issues.createLabel({
          owner: repo.split('/')[0],
          repo: repo.split('/')[1],
          name: label.name,
          color: label.color
        });
        console.log(`Label ${label.name} added.`);
      } catch (error) {
        console.log(`Error adding label ${label.name}:`, error);
      }
    }

    for (let issue of issuesData) {
      try {
        const issueTitle = `${issue.title}`;

        const issueBody = `${issue.body}\n\n**Type:** ${issue.type ? issue.type.name : 'Unknown'}`;

        const createdIssue = await octokit.issues.create({
          owner: repo.split('/')[0],
          repo: repo.split('/')[1],
          title: issueTitle,  
          body: issueBody,    
        });

        console.log(`Issue ${issue.title} created.`);

        const issueNumber = createdIssue.data.number;

        if (issue.labels && issue.labels.length > 0) {
          const labelNames = issue.labels.filter(label => label.name !== 'Type: Task').map(label => label.name);
          await octokit.issues.addLabels({
            owner: repo.split('/')[0],
            repo: repo.split('/')[1],
            issue_number: issueNumber,
            labels: labelNames
          });
          console.log(`Labels ${labelNames.join(', ')} added to issue ${issueNumber}.`);
        }

      } catch (error) {
        console.log(`Error creating or adding labels to issue ${issue.title}:`, error);
      }
    }

    for (let pull of pullsData) {
      try {
        await octokit.pulls.create({
          owner: repo.split('/')[0],
          repo: repo.split('/')[1],
          title: pull.title,
          head: pull.head.ref,
          base: pull.base.ref
        });
        console.log(`Pull request ${pull.title} created.`);
      } catch (error) {
        console.log(`Error creating pull request ${pull.title}:`, error);
      }
    }

    for (let comment of commentsData) {
      try {
        await octokit.issues.createComment({
          owner: repo.split('/')[0],
          repo: repo.split('/')[1],
          issue_number: comment.issue_url.split('/').pop(),
          body: comment.body
        });
        console.log(`Comment added to issue ${comment.issue_url}.`);
      } catch (error) {
        console.log(`Error adding comment:`, error);
      }
    }

    console.log('Upload completed');
  } catch (error) {
    console.error('Error uploading data to target repo:', error);
  }
}

uploadToTargetRepo();