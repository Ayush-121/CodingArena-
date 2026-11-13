import {useEffect,useMemo,useState} from "react";
import {Link,useSearchParams} from "react-router-dom";
import {Search,SlidersHorizontal,CheckCircle2,ArrowUpRight,Code2,Layers3} from "lucide-react";
import api from "../api";
const sample=[
 {_id:"1",title:"Two Sum",slug:"two-sum",difficulty:"Easy",tags:["Array","Hash Table"],acceptance:52.1},
 {_id:"2",title:"Valid Parentheses",slug:"valid-parentheses",difficulty:"Easy",tags:["String","Stack"],acceptance:41.8},
 {_id:"3",title:"Binary Search",slug:"binary-search",difficulty:"Easy",tags:["Array","Binary Search"],acceptance:48.3},
 {_id:"4",title:"Maximum Subarray",slug:"maximum-subarray",difficulty:"Medium",tags:["Array","Dynamic Programming"],acceptance:49.6},
 {_id:"5",title:"3Sum",slug:"3sum",difficulty:"Medium",tags:["Array","Two Pointers"],acceptance:32.4},
 {_id:"6",title:"Trapping Rain Water",slug:"trapping-rain-water",difficulty:"Hard",tags:["Array","Two Pointers"],acceptance:59.2}
];
export default function Problems(){
 const [params]=useSearchParams();
 const [items,setItems]=useState(sample),[search,setSearch]=useState(""),[level,setLevel]=useState("All"),[topic,setTopic]=useState(params.get("topic")||"All topics"),[loading,setLoading]=useState(false);
 useEffect(()=>{setLoading(true);api.get("/problems").then(r=>setItems(r.data.problems?.length?r.data.problems:sample)).catch(()=>{}).finally(()=>setLoading(false));},[]);
 const topics=useMemo(()=>[...new Set(items.flatMap(p=>p.tags||[]))].sort(),[items]);
 const visible=useMemo(()=>items.filter(p=>(level==="All"||p.difficulty===level)&&(topic==="All topics"||(p.tags||[]).includes(topic))&&p.title.toLowerCase().includes(search.toLowerCase())),[items,level,topic,search]);
 const counts=useMemo(()=>({Easy:items.filter(p=>p.difficulty==="Easy").length,Medium:items.filter(p=>p.difficulty==="Medium").length,Hard:items.filter(p=>p.difficulty==="Hard").length}),[items]);
 return <><div className="page-heading"><div><div className="eyebrow">PRACTICE LIBRARY</div><h1>Problem set</h1><p className="muted">Choose a topic, set your difficulty and solve in your own workspace.</p></div><div className="problem-total"><b>{items.length}</b><small>Available challenges</small></div></div>
 <div className="difficulty-overview">{["Easy","Medium","Hard"].map((x)=><button key={x} className={`difficulty-tile ${x.toLowerCase()} ${level===x?"chosen":""}`} onClick={()=>setLevel(level===x?"All":x)}><span>{x}</span><b>{counts[x]}</b><small>problems</small></button>)}</div>
 <section className="panel topic-browser"><div className="topic-browser-head"><div><h3><Layers3 size={16}/> Browse by topic</h3><p className="muted">Each topic has its own problem list. Select one to filter.</p></div><span className="pill">{topics.length} topics</span></div><div className="topic-chips"><button className={topic==="All topics"?"topic-chip active":"topic-chip"} onClick={()=>setTopic("All topics")}>All topics <span>{items.length}</span></button>{topics.map(t=><button key={t} className={topic===t?"topic-chip active":"topic-chip"} onClick={()=>setTopic(t)}>{t}<span>{items.filter(p=>(p.tags||[]).includes(t)).length}</span></button>)}</div></section>
 <div className="problem-toolbar"><div className="search-box"><Search size={17}/><input placeholder="Search problems..." value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="filters"><SlidersHorizontal size={16}/>{["All","Easy","Medium","Hard"].map(x=><button key={x} onClick={()=>setLevel(x)} className={level===x?"filter active":"filter"}>{x}</button>)}</div></div>
 <div className="panel problem-table"><div className="table-head"><span>STATUS</span><span>PROBLEM</span><span>DIFFICULTY</span><span>ACCEPTANCE</span><span></span></div>{visible.map((p,i)=><Link to={`/problems/${p.slug}`} className="problem-row" key={p._id}><span>{p.solved?<CheckCircle2 size={17} className="mint-text"/>:<span className="empty-status"/>}</span><span><b>{String(i+1).padStart(2,"0")}. {p.title}</b><small>{(p.tags||[]).join(" · ")}</small></span><span><em className={`difficulty ${p.difficulty?.toLowerCase()}`}>{p.difficulty}</em></span><span className="acceptance">{p.acceptance||"—"}%</span><span><ArrowUpRight size={17}/></span></Link>)}{!visible.length&&<div className="empty-state">{loading?"Loading problems...":"No problems match your filters."}</div>}</div><p className="table-foot"><Code2 size={15}/> Select any problem to open its description, editorial, video solution and code editor.</p></>;
}
