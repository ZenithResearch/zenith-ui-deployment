"use client";
import React,{useEffect,useId,useRef,type ReactNode} from 'react';
import {layoutResourceGraph,type GraphNode,type GraphEdge} from './graph-layout.ts';
import './YourHub.css';
export type HubResource = {id:string;key:string;label:string;purpose:string;componentId:string;status:string;managed:boolean;mode:string;observedAt?:string|null;endpoint?:string|null;actions:string[];enabled:boolean;stale?:boolean};
export function YourHub({resources,guide,onAdd,onSelect,onRefresh,busy=false,view,onView,graph,selectedKey,children,notices,catalog=[],onChoose,flowContent}: {
 resources:HubResource[];guide?:HubResource;onAdd:()=>void;onSelect:(key:string)=>void;onRefresh:()=>void;busy?:boolean;
 catalog?:{id:string;label:string;description:string}[];onChoose?:(id:string)=>void;flowContent?:ReactNode;
 view:'list'|'graph';onView:(view:'list'|'graph')=>void;graph:{nodes:GraphNode[];edges:GraphEdge[]};selectedKey?:string;children?:ReactNode;notices?:ReactNode;
}) {
 const entries=resources;
 const available=catalog.filter(c=>!resources.some(r=>r.componentId===c.id));
 return <div className="zn-your-hub">
  <header className="zn-your-hub__header"><a className="zn-your-hub__brand" href="/hub" aria-label="Zenith Hub home">ZENITH<span>Hub</span></a><div className="zn-your-hub__guide">{guide?<button onClick={()=>onSelect(guide.key)}><span className={guide.status==='Guide available'?'zn-your-hub__dot is-ready':'zn-your-hub__dot'}/><span>Hermes guide</span><small>{guide.status}</small></button>:<a href="/">Configure your guide</a>}</div></header>
  <main id="hub-main"><div className="zn-your-hub__intro"><div><p className="zn-your-hub__eyebrow">YOUR ENVIRONMENT</p><h1>Your Hub</h1><p>Bring your services, information and work together.</p></div><button className="zn-your-hub__primary" disabled={busy} onClick={onAdd}>+ Add resource</button></div>
   {notices}{flowContent}
   <div className="zn-your-hub__toolbar"><div role="group" aria-label="Resource view"><button aria-pressed={view==='list'} onClick={()=>onView('list')}>Resources <span>{entries.length}</span></button><button aria-pressed={view==='graph'} onClick={()=>onView('graph')}>Resource graph</button></div><button disabled={busy} onClick={onRefresh}>Refresh</button></div>
   <div className={selectedKey?'zn-your-hub__workspace has-detail':'zn-your-hub__workspace'}>
    <section aria-label={view==='list'?'Your resources':'Resource graph'}>
     {view==='graph'?<ResourceGraph graph={graph} onSelect={onSelect}/>:entries.length||available.length?<div className="zn-your-hub__cards">{entries.map(r=><ResourceCard key={r.key} resource={r} selected={r.key===selectedKey} onSelect={()=>onSelect(r.key)}/>)}{available.map(c=><button key={'catalog:'+c.id} className="zn-your-hub__card is-available" disabled={busy} onClick={()=>onChoose?.(c.id)}><div className="zn-your-hub__card-top"><span className="zn-your-hub__resource-symbol" aria-hidden="true">{c.label.slice(0,1)}</span><span>Available to add</span></div><h2>{c.label}</h2><p>{c.description}</p><span className="zn-your-hub__card-action">Add resource <span aria-hidden="true">+</span></span></button>)}</div>:<div className="zn-your-hub__empty"><div aria-hidden="true" className="zn-your-hub__empty-mark">+</div><h2>Make room for what you use.</h2><p>Connect an existing service or set one up here.<br/>You can add more whenever you need them.</p><button onClick={onAdd} disabled={busy}>Add your first resource <span aria-hidden="true">→</span></button><small>Your guide is available from the control in the corner once configured.</small></div>}
    </section>{children}
   </div>
   <footer className="zn-your-hub__footer">Your connections stay yours. Adding a resource leaves its data with the service that owns it.</footer>
  </main>
 </div>;
}
function ResourceCard({resource:r,selected,onSelect}:{resource:HubResource;selected:boolean;onSelect:()=>void}) {
 const ready=['Ready','Ready to read','Guide available','API reachable','Installed'].includes(r.status);
 return <button className={'zn-your-hub__card'+(selected?' is-selected':'')} onClick={onSelect} aria-pressed={selected}><div className="zn-your-hub__card-top"><span className="zn-your-hub__resource-symbol" aria-hidden="true">{r.label.slice(0,1).toUpperCase()}</span><span>{r.managed?'Managed by Hub':'Connected service'}</span><span aria-hidden="true">↗</span></div><h2>{r.label}</h2><p>{r.purpose}</p><div className="zn-your-hub__card-status"><span className={'zn-your-hub__dot'+(ready?' is-ready':'')}/>{r.status}</div><span className="zn-your-hub__card-action">View resource <span aria-hidden="true">→</span></span></button>;
}
export function ResourceGraph({graph,onSelect}:{graph:{nodes:GraphNode[];edges:GraphEdge[]};onSelect:(key:string)=>void}) {
 const layout=layoutResourceGraph(graph.nodes,graph.edges),marker=useId().replaceAll(':','');
 return <div className="zn-your-hub__graph"><p>Resources and their relationships. Select a service to inspect it.</p><div className="zn-your-hub__graph-scroll"><svg viewBox={`0 0 ${layout.width} ${layout.height}`} width={layout.width} height={layout.height} aria-label="Indexed resources, hosting, deployments and data collections" role="group"><defs><marker id={marker} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7" fill="#7f91af"/></marker></defs>{layout.routes.map((e,i)=><g key={i}><path d={e.path} fill="none" stroke="#a7b6cd" markerEnd={`url(#${marker})`}/><text x={e.labelX} y={e.labelY} textAnchor="middle" className="zn-your-hub__edge-label">{e.predicate.split('/').at(-1)}</text></g>)}{graph.nodes.map(n=>{const pos=layout.positions.get(n.id)!,key=n.metadata.resource?.key||n.metadata.resourceKey;return <g key={n.id} transform={`translate(${pos.x} ${pos.y})`} role={key?'button':'img'} tabIndex={key?0:undefined} aria-label={n.label} onClick={()=>key&&onSelect(key)} onKeyDown={e=>{if(key&&['Enter',' '].includes(e.key)){e.preventDefault();onSelect(key);}}} className={'zn-your-hub__graph-node '+(key?'is-interactive':'')}><rect width="235" height="64" rx="13"/><text x="16" y="26">{n.label.length>28?n.label.slice(0,27)+'…':n.label}</text><text x="16" y="47" className="zn-your-hub__graph-type">{n.types.map(t=>t.split('/').at(-1)).join(', ')}</text><title>{n.label+' · '+n.id}</title></g>;})}</svg></div></div>;
}
export function ResourceDetail({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}) {
 return <aside className="zn-your-hub__detail" aria-label={title+' details'}><div className="zn-your-hub__detail-heading"><h2>{title}</h2><button onClick={onClose} aria-label="Close resource details">×</button></div>{children}</aside>;
}
export function ResourceDialog({title,eyebrow,onClose,onGuideHost,children}:{title:string;eyebrow?:string;onClose:()=>void;onGuideHost?:(host:HTMLDivElement|null)=>void;children:ReactNode}) {
 const dialog=useRef<HTMLDialogElement>(null),host=useRef<HTMLDivElement>(null),close=useRef<HTMLButtonElement>(null),titleId=useId(),guide=useRef(onGuideHost);guide.current=onGuideHost;
 useEffect(()=>{const prior=document.activeElement as HTMLElement|null;dialog.current?.showModal();close.current?.focus();guide.current?.(host.current);return()=>{guide.current?.(null);dialog.current?.close();if(prior?.isConnected)prior.focus();};},[]);
 return <dialog ref={dialog} className="zn-resource-dialog" aria-labelledby={titleId} onCancel={e=>{e.preventDefault();onClose();}}><div className="zn-resource-dialog__heading"><div>{eyebrow&&<p className="zn-your-hub__eyebrow">{eyebrow}</p>}<h2 id={titleId}>{title}</h2></div><button ref={close} type="button" onClick={onClose} aria-label="Close resource flow">×</button></div>{children}<div ref={host} data-hermes-chat/></dialog>;
}

/** An on-page flow: the gallery and the global guide remain available. */
export function ResourceFlow({title,eyebrow,onClose,children}:{title:string;eyebrow?:string;onClose:()=>void;children:ReactNode}) {
 const section=useRef<HTMLElement>(null),titleId=useId();
 useEffect(()=>{section.current?.scrollIntoView({block:'start'});section.current?.focus({preventScroll:true});},[]);
 return <section ref={section} tabIndex={-1} className="zn-resource-dialog zn-resource-flow" aria-labelledby={titleId}><div className="zn-resource-dialog__heading"><div>{eyebrow&&<p className="zn-your-hub__eyebrow">{eyebrow}</p>}<h2 id={titleId}>{title}</h2></div><button type="button" onClick={onClose} aria-label="Close resource flow">×</button></div>{children}</section>;
}
