import {copyFile, mkdir} from 'node:fs/promises';
await copyFile('src/DeploymentMonitor/DeploymentMonitor.css','dist/DeploymentMonitor/DeploymentMonitor.css');

await copyFile('src/WorkspaceConsole/WorkspaceConsole.css','dist/WorkspaceConsole/WorkspaceConsole.css');

await copyFile('src/HubSetup/HubSetup.css','dist/HubSetup/HubSetup.css');

await mkdir('dist/HubSetup/assets', { recursive: true });
await copyFile(
  'src/HubSetup/assets/zenith-cloud-reveal-castalia-bitmap-v1.png',
  'dist/HubSetup/assets/zenith-cloud-reveal-castalia-bitmap-v1.png',
);
