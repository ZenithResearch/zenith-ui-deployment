export type GraphNode = {id:string;label:string;types:string[];metadata:{kind?:string;resourceKey?:string;resource?:{key:string}}};
export type GraphEdge = {subject:string;predicate:string;target:string};
export function layoutResourceGraph(nodes:GraphNode[],edges:GraphEdge[]) {
  const groups:GraphNode[][]=[[],[],[],[]];
  for(const node of nodes) {const k=node.metadata.kind;groups[k==='inventory'?0:k==='resource'?1:k==='host'?3:2].push(node);}
  const positions=new Map<string,{x:number;y:number}>();
  groups.forEach((group,col)=>group.forEach((node,row)=>positions.set(node.id,{x:30+col*300,y:35+row*110})));
  const routes=edges.filter(e=>positions.has(e.subject)&&positions.has(e.target)).map(e=>{
    const a=positions.get(e.subject)!,b=positions.get(e.target)!,right=b.x>=a.x;
    const x1=a.x+(right?235:0),x2=b.x+(right?0:235),y1=a.y+32,y2=b.y+32,mid=(x1+x2)/2;
    return {...e,path:`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`,labelX:mid,labelY:(y1+y2)/2-7};
  });
  return {positions,routes,width:1200,height:Math.max(250,...groups.map(g=>g.length*110+40))};
}
