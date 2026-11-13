export default function Heatmap({activity={}}){
 const days=Array.from({length:140},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(139-i));const key=d.toISOString().slice(0,10);return {key,count:activity[key]||0};});
 return <div className="heat-wrap"><div className="heatmap">{days.map(d=><div key={d.key} className={`heat-cell lv-${Math.min(4,d.count)}`} title={`${d.key}: ${d.count} submissions`}/>)}</div><div className="heat-legend"><span>Less</span>{[0,1,2,3,4].map(n=><i key={n} className={`heat-cell lv-${n}`}/>)}<span>More</span></div></div>
}
