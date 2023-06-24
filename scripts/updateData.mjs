import 'dotenv/config';
import { simpleGit, CleanOptions } from 'simple-git';
import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import * as fs from 'fs';

simpleGit().clean(CleanOptions.FORCE);

const repoTempPath = `${dirname(fileURLToPath(import.meta.url))}\\temp`;
const repo = process.env.DATA_REPO;
const seedDataDir = resolve('./apps/server/src/database/seeds/data');

const filesWeCareAbout = [
  { source: 'core\\AllstarFull.csv', destName: 'allstars.csv' },
  { source: 'core\\Batting.csv', destName: 'batting.csv' },
  { source: 'core\\Pitching.csv', destName: 'pitching.csv' },
  { source: 'core\\People.csv', destName: 'players.csv' },
  { source: 'contrib\\AwardsPlayers.csv', destName: 'awards.csv' },
  { source: 'contrib\\HallOfFame.csv', destName: 'hof.csv' },
];

// clone the databank
await simpleGit().clone(repo, repoTempPath);

// copy files
for (const file of filesWeCareAbout) {
  const from = join(repoTempPath, file.source);
  const to = join(seedDataDir, file.destName);
  await fs.copyFile(from, to, (err) => {
    if (err) {
      console.error('File copy error', err);
    } else {
      console.log(`File "${from}" copied to "${to}"`);
    }
  });
}

// delete temp folder
await fs.rm(repoTempPath, { recursive: true, force: true }, (err) => {
  if (err) {
    console.error('Temp folder deletion error', err);
  } else {
    console.log('Temp folder successfully deleted');
  }
});

const seedCommand = exec('npm run db:seed');

// Capture the output of the command
seedCommand.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

// Capture any errors that occur during the execution
seedCommand.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

// Listen for the process to exit
seedCommand.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
