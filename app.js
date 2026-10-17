import {DATA,MONTHS} from './data.js';
import {fmt,fp,pct,growth,capitalGrowth,sum,selfTest} from './calculations.js';
import {analyse,forecast,risk} from './analysis-engine.js';
const $=s=>document.querySelector(s);let cur=null,page='Overview',charts=[];
const PAGES=['Overview','Revenue','Expenses','Analytics','Forecast','AI Insights','Reports','Settings'];
const toast=t=>{const e=$('#toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),2200)};
$('#demo').innerHTML=Object.entries(DATA).map(([k,v])=>`<button data-u="${k}">${v.name}</button>`).join('');
$('#demo').onclick=e=>{const k=e.target.dataset.u;if(k){$('#u').value=k;$('#p').value=DATA[k].pw}};
$('#eye').onclick=()=>{const p=$('#p');p.type=p.type=='password'?'text':'password'};
$('#lf').onsubmit=e=>{e.preventDefault();const u=$('#u').value.trim(),p=$('#p').value;
 if(!u||!p)return $('#err').textContent='Enter both username and password.';
 const d=DATA[u];if(!d||d.pw!==p)return $('#err').textContent='Invalid username or password.';
 $('#err').textContent='';cur=u;$('#login').hidden=true;$('#app').hidden=false;$('#p').value='';page='Overview';boot();toast('Welcome, '+d.name)};
$('#lo').onclick=()=>{cur=null;charts.forEach(c=>c.destroy());charts=[];$('#view').innerHTML='';$('#app').hidden=true;$('#login').hidden=false;$('#u').value=''};
setInterval(()=>$('#clock').textContent=new Date().toLocaleTimeString(),1000);
function boot(){$('#co').textContent=DATA[cur].name+' (fictional)';
 $('#nav').innerHTML=PAGES.map(p=>`<button class="${p==page?'on':''}">${p}</button>`).join('');
 $('#nav').onclick=e=>{if(e.target.tagName=='BUTTON'){page=e.target.textContent;boot()}};render()}
function chart(id,cfg){Chart.defaults.color='#7d8ba3';cfg.options={responsive:true,maintainAspectRatio:true,...cfg.options};charts.push(new Chart($('#'+id),cfg))}
const line=(l,d,c)=>({label:l,data:d,borderColor:c,backgroundColor:c+'33',tension:.35,pointRadius:2});
const C='#22d3ee',G='#fbbf24',R='#f87171';
const H=(d,k,h)=>sum(d.m.slice(h*6,h*6+6).map(x=>x[k]));
function card(t,k,d){const a=H(d,k,1),b=H(d,k,0),g=growth(a,Math.abs(b)||0);const gg=k=='net'&&b<0?null:g;
 return`<div class="card" title="H2 (Oct–Mar) vs H1 (Apr–Sep)"><h3>${t}</h3><div class="big">${fmt(a)}</div><span class="${a>=b?'up':'dn'}">${a>=b?'▲':'▼'} ${fp(gg)} vs H1</span><canvas id="sp${k}" height="40"></canvas></div>`}
function render(){charts.forEach(c=>c.destroy());charts=[];const d=DATA[cur],T=d.tot,v=$('#view');$('#title').textContent=page;
 const fs=analyse(d),box=h=>`<div class="page">${h}</div>`;
 const finds=fs.map(x=>`<div class="f ${x.s}"><b>${x.t}</b><br>${x.e}<small>Counterpoint: ${x.c}</small><small>Next: ${x.n}</small></div>`).join('');
 const cap=capitalGrowth(d.end,d.start);
 const pl=`<table><tr><td>Revenue</td><td>${fmt(T.revenue)}</td></tr><tr><td>COGS</td><td>${fmt(T.cogs)}</td></tr><tr><td>Gross Profit</td><td>${fmt(T.gp)}</td></tr><tr><td>Operating Expenses</td><td>${fmt(T.opex)}</td></tr><tr><td>Operating Profit</td><td>${fmt(T.op)}</td></tr><tr><td>Interest</td><td>${fmt(T.int)}</td></tr><tr><td>Tax</td><td>${fmt(T.tax)}</td></tr><tr><td><b>Net Profit</b></td><td><b class="${T.net>=0?'up':'dn'}">${fmt(T.net)}</b></td></tr></table>`;
 const ratios=`<table><tr><td>Gross margin</td><td>${fp(pct(T.gp,T.revenue))}</td></tr><tr><td>Net margin</td><td>${fp(pct(T.net,T.revenue))}</td></tr><tr><td>Opex / revenue</td><td>${fp(pct(T.opex,T.revenue))}</td></tr><tr><td>Operating cash flow (FY)</td><td>${fmt(T.ocf)}</td></tr><tr><td>Business value change (illustrative, ≠ net loss)</td><td>${fmt(d.start)} → ${fmt(d.end)} (${fp(cap)})</td></tr></table>`;
 const cv=(id,t)=>`<div class="card"><h3>${t}</h3><canvas id="${id}"></canvas></div>`;
 const P={
 Overview:`<div class="grid">${card('Total Revenue','revenue',d)}${card('Gross Profit','gp',d)}${card('Net Profit','net',d)}<div class="card"><h3>Net Profit Margin (FY)</h3><div class="big">${fp(pct(T.net,T.revenue))}</div><span class="mut">Risk: ${risk(d)}</span></div></div>
 <div class="grid"><div class="card core"><h3>AI Neural Core · rule-based prototype</h3><svg viewBox="0 0 400 200"><g stroke="${C}" fill="none"><path class="flow" d="M0 60H140M0 100H140M0 140H140"/></g><g stroke="${G}" fill="none"><path class="flow" d="M260 60H400M260 100H400M260 140H400"/></g><rect x="140" y="40" width="120" height="120" rx="14" fill="#0a1224" stroke="${C}" stroke-width="2"/><text x="200" y="108" text-anchor="middle" fill="${G}" font-size="26" font-weight="700">RAI</text></svg><small class="mut">Decorative · analysing ${d.name}</small></div>
 <div class="card"><h3>Profit &amp; Loss · FY (simulated)</h3>${pl}</div><div class="card"><h3>AI Financial Insights</h3>${finds}</div></div>
 <div class="grid">${cv('c1','Revenue Trend')}${cv('c2','Revenue Breakdown')}${cv('c3','Cash Flow Analysis')}</div>`,
 Revenue:`<div class="grid">${cv('c1','Monthly Revenue')}${cv('c2','Segments')}<div class="card"><h3>Growth</h3><div class="big">${fp(growth(H(d,'revenue',1),H(d,'revenue',0)))}</div>H2 vs H1</div></div>`,
 Expenses:`<div class="grid">${cv('c4','COGS vs Opex by month')}<div class="card"><h3>Cost ratios</h3>${ratios}</div></div>`,
 Analytics:`<div class="card"><h3>Ratios &amp; indicators</h3>${ratios}</div><div class="card"><h3>P&amp;L</h3>${pl}</div>`,
 Forecast:`<div class="grid">${cv('c5','Revenue forecast (illustrative)')}</div><div class="card"><small class="mut">Assumption: linear trend on 12 months of simulated revenue, ±1.96σ band. Illustrative estimate, not a guarantee; ignores seasonality, market shocks and cost changes.</small></div>`,
 'AI Insights':`<div class="card"><h3>Findings (rule-based prototype · signals for investigation, not proof of misconduct)</h3>${finds}</div>`,
 Reports:`<div class="card"><h3>${d.name} — FY Report (fictional, simulated)</h3>${pl}${ratios}${finds}<button class="btn s" id="pr">Print / Save PDF</button> <button class="btn s" id="dl">Download JSON</button></div>`,
 Settings:`<div class="card"><h3>Settings</h3><p>Reporting period: FY Apr–Mar (fixed in this demo)</p><p>Reduced motion follows your OS setting.</p><button class="btn s" id="th">Toggle light/dark</button><p class="mut tiny">Demo credentials are fictional and insecure by design.</p></div>`};
 v.innerHTML=box(P[page]);
 const sp=(k)=>$('#sp'+k)&&chart('sp'+k,{type:'line',data:{labels:MONTHS,datasets:[line('',d.m.map(x=>x[k]),C)]},options:{plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}},elements:{point:{radius:0}}}});
 ['revenue','gp','net'].forEach(sp);
 const rev=d.m.map(x=>x.revenue);
 $('#c1')&&chart('c1',{type:'line',data:{labels:MONTHS,datasets:[line('Revenue (₹ cr)',rev,C)]}});
 $('#c2')&&chart('c2',{type:'doughnut',data:{labels:Object.keys(d.seg),datasets:[{data:Object.values(d.seg).map(s=>s/100*T.revenue),backgroundColor:[C,G,'#6366f1']}]}});
 $('#c3')&&chart('c3',{data:{labels:MONTHS,datasets:[{type:'bar',label:'Operating cash flow',data:d.m.map(x=>x.ocf),backgroundColor:d.m.map(x=>x.ocf>=0?C+'99':R+'99')},{type:'line',label:'Trend',data:d.m.map(x=>x.ocf),borderColor:G,tension:.4}]}});
 $('#c4')&&chart('c4',{type:'bar',data:{labels:MONTHS,datasets:[{label:'COGS',data:d.m.map(x=>x.cogs),backgroundColor:C+'99'},{label:'Opex',data:d.m.map(x=>x.opex),backgroundColor:G+'99'}]}});
 if($('#c5')){const f=forecast(d),l=[...MONTHS,'Apr+','May+','Jun+'];chart('c5',{type:'line',data:{labels:l,datasets:[line('Historical',[...rev,null,null,null],C),{...line('Forecast',[...Array(11).fill(null),rev[11],...f.map(x=>x.v)],G),borderDash:[6,4]},{label:'Upper',data:[...Array(12).fill(null),...f.map(x=>x.hi)],borderColor:'#fbbf2455',pointRadius:0},{label:'Lower',data:[...Array(12).fill(null),...f.map(x=>x.lo)],borderColor:'#fbbf2455',pointRadius:0}]}})}
 $('#pr')&&($('#pr').onclick=()=>print());
 $('#dl')&&($('#dl').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({company:d.name,fictional:true,totals:T,findings:fs},null,2)]));a.download='rai-report.json';a.click();toast('Report downloaded')});
 $('#th')&&($('#th').onclick=()=>{document.body.style.filter=document.body.style.filter?'':'invert(1) hue-rotate(180deg)'})}
const bad=selfTest();console.log(bad.length?'RAI calc tests FAILED: '+bad:'RAI calc tests passed');
