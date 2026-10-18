import {copyFile} from 'node:fs/promises';
await copyFile('src/DeploymentMonitor/DeploymentMonitor.css','dist/DeploymentMonitor/DeploymentMonitor.css');

await copyFile('src/WorkspaceConsole/WorkspaceConsole.css','dist/WorkspaceConsole/WorkspaceConsole.css');
