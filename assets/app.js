
var S=[["new","🟢","New","var(--new)"],["doing","🟡","Doing","var(--doing)"],["wait","🔴","Waiting","var(--wait)"],["done","🔵","Done","var(--done)"]];
var jobs=[];
try{jobs=JSON.parse(localStorage.getItem("jobs")||"[]")}catch(e){}
function dueFmt(iso,full){
  if(!iso)return "";
  var d=new Date(iso+"T00:00:00"),n=new Date();n.setHours(0,0,0,0);
  var diff=Math.round((d-n)/864e5);
  if(!full){if(diff===0)return "Today";if(diff===1)return "Tomorrow";if(diff===-1)return "Yesterday"}
  var o={weekday:"short",day:"numeric",month:"short"};
  if(d.getFullYear()!==n.getFullYear())o.year="numeric";
  return d.toLocaleDateString([],o);
}
function timeFmt(t){if(!t)return "";var p=t.split(":");return new Date(2000,0,1,+p[0],+p[1]).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
function vis(j){return !j.sched||!!qEl.value.trim()||j.due<=iso(new Date())}
function att(j){if(!j.due||j.s==="done")return false;var n=new Date();n.setHours(0,0,0,0);return Math.round((new Date(j.due+"T00:00:00")-n)/864e5)<=1}
function od(j){if(!j.due||j.s==="done")return false;var n=new Date();n.setHours(0,0,0,0);return new Date(j.due+"T00:00:00")<n}
function save(){if(window.eazieInstallCheck)setTimeout(window.eazieInstallCheck,1200);try{localStorage.setItem("jobs",JSON.stringify(jobs))}catch(e){}}
(function(){var ch=false;jobs.forEach(function(j){if(j.when!==undefined){var w=j.when;delete j.when;ch=true;
  if(/^\d{4}-\d\d-\d\d$/.test(w))j.due=w;else{j.due="";if(w)log(j,"note","Previous due text: "+w)}}});if(ch)save()})();
function esc(s){return String(s||"").replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function sInfo(k){return S.filter(function(s){return s[0]===k})[0]}
function fmt(t){var d=new Date(t),n=new Date(),same=d.toDateString()===n.toDateString(),y=new Date(n-864e5).toDateString()===d.toDateString();
  var hm=d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  return (same?"Today":y?"Yesterday":d.toLocaleDateString([],{day:"numeric",month:"short"}))+" "+hm}
function ens(j){if(!j.log)j.log=[{t:j.id,type:"added",text:ty==="personal"?"Task added":"Project added"}]}
function log(j,type,text){ens(j);j.log.push({t:Date.now(),type:type,text:text})}
function nextDue(j){
  var t=new Date();t.setHours(0,0,0,0);
  var d=j.due?new Date(j.due+"T00:00:00"):new Date(t),D=d.getDate(),y,m;
  do{
    if(j.rep==="daily")d.setDate(d.getDate()+1);
    else if(j.rep==="weekly")d.setDate(d.getDate()+7);
    else if(j.rep==="monthly"){y=d.getFullYear();m=d.getMonth()+1;d=new Date(y,m,Math.min(D,new Date(y,m+1,0).getDate()))}
    else{y=d.getFullYear()+1;m=d.getMonth();d=new Date(y,m,Math.min(D,new Date(y,m+1,0).getDate()))}
  }while(d<=t);
  return iso(d)
}
function setS(j,k){if(j.s===k)return;
  if(k==="done"&&j.rep&&j.type==="personal"&&!j.spawned){
    var nx=nextDue(j);j.s="done";j.spawned=true;
    log(j,"status","Status: Done");log(j,"status","Repeats "+RP[j.rep].toLowerCase()+", next on "+dueFmt(nx,1));
    jobs.unshift({id:Date.now()+1,type:j.type,ref:j.ref||"",name:j.name||"",title:j.title,place:j.place||"",price:j.price||"",due:nx,time:j.time||"",rep:j.rep,phone:j.phone||"",s:"new",sched:true,log:[{t:Date.now(),type:"added",text:"Scheduled repeat ("+RP[j.rep].toLowerCase()+")"}]});
    toast("Done! Back on "+dueFmt(nx,1));animG="all";save();render();return}
j.s=k;log(j,"status","Status: "+sInfo(k)[2]);animG="all";save();render()}
var sheet2=document.getElementById("sheet2"),panel2=document.getElementById("panel2");
var list=document.getElementById("list"),sheet=document.getElementById("sheet"),panel=document.getElementById("panel");

var IW='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/></svg>';
var IP='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6"/></svg>';
function mdHTML(cur){return [["work",IW,"Work"],["personal",IP,"Personal"]].map(function(x){return '<button type="button" data-m="'+x[0]+'" aria-label="'+x[2]+'" title="'+x[2]+'" aria-pressed="'+(cur===x[0])+'">'+x[1]+'<span class="lb">'+x[2]+'</span></button>'}).join("")}
var mode="work";
try{if(localStorage.getItem("mode")==="personal")mode="personal"}catch(e){}
function inMode(j){return (j.type==="personal"?"personal":"work")===mode}
var RP={"":"Never",daily:"Daily",weekly:"Weekly",monthly:"Monthly",yearly:"Yearly"},tt;
function toast(m){var t=document.getElementById("toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){t.classList.remove("on")},3500)}
var OPT={name:1,price:1,place:1,phone:1},WK={ref:1,name:1,price:1,phone:1},EZ={ref:1,price:1};
var easy=false;try{easy=localStorage.getItem("easy")==="1"}catch(e){}
var ZS=["100%","120%","140%"],zi=0;
try{zi=parseInt(localStorage.getItem("zoom"),10)||0}catch(e){}
function setZ(i){zi=i;document.documentElement.style.fontSize=(easy?Math.max(parseInt(ZS[i]),110):parseInt(ZS[i]))+"%";document.documentElement.classList.toggle("easy",easy);document.documentElement.classList.toggle("big",i>0);
  document.querySelectorAll(".ts button").forEach(function(b){b.setAttribute("aria-pressed",String(+b.dataset.z===i))});
  try{localStorage.setItem("zoom",i)}catch(e){}}
document.querySelector(".ts").addEventListener("click",function(e){var b=e.target.closest("button");if(b)setZ(+b.dataset.z)});
setZ(zi);
document.getElementById("mt").innerHTML=mdHTML(mode);
document.getElementById("mt").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
  mode=b.dataset.m;try{localStorage.setItem("mode",mode)}catch(x){}
  this.innerHTML=mdHTML(mode);animG="all";render()});
var animG="all";
var col={done:true};
try{var _c=localStorage.getItem("col");if(_c)col=JSON.parse(_c)}catch(e){}
var qEl=document.getElementById("q");
function hit(j){var q=qEl.value.trim().toLowerCase();if(!q)return true;
  var t=[j.ref,j.name,j.title,j.place,j.price,j.due?dueFmt(j.due):"",j.phone].concat((j.log||[]).filter(function(l){return l.type==="note"}).map(function(l){return l.text})).join(" ").toLowerCase();
  return t.indexOf(q)>-1}
function isCol(k){if(k in col)return !!col[k];return k==="done"||(k.indexOf("d_")===0&&k!=="d_w")}
function doneAt(j){var l=j.log||[];for(var i=l.length-1;i>=0;i--){if(l[i].type==="status"&&/^Status: Done/.test(l[i].text))return l[i].t}return l.length?l[l.length-1].t:j.id}
function fmtD(t){return new Date(t).toLocaleDateString([],{weekday:"short",day:"numeric",month:"short"})}
function bucket(t){
  var d=new Date(t),n=new Date();n.setHours(0,0,0,0);
  var ws=new Date(n);ws.setDate(n.getDate()-((n.getDay()+6)%7));
  var lw=new Date(ws);lw.setDate(ws.getDate()-7);
  var m=new Date(n.getFullYear(),n.getMonth(),1),lm=new Date(n.getFullYear(),n.getMonth()-1,1);
  if(d>=ws)return["w","This week"];
  if(d>=lw)return["lw","Last week"];
  if(d>=m)return["m","This month"];
  if(d>=lm)return["lm","Last month"];
  return[d.getFullYear()+"-"+d.getMonth(),d.toLocaleDateString([],{month:"long",year:"numeric"})];
}
function render(){
  var td=iso(new Date()),rv=false;
  jobs.forEach(function(j){if(j.sched&&j.due<=td){j.sched=false;rv=true;log(j,"status","Back on the list")}});
  if(rv)save();
  var h="",n=0,an=animG;animG=null;
  var T=mode==="personal"?"task":"project";
  document.getElementById("ttl").textContent=T==="task"?"Tasks":"Projects";
  qEl.placeholder="Search "+T+"s";qEl.setAttribute("aria-label",qEl.placeholder);
  document.getElementById("add").textContent="+ New "+T;
  S.forEach(function(s){
    var js=jobs.filter(function(j){return j.s===s[0]&&inMode(j)&&hit(j)&&vis(j)});
    if(!js.length)return;
    var bc={},lastB=null;
    if(s[0]==="done"){js=js.slice().sort(function(a,b){return doneAt(b)-doneAt(a)});js.forEach(function(j){var k=bucket(doneAt(j))[0];bc[k]=(bc[k]||0)+1})}
    var open=!!qEl.value.trim()||!isCol(s[0]);
    var go=an==="all"||an===s[0],hot=js.some(att),hotO=js.some(od);
    h+='<h2><button class="gh'+(an==="all"?' in':'')+(hot?' pulse':'')+'" data-g="'+s[0]+'" aria-expanded="'+open+'" style="--pc:'+(hotO?"#ff1f1f":"var(--acc)")+';animation-delay:'+(n++*45)+'ms;--gc:'+s[3]+';background:'+s[3]+''+(s[0]==="doing"?" linear-gradient(135deg,rgba(255,255,255,.25),rgba(255,255,255,0))":" linear-gradient(135deg,rgba(255,255,255,.2),rgba(0,0,0,.2))")+';border-color:transparent;color:'+(s[0]==="doing"?"#1a1a19":"#fff")+'">'+'<span class="ct">'+js.length+'</span><span class="nm">'+s[2]+'</span><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></h2>';
    (open?js:[]).forEach(function(j){
      if(s[0]==="done"){var bk=bucket(doneAt(j)),sOpen=!!qEl.value.trim()||!isCol("d_"+bk[0]);
        if(bk[0]!==lastB){lastB=bk[0];h+='<button class="sub" data-g="d_'+bk[0]+'" aria-expanded="'+sOpen+'"><span>'+bk[1]+'</span><span class="sc">'+bc[bk[0]]+'</span><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'}
        if(!sOpen)return}
      var P=j.type==="personal",du=j.due?'<span'+(od(j)?' style="color:var(--over);font-weight:600"':'')+'>Due '+esc(dueFmt(j.due)+(j.time?" "+timeFmt(j.time):""))+'</span>':'';
      if(j.s==="done")du='✓ Done '+fmtD(doneAt(j));
      if(j.sched&&j.due>iso(new Date()))du='<span>Appears '+esc(dueFmt(j.due,1))+'</span>';
      var sub=(P?[j.place?esc(j.place):"",du,j.rep?"↻ "+RP[j.rep]:""]:[(!easy&&j.ref)?esc(j.ref):"",(j.name&&j.title)?esc(j.title):"",du]).filter(Boolean);
      h+='<button class="job'+(go?' in':'')+(att(j)?' pulse':'')+'" style="--c:'+s[3]+';--pc:'+(od(j)?"#ff1f1f":"var(--acc)")+';animation-delay:'+(Math.min(n++,12)*45)+'ms" data-id="'+j.id+'">'+(!P&&!easy&&j.price?'<span class="r">'+esc(j.price)+'</span>':'')+'<b>'+esc(P?(j.title||j.name):(j.name||j.title))+'</b><small>'+sub.join(" · ")+'</small></button>';
    });
  });
  list.innerHTML=h||(jobs.filter(function(j){return inMode(j)&&vis(j)}).length?'<div class="empty">No matches</div>':'<div class="empty">No '+T+'s yet.<br>Tap + New '+T+'</div>');
}
list.addEventListener("click",function(e){
  var g=e.target.closest(".gh,.sub");
  if(g){col[g.dataset.g]=!isCol(g.dataset.g);if(!col[g.dataset.g])animG=g.dataset.g;try{localStorage.setItem("col",JSON.stringify(col))}catch(x){}render();return}
  var b=e.target.closest(".job");if(b)openJob(b.dataset.id);
});
function close(){sheet.classList.remove("on")}
document.addEventListener("keydown",function(e){if(e.key==="Escape"){if(sheet2.classList.contains("on"))sheet2.classList.remove("on");else close()}});
sheet.addEventListener("click",function(e){if(e.target===sheet)close()});

function openJob(id){
  var j=jobs.filter(function(x){return x.id==id})[0];if(!j)return;
  var R=[["ref","Job ref"],["name","Name"],["title","Project"],["price","Quote"],["place","Location"],["due","Due"],["rep","Repeat"],["phone","Phone"]];
  var h='<div class="top"><button class="ed" id="bk">← Back</button><button class="ed" id="ed">Edit</button></div><p class="big" style="font-size:.875rem;color:var(--mute);font-weight:600;margin:14px 0 0">'+(j.type==="personal"?"Task":"Project")+' details</p><div class="info">'+
   R.filter(function(r){return j[r[0]]&&!(j.type==="personal"&&WK[r[0]])&&!(easy&&(r[0]==="ref"||r[0]==="price"))&&!(r[0]==="rep"&&j.type!=="personal")}).map(function(r){return '<div class="row'+(r[0]==="price"?' q':'')+'"><small>'+(r[0]==="title"&&j.type==="personal"?"Task":r[1])+'</small><span>'+esc(r[0]==="due"?dueFmt(j.due,1)+(j.time?" · "+timeFmt(j.time):""):r[0]==="rep"?RP[j.rep]:j[r[0]])+(r[0]==="due"&&od(j)?' · <b style="color:var(--over)">Overdue</b>':"")+'</span></div>'}).join("")+'</div>';
  var PP=j.type==="personal";
  h+=(PP?'':'<div class="acts">')+
   (PP?'':j.phone?'<a href="tel:'+esc(j.phone.replace(/\s+/g,""))+'">Call</a>':'<a style="opacity:.35" aria-disabled="true">Call</a>')+
   (PP?'':'<a href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(j.place||j.name||j.title)+'" target="_blank" rel="noopener">Map</a>')+(PP?'':'</div>');
  h+='<div class="stat">'+S.map(function(s){return '<button data-s="'+s[0]+'" class="'+(j.s===s[0]?'on':'')+'"><span class="dot" style="background:'+s[3]+'"></span>'+s[2]+'</button>'}).join("")+'</div>';
  ens(j);
  var notes=j.log.filter(function(l){return l.type==="note"}).reverse();
  h+='<div class="sec">Notes</div><textarea id="nt" placeholder="Add a detail..."></textarea><button class="nb" id="na">Add note</button>';
  notes.forEach(function(n){h+='<div class="note">'+esc(n.text)+'<small>'+fmt(n.t)+'</small></div>'});
  if(!easy)h+='<div class="sec">Timeline</div><ul class="tl">'+j.log.slice().reverse().map(function(l){return '<li>'+esc(l.type==="note"?"Note added":(function(t){return j.type==="personal"?t.replace("Project added","Task added"):t})(l.text.replace("Job added","Project added")))+'<small>'+fmt(l.t)+'</small></li>'}).join("")+'</ul>';
  h+='<button class="x" id="del">Delete '+(j.type==="personal"?"task":"project")+'</button>';
  panel.innerHTML=h;sheet.classList.add("on");
  panel.querySelector("#na").onclick=function(){var v=panel.querySelector("#nt").value.trim();if(!v)return;log(j,"note",v);save();var sc=panel.scrollTop;openJob(j.id);panel.scrollTop=sc};
  panel.querySelector("#ed").onclick=function(){form(j)};
  panel.querySelector("#bk").onclick=close;
    panel.querySelectorAll(".stat button").forEach(function(b){b.onclick=function(){setS(j,b.dataset.s);close()}});
  panel.querySelector("#del").onclick=function(){if(confirm("Delete this "+(j.type==="personal"?"task":"project")+"?")){jobs=jobs.filter(function(x){return x.id!==j.id});save();render();close()}};
}

function nextRef(){
  var last=jobs.filter(function(x){return x.ref}).sort(function(a,b){return b.id-a.id})[0];
  var m=last&&last.ref.match(/^(.*?)(\d+)$/);
  if(!m)return "J-001";
  var n=String(parseInt(m[2],10)+1);
  while(n.length<m[2].length)n="0"+n;
  return m[1]+n;
}
var F=[["title","Project","Project details"],["ref","Job ref","J-001"],["name","Name","John Smith"],["price","Quote","Quote number or value"],["place","Location","Address or area"],["due","Due",""],["time","Time",""],["rep","Repeat",""],["phone","Phone","Phone number"]];
function pad(n){return n<10?"0"+n:""+n}
function iso(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
sheet2.addEventListener("click",function(e){if(e.target===sheet2)sheet2.classList.remove("on")});
function pickDue(fd,done){
  var sel=fd.due,tm=fd.time,base=sel?new Date(sel+"T00:00:00"):new Date();
  var vm=new Date(base.getFullYear(),base.getMonth(),1),today=iso(new Date());
  function draw(){
    var sc=panel2.scrollTop,lead=(vm.getDay()+6)%7,days=new Date(vm.getFullYear(),vm.getMonth()+1,0).getDate(),i;
    var h='<div class="top"><button class="ed" id="pb">← Back</button><button class="ed" id="pc">Clear</button></div><p class="big" style="margin-top:14px">Due date</p>';
    h+='<div class="chips qg"><button class="chip" data-q="0">Today</button><button class="chip" data-q="1">Tomorrow</button><button class="chip" data-q="7">Next week</button></div>';
    h+='<div class="mnav"><button id="pm" aria-label="Previous month">‹</button><span>'+vm.toLocaleDateString([],{month:"long",year:"numeric"})+'</span><button id="nm" aria-label="Next month">›</button></div><div class="cal">';
    for(i=0;i<7;i++)h+='<b>'+new Date(2024,0,1+i).toLocaleDateString([],{weekday:"short"})+'</b>';
    for(i=0;i<lead;i++)h+='<div></div>';
    for(i=1;i<=days;i++){var k=vm.getFullYear()+"-"+pad(vm.getMonth()+1)+"-"+pad(i);h+='<button data-d="'+k+'" class="'+(k===sel?"on":k===today?"td":"")+'">'+i+'</button>'}
    h+='</div>';
    if(sel){
      h+='<p class="big" id="tp" style="margin-top:22px">Add a time? <span style="font-weight:500;color:var(--mute);font-size:.9375rem">Optional</span></p><div class="chips tg"><button class="chip'+(!tm?" on":"")+'" data-t="">No time</button>';
      for(i=8;i<=19;i++){var t=pad(i)+":00";h+='<button class="chip'+(tm===t?" on":"")+'" data-t="'+t+'">'+timeFmt(t)+'</button>'}
      h+='</div><label for="ot">Other time</label><input id="ot" type="time" value="'+esc(tm)+'"><button class="sv" id="ps">Set '+esc(dueFmt(sel,1))+(tm?" · "+esc(timeFmt(tm)):"")+'</button>';
    }
    panel2.innerHTML=h;panel2.scrollTop=sc;
  }
  panel2.onclick=function(e){
    var b=e.target.closest("button");if(!b)return;
    if(b.id==="pb"){sheet2.classList.remove("on");return}
    if(b.id==="pc"){fd.due="";fd.time="";done();sheet2.classList.remove("on");return}
    if(b.id==="ps"){fd.due=sel;fd.time=tm;done();sheet2.classList.remove("on");return}
    if(b.id==="pm"){vm=new Date(vm.getFullYear(),vm.getMonth()-1,1);draw();return}
    if(b.id==="nm"){vm=new Date(vm.getFullYear(),vm.getMonth()+1,1);draw();return}
    if(b.dataset.q!==undefined){var d=new Date();d.setDate(d.getDate()+ +b.dataset.q);sel=iso(d);vm=new Date(d.getFullYear(),d.getMonth(),1)}
    else if(b.dataset.d)sel=b.dataset.d;
    else if(b.dataset.t!==undefined){tm=b.dataset.t;draw();return}
    else return;
    draw();var tp=panel2.querySelector("#tp");if(tp)tp.scrollIntoView({behavior:"smooth",block:"start"});
  };
  panel2.onchange=function(e){if(e.target.id==="ot"){tm=e.target.value;draw()}};
  sheet2.classList.add("on");draw();
}
function form(j){
  var fd={due:j&&j.due||"",time:j&&j.time||""},rp=j&&j.rep||"";
  var dt=function(){return fd.due?dueFmt(fd.due,1)+(fd.time?" · "+timeFmt(fd.time):""):"Select date"};
  var ty=j?(j.type==="personal"?"personal":"work"):mode;
  var h='<div class="top" style="margin-bottom:12px"><button class="ed" id="fb">← Back</button>'+(j?'<div class="md" id="ft" role="group" aria-label="Project type">'+mdHTML(ty)+'</div>':'')+'</div><p class="big" id="fh">'+(j?'Edit ':'New ')+(ty==="personal"?"task":"project")+'</p><div id="fw"'+(ty==="personal"?' class="pers"':'')+'>'+F.map(function(f){
    if(f[0]==="time")return "";
    if(f[0]==="rep")return '<div class="f pr"><label>Repeat <span class="op">(optional)</span></label><div class="chips" id="rp">'+Object.keys(RP).map(function(k){return '<button type="button" class="chip'+(rp===k?' on':'')+'" data-r="'+k+'">'+RP[k]+'</button>'}).join("")+'</div><p class="hint">When you tick a repeating task off, it moves to Done and comes back on its next due date.</p></div>';
    if(f[0]==="due")return '<div><label for="f-due-btn">Due <span class="op">(optional)</span></label><button type="button" class="dueb" id="f-due-btn">'+esc(dt())+'</button></div>';
    return '<div class="f'+(WK[f[0]]?' wk':'')+(EZ[f[0]]?' ez':'')+'"><label for="f-'+f[0]+'">'+(f[0]==="title"&&ty==="personal"?"Task":f[1])+(OPT[f[0]]?' <span class="op">(optional)</span>':'')+'</label><input id="f-'+f[0]+'" type="'+(f[0]==="phone"?"tel":"text")+'" placeholder="'+(f[0]==="title"&&ty==="personal"?"Task details":f[2])+'" autocomplete="off" value="'+esc(j?(j[f[0]]||""):(f[0]==="ref"?nextRef():""))+'"></div>'}).join("")+'</div>';
  panel.innerHTML=h+'<button class="sv" id="sv">Save</button>';
  if(j)panel.querySelector("#ft").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
    ty=b.dataset.m;this.innerHTML=mdHTML(ty);var pe=ty==="personal";
    panel.querySelector("#fh").textContent=(j?"Edit ":"New ")+(pe?"task":"project");
    panel.querySelector('label[for="f-title"]').textContent=pe?"Task":"Project";
    panel.querySelector("#f-title").placeholder=pe?"Task details":"Project details";panel.querySelector("#fw").classList.toggle("pers",ty==="personal")});
  panel.querySelector("#rp").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;rp=b.dataset.r;this.querySelectorAll("button").forEach(function(x){x.classList.toggle("on",x===b)})});
  panel.querySelector("#fb").onclick=function(){if(j)openJob(j.id);else close()};
  panel.querySelector("#f-due-btn").onclick=function(){pickDue(fd,function(){panel.querySelector("#f-due-btn").textContent=dt()})};
  sheet.classList.add("on");
  var g=function(k){return k==="due"?fd.due:k==="time"?fd.time:k==="rep"?rp:panel.querySelector("#f-"+k).value.trim()};
  panel.querySelector("#sv").onclick=function(){
    if(!g("title")){toast("Please add a title");panel.querySelector("#f-title").focus();return}
    if(j){
      var ch=[];F.forEach(function(f){var k=f[0],v=g(k);if(v!==(j[k]||"")){var pv=function(x){return k==="rep"?RP[x||""]:x?(k==="due"?dueFmt(x,1):k==="time"?timeFmt(x):x):"empty"};ch.push((k==="title"&&ty==="personal"?"Task":f[1])+": "+pv(j[k])+" → "+pv(v));j[k]=v}});
      if((j.type==="personal"?"personal":"work")!==ty){ch.push("Type: "+(ty==="personal"?"Work → Personal":"Personal → Work"));j.type=ty}
      if(ch.length){log(j,"edit","Edited: "+ch.join(", "));save();render()}
      openJob(j.id);return;
    }
    animG="all";jobs.unshift({id:Date.now(),type:ty,ref:ty==="personal"?"":g("ref"),name:g("name"),title:g("title"),place:g("place"),price:g("price"),due:g("due"),time:g("time"),rep:ty==="personal"?rp:"",phone:g("phone"),s:"new",log:[{t:Date.now(),type:"added",text:"Project added"}]});
    save();render();close();
  };
}
document.getElementById("add").onclick=function(){form()};
(function(){var vv=window.visualViewport;if(!vv)return;
  function fit(){[sheet,sheet2].forEach(function(e){e.style.top=vv.offsetTop+"px";e.style.height=vv.height+"px";e.style.bottom="auto"})}
  vv.addEventListener("resize",fit);vv.addEventListener("scroll",fit);fit();
  document.addEventListener("focusin",function(e){var t=e.target;if(t.matches&&t.matches("input,textarea")&&t.closest(".panel"))setTimeout(function(){t.scrollIntoView({block:"center",behavior:"smooth"})},320)});
})();
var ezb=document.getElementById("ez");
function ezUI(){ezb.setAttribute("aria-pressed",String(easy));ezb.textContent=easy?"✓ eazie mode":"eazie mode"}
ezb.onclick=function(){easy=!easy;try{localStorage.setItem("easy",easy?"1":"0")}catch(e){}ezUI();setZ(zi);animG=null;render()};
ezUI();
qEl.addEventListener("input",render);
document.addEventListener("visibilitychange",function(){if(!document.hidden){animG=null;render()}});
render();

/* ---- Add to Home Screen prompt (shown once a first item exists) ---- */
(function(){
  var dp=null,ib=document.getElementById("ib"),msg=document.getElementById("ibm"),go=document.getElementById("ibg"),no=document.getElementById("ibx");
  var standalone=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone;
  var ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  function dismissed(){try{return localStorage.getItem("ib")==="1"}catch(e){return false}}
  function show(){
    if(standalone||dismissed()||!jobs.length)return;
    if(dp){msg.textContent="Add eazie to your home screen to open it like an app.";go.hidden=false;ib.hidden=false}
    else if(ios){msg.textContent="To add eazie to your home screen, tap the Share button, then \u201cAdd to Home Screen\u201d.";go.hidden=true;ib.hidden=false}
  }
  window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();dp=e;show()});
  go.onclick=function(){if(!dp)return;dp.prompt();dp.userChoice.then(function(){dp=null;ib.hidden=true})};
  no.onclick=function(){ib.hidden=true;try{localStorage.setItem("ib","1")}catch(e){}};
  window.eazieInstallCheck=show;
  setTimeout(show,2500);
})();
if("serviceWorker" in navigator)window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})});
