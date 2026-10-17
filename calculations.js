export const sum=a=>a.reduce((x,y)=>x+y,0);
export const grossProfit=(r,c)=>r-c;
export const operatingProfit=(g,o)=>g-o;
export const netProfit=(op,i,t)=>op-i-t;
export const pct=(n,d)=>d>0?n/d*100:null;               // null = undefined ratio
export const growth=(cur,prev)=>prev>0?(cur-prev)/prev*100:null;
export const capitalGrowth=(end,start)=>growth(end,start);
export const fmt=(v,d=1)=>v==null?'n/a':'₹'+v.toFixed(d)+' cr';
export const fp=v=>v==null?'n/a':v.toFixed(1)+'%';
export function linFit(y){const n=y.length,x=y.map((_,i)=>i),mx=sum(x)/n,my=sum(y)/n;
 const s=sum(x.map((v,i)=>(v-mx)*(y[i]-my)))/sum(x.map(v=>(v-mx)**2));return{s,i:my-s*mx,sd:Math.sqrt(sum(y.map((v,k)=>(v-(my-s*mx+s*k))**2))/(n-2))}}
export function selfTest(){const e=[];const t=(n,a,b)=>Math.abs(a-b)>1e-9&&e.push(n);
 t('gp',grossProfit(100,60),40);t('op',operatingProfit(40,25),15);t('net',netProfit(15,2,3),10);
 t('growth',growth(110,100),10);t('cap',capitalGrowth(50,100),-50);if(growth(5,0)!==null)e.push('zero-denominator');return e}
