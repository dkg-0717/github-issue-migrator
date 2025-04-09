# GitHub Issues Migrator

This project allows you to migrate issues from one GitHub repository to another. Using the GitHub API, this script copies issues from a source repository to a target repository, including their labels, comments, and other associated details.

## Features

- **Issue Migration**: Copy all issues from one GitHub repository to another, including their title, body, labels, and comments.
- **Label Management**: Labels associated with issues are correctly copied to the target repository.
- **Issue Type**: The type of each issue (e.g., "Task") is included in the body of the issue in the target repository.
- **Comment Handling**: Comments associated with each issue are successfully migrated to the target repository.

## Requirements

- Node.js version 22 or above.
- A GitHub personal access token with sufficient permissions to access both repositories and modify issues.

## Installation

   ```bash
# Clone the repository
  git clone https://github.com/username/github-issue-migrator.git
  cd github-issue-migrator

# Install dependencies 
  npm install

# Set up configuration
  create .env file
  add GITHUB_TOKEN
```

## Running the project 

  ```bash
  # Extract the issues using the command bellow
    node downloadIssues.js
  
  # Clone the issues into the destination repository using the following command
    node uploadToRepo.js
  ```
