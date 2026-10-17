// RULE-BASED PROTOTYPE — deterministic checks on the sample dataset. No LLM is connected.
import {sum,growth,pct,fp,fmt,linFit} from './calculations.js';
const H=(d,k,h)=>sum(d.m.slice(h*6,h*6+6).map(x=>x[k]));
export function analyse(d){const f=[],rg=growth(H(d,'revenue',1),H(d,'revenue',0));
 const ox=[pct(H(d,'opex',0),H(d,'revenue',0)),pct(H(d,'opex',1),H(d,'revenue',1))];
 const rc=growth(d.m[11].rec,d.m[0].rec),nm=[pct(H(d,'net',0),H(d,'revenue',0)),pct(H(d,'net',1),H(d,'revenue',1))];
 if(rg<0)f.push({s:'high',t:'Revenue declining',e:`H2 revenue ${fmt(H(d,'revenue',1))} vs H1 ${fmt(H(d,'revenue',0))} (${fp(rg)})`,c:'May be seasonal; compare with prior-year months.',n:'Which segments or customers drove the fall?'});
 else f.push({s:'good',t:'Revenue growing',e:`H2 vs H1 revenue ${fp(rg)}`,c:'Growth may be driven by one segment.',n:'Is growth broad-based across segments?'});
 if(ox[1]>ox[0])f.push({s:ox[1]-ox[0]>3?'high':'med',t:'Opex rising relative to revenue',e:`Opex/revenue ${fp(ox[0])} → ${fp(ox[1])}`,c:'May reflect planned investment.',n:'Which cost lines grew fastest and are they one-off?'});
 if(d.tot.net<0)f.push({s:'high',t:'Negative net profit',e:`FY net profit ${fmt(d.tot.net)} (revenue ${fmt(d.tot.revenue)})`,c:'Losses may be temporary restructuring costs.',n:'What is the break-even revenue at current cost levels?'});
 if(H(d,'ocf',1)<H(d,'ocf',0)||d.tot.ocf<0)f.push({s:d.tot.ocf<0?'high':'med',t:'Weakening operating cash flow',e:`OCF H1 ${fmt(H(d,'ocf',0))} → H2 ${fmt(H(d,'ocf',1))}`,c:'Timing of collections can distort short periods.',n:'Is cash being absorbed by receivables or inventory?'});
 if(rc>(rg??0)+5)f.push({s:'med',t:'Receivables outpacing revenue',e:`Receivables ${fp(rc)} Apr→Mar vs H2/H1 revenue ${fp(rg)}`,c:'May be longer terms for large clients.',n:'Review ageing of receivables and credit terms. (Signal for investigation, not proof of misconduct.)'});
 f.push({s:'info',t:'Net margin change',e:`H1 ${fp(nm[0])} → H2 ${fp(nm[1])}`,c:'Two half-years are a short window.',n:'Track quarterly.'});
 return f}
export function forecast(d){const y=d.m.map(x=>x.revenue),{s,i,sd}=linFit(y);
 return[12,13,14].map(k=>({v:i+s*k,lo:i+s*k-1.96*sd,hi:i+s*k+1.96*sd}))}
export function risk(d){const f=analyse(d).filter(x=>x.s=='high').length;return f>=2?'HIGH':f?'MODERATE':'LOW'}
// Future: swap for fetch('/api/analyse') to a FastAPI backend; keep API keys server-side.
