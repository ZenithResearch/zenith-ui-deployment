import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
const p=JSON.parse(await readFile('provenance.json','utf8'));for(const f of [...p.files,...(p.authored_files||[])]){if(createHash('sha256').update(await readFile(f.path)).digest('hex')!==f.sha256)throw Error('Source hash differs: '+f.path);}console.log('Source provenance matches.');
