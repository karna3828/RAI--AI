// FICTIONAL, simulated data. Units: ₹ crore. FY = Apr..Mar. Demo credentials are NOT secure.
import {sum,grossProfit,operatingProfit,netProfit} from './calculations.js';
export const MONTHS=['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
const W=[0,.3,-.2,.4,-.3,.2,.5,-.4,.3,-.1,.4,.2];
const CFG={
 growth_admin:{pw:'RAI@Growth150',name:'RAI Growth Industries',rev:[8,13],cogs:.52,opex:[2.6,3.3],int:.2,tax:.25,conv:.9,rec:[8,11],start:100,end:150,seg:{'Core Products':50,Services:30,Exports:20}},
 challenge_admin:{pw:'RAI@Loss50',name:'RAI Challenge Enterprises',rev:[9,6.4],cogs:.66,opex:[3.2,3.9],int:.5,tax:.25,conv:1,rec:[6,9.5],start:100,end:50,seg:{'Core Products':65,Services:20,Exports:15}},
 balanced_admin:{pw:'RAI@Balance110',name:'RAI Balanced Ventures',rev:[8,9.4],cogs:.6,opex:[2.3,2.75],int:.25,tax:.25,conv:.85,rec:[6,7],start:100,end:110,seg:{'Core Products':45,Services:35,Exports:20}}};
function build(c){const L=(a,i)=>a[0]+(a[1]-a[0])*i/11;const m=MONTHS.map((_,i)=>{
 const revenue=L(c.rev,i)+W[i]*c.rev[0]*.1,cogs=revenue*c.cogs,opex=L(c.opex,i),rec=L(c.rec,i);
 const gp=grossProfit(revenue,cogs),op=operatingProfit(gp,opex),tax=Math.max(0,(op-c.int)*c.tax),net=netProfit(op,c.int,tax);
 return{revenue,cogs,opex,rec,gp,op,int:c.int,tax,net}});
 m.forEach((x,i)=>x.ocf=x.net*c.conv-(i?x.rec-m[i-1].rec:0));  // documented: net*conversion − Δreceivables
 const T=k=>sum(m.map(x=>x[k]));return{...c,m,tot:Object.fromEntries(['revenue','cogs','gp','opex','op','int','tax','net','ocf'].map(k=>[k,T(k)]))}}
export const DATA=Object.fromEntries(Object.entries(CFG).map(([k,v])=>[k,build(v)]));
