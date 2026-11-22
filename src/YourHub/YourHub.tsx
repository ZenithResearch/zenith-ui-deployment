"use client";
import React,{useEffect,useId,useRef,type ReactNode} from 'react';
import {ZenithCloudScene} from '../HubSetup/ZenithCloudScene.tsx';
import './YourHub.css';
export type HubResource = {key:string;label:string;purpose:string;componentId:string;status:string;managed:boolean;mode:string;observedAt?:string|null;endpoint?:string|null;actions:string[];enabled:boolean;stale?:boolean};
export function YourHub({resources,onSelect,onRefresh,busy=false,refreshing=false,selectedKey,children,notices,catalog=[],onChoose,flowContent}: {
 resources:HubResource[];onSelect:(key:string)=>void;onRefresh:()=>void;busy?:boolean;refreshing?:boolean;
 catalog?:{id:string;label:string;description:string}[];onChoose?:(id:string)=>void;flowContent?:ReactNode;
 selectedKey?:string;children?:ReactNode;notices?:ReactNode;
}) {
 const entries=resources;
 const available=catalog.filter(c=>!resources.some(r=>r.componentId===c.id));
 return <ResourceCanvas paused={Boolean(flowContent)||Boolean(selectedKey)}>
  <main id="hub-main"><h1 className="zn-your-hub__sr-only">Resources</h1>
   {notices}{flowContent}
   <div className="zn-your-hub__toolbar"><div className="zn-your-hub__count">Resources <span>{entries.length}</span></div><button className="zn-your-hub__refresh" type="button" aria-label="Refresh resources" title="Refresh resources" disabled={refreshing} aria-busy={refreshing} onClick={onRefresh}><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 7a7 7 0 0 1 11.6-1L20 9M4 15l2.3 3A7 7 0 0 0 17.9 17"/></svg></button></div>
   <div className={selectedKey?'zn-your-hub__workspace has-detail':'zn-your-hub__workspace'}>
    <section aria-label="Your resources">
     {entries.length||available.length?<div className="zn-your-hub__cards">{entries.map(r=><ResourceCard key={r.key} resource={r} selected={r.key===selectedKey} onSelect={()=>onSelect(r.key)}/>)}{available.map(c=><button key={'catalog:'+c.id} className="zn-your-hub__card is-available" disabled={busy} onClick={()=>onChoose?.(c.id)}><h2>{c.label}</h2><p>{c.description}</p><span className="zn-your-hub__card-foot"><span className="zn-your-hub__card-action">Add <span aria-hidden="true">+</span></span></span></button>)}</div>:<div className="zn-your-hub__empty"><div aria-hidden="true" className="zn-your-hub__empty-mark">+</div><h2>Make room for what you use.</h2><p>Connect an existing service or set one up here.<br/>You can add more whenever you need them.</p><small>Your guide is available from the control in the corner once configured.</small></div>}
    </section>{children}
   </div>
   <footer className="zn-your-hub__footer">Your connections stay yours. Adding a resource leaves its data with the service that owns it.</footer>
  </main>
 </ResourceCanvas>;
}
function ResourceCard({resource:r,selected,onSelect}:{resource:HubResource;selected:boolean;onSelect:()=>void}) {
 const ready=['Ready','Ready to read','Guide available','API reachable','Installed'].includes(r.status);
 return <button className={'zn-your-hub__card'+(selected?' is-selected':'')} onClick={onSelect} aria-pressed={selected}><h2>{r.label}</h2><p>{r.purpose}</p><span className="zn-your-hub__card-foot"><span className="zn-your-hub__card-status"><span className={'zn-your-hub__dot'+(ready?' is-ready':'')}/>{r.status}</span><span className="zn-your-hub__card-action">Open <span aria-hidden="true">↗</span></span></span></button>;
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

/** Shared welcome artwork, framed as a background for readable resource content. */
export function ResourceCanvas({children,paused=false}:{children:ReactNode;paused?:boolean}) {
 return <div className="zn-your-hub"><div className="zn-your-hub__sky" aria-hidden="true"><ZenithCloudScene paused={paused}/></div>{children}</div>;
}
