import {copyFile} from 'node:fs/promises';
await copyFile('src/DeploymentMonitor/DeploymentMonitor.css','dist/DeploymentMonitor/DeploymentMonitor.css');
