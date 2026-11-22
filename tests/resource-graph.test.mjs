import test from 'node:test';import assert from 'node:assert/strict';
import {layoutResourceGraph} from '../dist/YourHub/graph-layout.js';
test('every rendered graph edge reaches indexed objects and all nodes fit the canvas',()=>{
 const nodes=[{id:'urn:root',label:'Inventory',types:[],metadata:{kind:'inventory'}},{id:'urn:service',label:'Service',types:[],metadata:{kind:'resource'}},{id:'urn:host',label:'Host',types:[],metadata:{kind:'host'}},{id:'urn:deploy',label:'Deployment',types:[],metadata:{kind:'deployment'}}];
 const edges=[{subject:'urn:root',target:'urn:service',predicate:'urn:member'},{subject:'urn:service',target:'urn:host',predicate:'urn:hostedBy'},{subject:'urn:deploy',target:'urn:service',predicate:'urn:realizes'}];
 const layout=layoutResourceGraph(nodes,edges);assert.equal(layout.routes.length,edges.length);
 for(const n of nodes){const p=layout.positions.get(n.id);assert.ok(p.x>=0&&p.x+235<=layout.width);assert.ok(p.y>=0&&p.y+64<=layout.height);}
 assert.ok(layout.routes[1].labelY>99,'long links use a lane below intervening cards');
 assert.match(layout.routes[2].path,/^M 630 67 C .+ 565 67$/);assert.ok(layout.routes.every(r=>!r.path.includes('NaN')));
});
test('unresolved references do not become invented graph nodes',()=>{
 const node={id:'urn:one',label:'Service',types:[],metadata:{kind:'resource'}};
 const layout=layoutResourceGraph([node],[{subject:'urn:one',target:'urn:unresolved',predicate:'urn:link'}]);
 assert.equal(layout.positions.size,1);assert.equal(layout.routes.length,0);
});
