import { Octokit } from "@octokit/rest";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 
const SOURCE_REPO = 'endlessm/threadbare-storyquest-template';

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

async function ensureOutputDirExists() {
  const outputDir = path.join(__dirname, 'output');
  try {
    await mkdir(outputDir, { recursive: true });
  } catch (error) {
    console.error('Error creating output directory:', error);
  }
}

async function exportIssues() {
  try {
    const [owner, repo] = SOURCE_REPO.split('/');

    const opts = {
      owner,
      repo,
      state: 'all',
      sort: 'created',
      direction: 'asc',
    };

    const [labels, issues, pulls, milestones, comments] = await Promise.all([
      octokit.issues.listLabelsForRepo({ owner, repo }),
      octokit.issues.listForRepo(opts),
      octokit.pulls.list({ owner, repo, state: 'all' }),
      octokit.issues.listMilestones({ owner, repo, state: 'all' }),
      octokit.issues.listCommentsForRepo({ owner, repo }),
    ]);

    await ensureOutputDirExists();

    await writeFile(path.join(__dirname, 'output', 'labels.json'), JSON.stringify(labels.data, null, 2));
    await writeFile(path.join(__dirname, 'output', 'issues.json'), JSON.stringify(issues.data, null, 2));
    await writeFile(path.join(__dirname, 'output', 'pulls.json'), JSON.stringify(pulls.data, null, 2));
    await writeFile(path.join(__dirname, 'output', 'milestones.json'), JSON.stringify(milestones.data, null, 2));
    await writeFile(path.join(__dirname, 'output', 'comments.json'), JSON.stringify(comments.data, null, 2));

    console.log('Export completed');
  } catch (error) {
    console.error('Error exporting issues:', error);
  }
}

exportIssues();