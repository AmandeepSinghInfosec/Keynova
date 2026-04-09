// KeyNova v2 — popup.js  (ES module, fully self-contained)
import { auth, db } from "./firebase-config";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";

//Signup function
async function signUp(email, pass) {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, pass);
        console.log("User registered:", userCredentials.user.uid);
        return userCredentials.user;
    } catch (error) {
        console.error("Error signing up: ", error.code, error.message);
    }
}

//Signin function
async function signIn(email, pass) {
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, pass);
        console.log("User signed in:", userCredentials.user.uid);
        return userCredentials.user;
    } catch (error) {
        console.error("Error signing in:", error.code, error.message);
    }
}

//Save logged-in user activity data to firestore function
async function saveUserData(userId, data) {
    try {
        const docRef = await addDoc(collection(db, "user_activity"), {
            uid: userId,
            ...data,
            timestamp: serverTimestamp()
        });
        console.log("Data saved with ID:", docRef.id);
    } catch (error) {
        console.error("Firestore Error:", error.message);
    }
}

// Watch for the currently logged in user from local storage
onAuthStateChanged(auth, async(user) => {
  if (user) {
    fbUser = user;
    console.log("User is currently logged in:", user.email, fbUser);
    
    //Major Change Here-> Creating a salt to derive a secure key based on that, after auto-login.
    try{
      let saltB64=localStorage.getItem('kn_salt'),salt;
      if(!saltB64){salt=crypto.getRandomValues(new Uint8Array(16));localStorage.setItem('kn_salt',b64(salt));}
      else salt=unb64(saltB64);

      SK=await deriveKey(user.uid,salt);
      console.log("Key type check:", SK instanceof CryptoKey, SK);
      sessionStorage.setItem('kn_ok','1');

      //if(fbUser){const cv=await cloudPull();if(cv)await saveVault(cv);}
      //show('vault'); await renderVault();
    }catch(e){
      setErr('lock-error','Incorrect user session or corrupted vault.');
      SK=null; sessionStorage.removeItem('kn_ok');
    }
    show('vault'); 
    renderVault(); 
    toast('✅ Signed in — vault synced');
    //document.getElementById('status-msg').innerText = `Welcome back, ${user.email}`;
    /* Repeated Lines of Code */
    // document.getElementById('email').hidden=true;
    // document.getElementById('password').hidden=true;
    // document.getElementById('btn-signup').hidden=true;
    // document.getElementById('btn-signin').hidden=true;

    /* One line of code doing same thing as above */
    //change values inside the below array ['change_here'] and replace them with your html element (buttons, inputs, etc.) IDs.
    //["fb-email", 'fb-pw', 'signup-btn', 'signin-btn'].map(i=> document.getElementById(i).hidden=true)
    //document.getElementById('screen-signin').hidden = false;
    // Show your "Logged In" UI here
    
  } else {
    console.log("No user logged in.");
    // Show your "Login/Signup" form here
  }
});

document.getElementById('screen-signin').addEventListener('load', ()=> console.log("Signed in user: ", fbUser))

//Login and signup trigger function when signup/signin button is clicked in your extension. This functions runs only after HTML gets fully loaded. That's why `DOMContentLoaded`.

document.addEventListener('DOMContentLoaded', () => {

    //change the id inside `document.getElementById('change here')` function with your HTML element ID. This is to show a status message.
    const status = document.getElementById('status-msg');

    //change values inside `document.getElementById('change\\\_here')` function according to your html element (buttons, inputs, etc.) IDs.
    document.getElementById('signup-btn').onclick =async()=> {
        const user = await signUp(
            document.getElementById('fb-email').value,
            document.getElementById('fb-pw').value
        )
        //status.innerText = user ? "Sign up successful!" : "Sign up failed.";   //if user sign up successfully or not, a message is shown.
    }

    //change values inside `document.getElementById('change\_here')` function according to your html element (buttons, inputs, etc.) IDs.
    document.getElementById('signin-btn').onclick = async () => {
        const email=$('fb-email').value.trim(), pw=$('fb-pw').value;
        if(!email || !pw) {
          $('signin-error').textContent='Fill in both fields';
          return;
        }
        $('signin-btn').innerHTML='<span class="spin">⟳</span>'; $('signin-btn').disabled=true;
        //$('signin-error').textContent='';
        
        const user = await signIn(
            document.getElementById('fb-email').value,
            document.getElementById('fb-pw').value
        );
        try {
          if (user) {
            //status.innerText = "Logged in as " + user.email;     //if user logs in successfully, a message is shown.
            // Test Firestore write immediately after login
            show('vault'); await renderVault(); toast('✅ Signed in — vault synced');
            fbUser = user;
            await saveUserData(user.uid, { action: "login_test" });
          }
        } catch (error) {
          $('signin-error').textContent= 'Sign in failed: '+error?.message;
          // error.code?.includes('auth/user-not-found') ? 'Account not found. Create one below.' :
          // error.code?.includes('auth/wrong-password') ? 'Wrong password.' :
          // error.code?.includes('auth/invalid-credential') ? 'Email or password incorrect.' : 'Sign in failed: '+error.message;
          //status.innerText = "Login failed.";                  //if user login attempt fails, a message is shown.
        } 
    };
});

// ── Crypto ────────────────────────────────────────────────────────────────────
const _e = new TextEncoder(), _d = new TextDecoder();
const b64   = b => btoa(String.fromCharCode(...new Uint8Array(b)));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

async function deriveKey(pw, salt) {
  const raw = await crypto.subtle.importKey('raw', _e.encode(pw), 'PBKDF2', false, ['deriveKey']);
  console.log("Created key ", raw);
  return crypto.subtle.deriveKey(
    { name:'PBKDF2', salt, iterations:100000, hash:'SHA-256' },
    raw, { name:'AES-GCM', length:256 }, false, ['encrypt','decrypt']
  );
}
async function encryptVault(key, data) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({name:'AES-GCM',iv}, key, _e.encode(JSON.stringify(data)));
  return { iv: b64(iv), data: b64(ct) };
}
async function decryptVault(key, {iv, data}) {
  const pt = await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(iv)}, key, unb64(data));
  return JSON.parse(_d.decode(pt));
}

// ── Password Strength ─────────────────────────────────────────────────────────
function strength(pw) {
  if (!pw) return { score:0, label:'', color:'var(--muted)', pct:0, crack:'' };
  let s = 0;
  if (pw.length>=8) s++; if (pw.length>=12) s++; if (pw.length>=16) s++;
  if (/[a-z]/.test(pw)) s++; if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++; if (/[^a-zA-Z0-9]/.test(pw)) s++;
  if (/(.)\1{2,}/.test(pw) || /^(123|abc|qwerty|pass)/i.test(pw)) s = Math.max(0,s-2);
  s = Math.min(5, Math.max(0,s));
  let pool=0;
  if (/[a-z]/.test(pw)) pool+=26; if (/[A-Z]/.test(pw)) pool+=26;
  if (/[0-9]/.test(pw)) pool+=10; if (/[^a-zA-Z0-9]/.test(pw)) pool+=32;
  const secs = Math.pow(pool||1, pw.length) / 1e10;
  const crack = secs<1?'instantly':secs<60?Math.round(secs)+'s':secs<3600?Math.round(secs/60)+'m':
    secs<86400?Math.round(secs/3600)+'h':secs<2592000?Math.round(secs/86400)+'d':
    secs<31536000?Math.round(secs/2592000)+'mo':secs<3.15e9?Math.round(secs/31536000)+'yr':'centuries';
  const levels=[
    {label:'Very Weak',color:'#f43f5e'},{label:'Weak',color:'#f97316'},
    {label:'Fair',color:'#eab308'},{label:'Good',color:'#22c55e'},
    {label:'Strong',color:'#10b981'},{label:'Very Strong',color:'#0ea5e9'},
  ];
  return { s, ...levels[s], pct:(s/5)*100, crack };
}

// ── Generators ────────────────────────────────────────────────────────────────
const WORDS=['apple','brave','crisp','delta','eagle','flame','grace','hazel','ivory','jewel',
'kite','lemon','maple','noble','ocean','pearl','quiet','river','storm','tiger','ultra','vivid',
'waltz','yield','zebra','amber','blaze','cedar','drift','ember','frost','glide','heron','lunar',
'nexus','orbit','prism','quest','raven','slate','torch','pixel','cyber','nova','flux','echo',
'void','grid','byte','core','node','cloud','swift','forge','steel','sharp','ghost','blade'];
const ADJ=['swift','calm','bold','bright','dark','quiet','wild','iron','neon','sage','teal','echo',
'frost','cyber','pixel','sharp','ghost','steel','silent','rapid'];
const NON=['fox','hawk','wolf','bear','crow','lynx','seal','mist','tide','peak','node','byte',
'core','flux','void','grid','forge','blade','ghost','prism'];

function ri(n){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n}

function genPassword({len=16,up=true,lo=true,dg=true,sy=true,noAmb=false}={}){
  const amb='0O1lI';
  const f=s=>noAmb?s.split('').filter(c=>!amb.includes(c)).join(''):s;
  let pool='';
  if(lo) pool+=f('abcdefghijklmnopqrstuvwxyz');
  if(up) pool+=f('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if(dg) pool+=f('0123456789');
  if(sy) pool+='!@#$%^&*()-_=+[]{}|;:,.<>?';
  if(!pool) return '';
  const arr=Array.from({length:len},()=>pool[ri(pool.length)]);
  for(let i=arr.length-1;i>0;i--){const j=ri(i+1);[arr[i],arr[j]]=[arr[j],arr[i]];}
  return arr.join('');
}

function genPassphrase({count=4,sep='-',cap=true,num=true}={}){
  const ws=Array.from({length:count},()=>{
    const w=WORDS[ri(WORDS.length)];return cap?w[0].toUpperCase()+w.slice(1):w;
  });
  if(num) ws.push(String(ri(90)+10));
  return ws.join(sep);
}

function genUsername(style='adj-noun'){
  if(style==='adj-noun') return ADJ[ri(ADJ.length)]+'_'+NON[ri(NON.length)]+String(ri(90)+10);
  if(style==='word-number') return WORDS[ri(WORDS.length)]+String(ri(9000)+1000);
  const p='abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({length:11},()=>p[ri(p.length)]).join('');
}

// ── Local Storage ─────────────────────────────────────────────────────────────
const VKEY='kn_vault';
async function loadVault(){
  return new Promise(r=>chrome.storage.local.get(VKEY,res=>
    r(res[VKEY]||{entries:[],cats:['Social','Work','Finance','Shopping','Dev','Personal','Other']})));
}
async function saveVault(v){return new Promise(r=>chrome.storage.local.set({[VKEY]:v},r))}

// ── Firebase ──────────────────────────────────────────────────────────────────
let fbUser=null,fbReady=true,fbFn={};

// async function initFb(){
//   try{
//     const {FIREBASE_CONFIG}=await import(chrome.runtime.getURL('firebase-config.js'));
//     if(!FIREBASE_CONFIG?.apiKey||FIREBASE_CONFIG.apiKey.includes('PASTE')) return false;
//     const [{initializeApp,getApps},AM,FM]=await Promise.all([
//       import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
//       import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'),
//       import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'),
//     ]);
//     const app=getApps().length?getApps()[0]:initializeApp(FIREBASE_CONFIG);
//     fbAuth=AM.getAuth(app); fbDb=FM.getFirestore(app);
//     fbFn={signIn:(e,p)=>AM.signInWithEmailAndPassword(fbAuth,e,p),
//           signUp:(e,p)=>AM.createUserWithEmailAndPassword(fbAuth,e,p),
//           signOut:()=>AM.signOut(fbAuth),
//           onAuth:cb=>AM.onAuthStateChanged(fbAuth,cb),
//           ref:(c,d)=>FM.doc(fbDb,c,d),
//           set:FM.setDoc, get:FM.getDoc};
//     fbFn.onAuth(u=>{fbUser=u;updateOnlinePill();});
//     return true;
//   }catch(e){console.warn('Firebase:',e.message);return false;}
// }

async function cloudPush(){
  if(!fbDb||!fbUser||!SK) return false;
  try{
    const blob=await encryptVault(SK,await loadVault());
   await fbFn.set(fbFn.ref('vaults',fbUser.uid),{blob,ts:Date.now()});
    return true;
  } catch(e){console.error(e);return false;} }


async function saveData(){
  try {
    //SK=await deriveKey(pw,salt);
    console.log("Key type check:", SK instanceof CryptoKey, SK);
    const data = await encryptVault(SK,await loadVault());
    const dataArr = [data];
    console.log(fbUser)
    //const data = await loadVault();
    
    //Data storage-> Commented for now
    //Data storage with encryption-> fixed and working
    if(fbUser) {
      const q = query(collection(db, "saved_data"), where("uid", "==", fbUser?.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async(doc)=> {
        await updateDoc(doc.ref, {
          //uid: fbUser?.uid, 
          dataArr: arrayUnion(data),
          timestamp: serverTimestamp(),
        });
        console.log("Document updated:", doc.ref.id);
      });
      //const docRef = doc(db, "saved_data", fbUser?.uid);    //finding/referring currently logged-in user's doc in db.
    }else {
      const docRef = await addDoc(collection(db, "saved_data"), {
        uid: fbUser?.uid, 
        dataArr,
        timestamp: serverTimestamp(),
      });
      console.log("Document Created:", docRef.id);
    }
  } catch (error) {
    console.error("Some error", error);
    return false;
  }
}


// async function cloudPull(){
//   if(!fbDb||!fbUser||!SK) return null;
//   try{
//     const snap=await fbFn.get(fbFn.ref('vaults',fbUser.uid));
//     return snap.exists()?await decryptVault(SK,snap.data().blob):null;
//   }catch(e){console.error(e);return null;}
// }

// ── App State ─────────────────────────────────────────────────────────────────
let SK=null;          // session encryption key
let editId=null;      // entry being edited
let activeTab='all';
let activeGen='password';
let searchQ='';
let catQ='';
let currentHost='';   // current page hostname for autofill matching
let genTarget=null;   // 'entry' or 'standalone'

// ── DOM helpers ───────────────────────────────────────────────────────────────
const $=id=>document.getElementById(id);
const SCREENS=['lock','vault','entry','generator','autofill','signin','forgot'];

function show(name){
  SCREENS.forEach(s=>{
    const el=$('screen-'+s);
    if(el) el.classList.toggle('hidden',s!==name);
  });
}

function toast(msg,ms=2400){
  const el=$('toast');
  el.textContent=msg; el.classList.add('show');
  clearTimeout(el._t);
  el._t=setTimeout(()=>el.classList.remove('show'),ms);
}

function ripple(btn,e){
  const r=document.createElement('span'), d=Math.max(btn.clientWidth,btn.clientHeight);
  const rect=btn.getBoundingClientRect();
  r.className='ripple';
  r.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-rect.left-d/2}px;top:${e.clientY-rect.top-d/2}px`;
  btn.appendChild(r);
  setTimeout(()=>r.remove(),600);
}

// ── Online Pill ───────────────────────────────────────────────────────────────
function updateOnlinePill(){
  const pill=$('online-pill'), label=$('online-label');
  if(!pill) return;
  if(fbUser){
    pill.className='status-pill online';
    label.textContent=fbUser.email.split('@')[0];
    $('sync-btn').style.color='var(--blue2)';
  }else{
    pill.className='status-pill offline';
    label.textContent='Offline';
    $('sync-btn').style.color='';
  }
}

// ── Strength meter update ─────────────────────────────────────────────────────
function updateStrength(pw){
  const r=strength(pw);
  $('strength-fill').style.cssText=`width:${r.pct}%;background:${r.color}`;
  $('strength-label').textContent=r.label;
  $('strength-label').style.color=r.color;
  $('strength-crack').textContent=r.pct>0?`crack: ~${r.crack}`:'';
  const dots=$('strength-dots').children;
  for(let i=0;i<5;i++)
    dots[i].style.background=i<r.s?r.color:'var(--bg3)';
}

// ── INIT ──────────────────────────────────────────────────────────────────────
async function init(){
  // Get current tab hostname
  try{
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    if(tab?.url) currentHost=new URL(tab.url).hostname.replace('www.','');
  }catch(_){}

  //fbReady=await initFb();
  updateOnlinePill();

  if(sessionStorage.getItem('kn_ok')==='1'&&SK){
    show('vault'); await renderVault();
  }else{
    show('lock');
  }

  bindAll();
  document.querySelectorAll('.btn').forEach(b=>b.addEventListener('click',e=>ripple(b,e)));

  // Check if current page has a login form → show autofill quick button
  setTimeout(async()=>{
    try{
      const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
      if(!tab) return;
      const res=await chrome.tabs.sendMessage(tab.id,{type:'KEYNOVA_DETECT_FIELDS'});
      if(res?.hasLoginForm){
        const btn=$('autofill-quick-btn');
        if(btn){ btn.style.display='flex'; btn.classList.add('active'); }
      }
    }catch(_){}
  },300);
}

// ── UNLOCK ────────────────────────────────────────────────────────────────────
async function unlock(){
  const pw=$('master-pw').value.trim();
  if(!pw){setErr('lock-error','Enter your master password');return;}

  const btn=$('unlock-btn');
  btn.innerHTML='<span class="spin">⟳</span> Unlocking…'; btn.disabled=true;

  try{
    let saltB64=localStorage.getItem('kn_salt'),salt;
    if(!saltB64){salt=crypto.getRandomValues(new Uint8Array(16));localStorage.setItem('kn_salt',b64(salt));}
    else salt=unb64(saltB64);

    SK=await deriveKey(pw,salt);
    console.log("Key type cheak:", SK instanceof CryptoKey, SK);
    sessionStorage.setItem('kn_ok','1');

    if(fbReady&&fbUser){const cv=await cloudPull();if(cv)await saveVault(cv);}
    show('vault'); await renderVault();
  }catch(e){
    setErr('lock-error','Incorrect password or corrupted vault.');
    SK=null; sessionStorage.removeItem('kn_ok');
  }finally{
    btn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Unlock Vault';
    btn.disabled=false;
  }
}

function setErr(id,msg){const el=$(id);if(el){el.textContent=msg;el.style.display='block';}}
function clearErr(id){const el=$(id);if(el){el.textContent='';el.style.display='none';}}

// ── VAULT RENDER ──────────────────────────────────────────────────────────────
const ICONS={password:'🔑',note:'📝',wifi:'📶',api_key:'🔐',pin:'🔢'};

async function renderVault(){
  const vault=await loadVault();
  let items=[...vault.entries];

  if(activeTab==='favorites') items=items.filter(e=>e.fav);
  if(activeTab==='passwords') items=items.filter(e=>e.type==='password');
  if(activeTab==='notes')     items=items.filter(e=>e.type==='note');
  if(searchQ) items=items.filter(e=>(e.name+e.user+e.url+(e.tags||[]).join('')).toLowerCase().includes(searchQ.toLowerCase()));
  if(catQ)    items=items.filter(e=>e.cat===catQ);

  const list=$('entry-list'); list.innerHTML='';

  if(!items.length){
    list.innerHTML=`<div class="empty"><span class="empty-icon">🔐</span><p>${searchQ?'No matches found.':'No entries yet.<br/>Tap + to add your first credential.'}</p></div>`;
  }else{
    items.forEach((e,i)=>{
      const isMatch=currentHost&&e.url&&(
        e.url.toLowerCase().includes(currentHost)||currentHost.includes(e.url.toLowerCase().replace(/https?:\/\//,'').replace('www.',''))
      );
      const card=document.createElement('div');
      card.className='entry-card';
      card.style.animationDelay=(i*0.035)+'s';
      card.innerHTML=`
        <div class="entry-type-icon">${ICONS[e.type]||'🔑'}</div>
        <div class="entry-info">
          <div class="entry-name">${e.name||'Untitled'}</div>
          <div class="entry-sub">${e.user||e.url||e.cat||''}</div>
          <div class="entry-meta">
            ${isMatch?'<span class="entry-tag entry-match-tag">✓ Match</span>':''}
            ${(e.tags||[]).slice(0,2).map(t=>`<span class="entry-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="entry-actions">
          <button class="entry-action-btn fav ${e.fav?'on':''}" title="${e.fav?'Remove fav':'Add fav'}">★</button>
          <button class="entry-action-btn af-btn" title="Autofill">⚡</button>
          <button class="entry-action-btn edit-btn" title="Edit">✏️</button>
        </div>`;

      card.querySelector('.entry-info').addEventListener('click',()=>openEntry(e));
      card.querySelector('.edit-btn').addEventListener('click',ev=>{ev.stopPropagation();openEntry(e);});
      card.querySelector('.fav').addEventListener('click',async ev=>{
        ev.stopPropagation();
        const v=await loadVault();
        const en=v.entries.find(x=>x.id===e.id);
        if(en){en.fav=!en.fav;await saveVault(v);}
        await renderVault();
      });
      card.querySelector('.af-btn').addEventListener('click',async ev=>{
        ev.stopPropagation(); await doAutofill(e);
      });
      list.appendChild(card);
    });
  }

  // Category dropdown
  const sel=$('cat-filter'),cur=sel.value;
  sel.innerHTML='<option value="">All</option>';
  vault.cats.forEach(c=>{
    const o=document.createElement('option');
    o.value=c;o.textContent=c;if(c===cur)o.selected=true;
    sel.appendChild(o);
  });

  updateOnlinePill();
}

// ── AUTOFILL ──────────────────────────────────────────────────────────────────
async function doAutofill(entry){
  try{
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    if(!tab){toast('❌ No active tab');return;}
    const res=await chrome.tabs.sendMessage(tab.id,{
      type:'KEYNOVA_AUTOFILL',
      payload:{username:entry.user,password:entry.pass}
    });
    if(res?.success){toast(`⚡ Autofilled: ${entry.name}`);setTimeout(()=>window.close(),700);}
    else toast('⚠️ No login form found on this page');
  }catch(_){toast('⚠️ Cannot autofill here — open a login page first');}
}

async function openAutofillScreen(){
  const vault=await loadVault();
  const domain=$('autofill-domain');
  domain.textContent=currentHost||'this page';

  const matches=currentHost
    ?vault.entries.filter(e=>e.url&&(
        e.url.toLowerCase().includes(currentHost)||
        currentHost.includes(e.url.toLowerCase().replace(/https?:\/\//,'').replace('www.',''))
      ))
    :[];
  const items=matches.length?matches:vault.entries.filter(e=>e.type==='password');

  const list=$('autofill-list'); list.innerHTML='';
  if(!items.length){
    list.innerHTML='<div class="empty"><span class="empty-icon">🔍</span><p>No saved passwords yet.</p></div>';
  }else{
    if(matches.length) list.innerHTML='<p style="font-size:11px;color:var(--blue2);font-weight:600;margin-bottom:8px;padding:0 2px">✓ Matched to this site</p>';
    else list.innerHTML='<p style="font-size:11px;color:var(--muted);margin-bottom:8px;padding:0 2px">No exact match — showing all passwords</p>';

    items.forEach(e=>{
      const card=document.createElement('div');
      card.className='entry-card';
      card.style.cursor='pointer';
      card.innerHTML=`
        <div class="entry-type-icon">${ICONS[e.type]||'🔑'}</div>
        <div class="entry-info">
          <div class="entry-name">${e.name}</div>
          <div class="entry-sub">${e.user||e.url||''}</div>
        </div>
        <button class="btn btn-primary btn-xs" style="flex-shrink:0;margin:0">Fill ⚡</button>`;
      card.querySelector('.btn').addEventListener('click',()=>doAutofill(e));
      list.appendChild(card);
    });
  }
  show('autofill');
}

// ── ENTRY FORM ────────────────────────────────────────────────────────────────
function openEntry(entry=null){
  editId=entry?.id||null;
  $('entry-title-label').textContent=entry?'Edit Entry':'New Entry';
  $('entry-type').value   =entry?.type  ||'password';
  $('entry-name').value   =entry?.name  ||'';
  $('entry-username').value=entry?.user ||'';
  $('entry-password').value=entry?.pass ||'';
  $('entry-url').value    =entry?.url   ||(!entry&&currentHost?currentHost:'');
  $('entry-category').value=entry?.cat  ||'Other';
  $('entry-tags').value   =(entry?.tags ||[]).join(', ');
  $('entry-note').value   =entry?.note  ||'';
  $('delete-entry-btn').classList.toggle('hidden',!entry);

  updateStrength(entry?.pass||'');

  // History
  const hw=$('history-section'),hl=$('history-list');
  if(entry?.hist?.length){
    hw.classList.remove('hidden');
    hl.innerHTML=entry.hist.map((h,i)=>`
      <div class="history-row">
        <span class="history-pw">${'•'.repeat(Math.min(h.pw.length,12))}</span>
        <span class="history-date">${new Date(h.at).toLocaleDateString()}</span>
        <button class="btn btn-xs btn-outline" data-idx="${i}" style="padding:4px 8px">Restore</button>
      </div>`).join('');
    hl.querySelectorAll('[data-idx]').forEach(btn=>{
      btn.addEventListener('click',async()=>{
        const v=await loadVault();
        const en=v.entries.find(x=>x.id===editId);
        if(en?.hist[btn.dataset.idx]){
          en.pass=en.hist[btn.dataset.idx].pw;
          await saveVault(v);show('vault');await renderVault();
          toast('↩ Password restored');
        }
      });
    });
  }else hw.classList.add('hidden');

  // Populate category datalist
  loadVault().then(v=>{
    $('cat-datalist').innerHTML=v.cats.map(c=>`<option value="${c}">`).join('');
  });

  show('entry');
}

async function saveEntry(){
  const name=$('entry-name').value.trim();
  if(!name){toast('⚠️ Title is required');return;}

  const v=await loadVault(), now=Date.now();
  const newPw=$('entry-password').value;

  if(editId){
    const idx=v.entries.findIndex(e=>e.id===editId);
    if(idx!==-1){
      const old=v.entries[idx];
      if(newPw&&newPw!==old.pass&&old.pass){
        old.hist=[{pw:old.pass,at:old.upd||now},...(old.hist||[])].slice(0,5);
      }
      v.entries[idx]={...old,
        type:$('entry-type').value,name,user:$('entry-username').value.trim(),
        pass:newPw,url:$('entry-url').value.trim(),
        cat:$('entry-category').value.trim()||'Other',
        tags:$('entry-tags').value.split(',').map(t=>t.trim()).filter(Boolean),
        note:$('entry-note').value.trim(),upd:now};
    }
  }else{
    v.entries.push({id:crypto.randomUUID(),type:$('entry-type').value,
      name,user:$('entry-username').value.trim(),pass:newPw,
      url:$('entry-url').value.trim(),cat:$('entry-category').value.trim()||'Other',
      tags:$('entry-tags').value.split(',').map(t=>t.trim()).filter(Boolean),
      note:$('entry-note').value.trim(),fav:false,hist:[],cre:now,upd:now});
  }
 
  await saveVault(v);
  //if(fbReady&&fbUser) cloudPush();
  if (fbUser) saveData();
  show('vault');await renderVault();
  toast(`✅ ${editId?'Updated':'Saved'}: ${name}`);
}
 
async function deleteEntry(){
  if(!confirm('Delete this entry? This cannot be undone.')) return;
  const v=await loadVault();
  v.entries=v.entries.filter(e=>e.id!==editId);
  await saveVault(v);
  //if(fbReady&&fbUser) cloudpush();
  show('vault');await renderVault();
  toast('Entry deleted');
}
// ── GENERATOR ─────────────────────────────────────────────────────────────────
function generate(){
  const out=$('gen-output');
  out.classList.remove('animate');
  void out.offsetWidth;
  out.classList.add('animate');

  let result='';
  if(activeGen==='password'){
    result=genPassword({
      len:Number($('pw-len').value),
      up:$('use-upper').checked,lo:$('use-lower').checked,
      dg:$('use-digits').checked,sy:$('use-symbols').checked,
      noAmb:$('excl-ambig').checked
    });
  }else if(activeGen==='passphrase'){
    result=genPassphrase({
      count:Number($('word-count').value),
      sep:$('separator').value||'-',
      cap:$('capitalize').checked,num:$('append-num').checked
    });
  }else{
    result=genUsername($('username-style').value);
  }
  out.textContent=result;
  return result;
}

// ── FIREBASE AUTH ─────────────────────────────────────────────────────────────
async function doSignIn(){
  const email=$('fb-email').value.trim(),pw=$('fb-pw').value;
  if(!email||!pw){$('signin-error').textContent='Fill in both fields';return;}
  $('signin-btn').innerHTML='<span class="spin">⟳</span>'; $('signin-btn').disabled=true;
  $('signin-error').textContent='';
  try{
    const c=await fbFn.signIn(email,pw); fbUser=c.user; updateOnlinePill();
    const cv=await cloudPull(); if(cv)await saveVault(cv);
    show('vault'); await renderVault(); toast('✅ Signed in — vault synced');
  }catch(e){
    $('signin-error').textContent=
      e.code==='auth/user-not-found'?'Account not found. Create one below.':
      e.code==='auth/wrong-password'?'Wrong password.':
      e.code?.includes('invalid')?'Email or password incorrect.':'Sign in failed: '+e.message;
  }finally{$('signin-btn').textContent='Sign In';$('signin-btn').disabled=false;}
}

async function doSignUp(){
  const email=$('fb-email').value.trim(),pw=$('fb-pw').value;
  if(!email||!pw){$('signin-error').textContent='Fill in both fields';return;}
  if(pw.length<6){$('signin-error').textContent='Password must be 6+ characters';return;}
  $('signup-btn').innerHTML='<span class="spin">⟳</span>'; $('signup-btn').disabled=true;
  try{
    const c=await fbFn.signUp(email,pw); fbUser=c.user; updateOnlinePill();
    show('vault'); await renderVault(); toast('🎉 Account created!');
  }catch(e){
    $('signin-error').textContent=e.code==='auth/email-already-in-use'?'Email taken — sign in instead.':'Sign up failed: '+e.message;
  }finally{$('signup-btn').textContent='Create Account';$('signup-btn').disabled=false;}
}

// ── FORGOT / RESET ────────────────────────────────────────────────────────────
async function wipeVault(){
  const confirmed=confirm('This will permanently delete your LOCAL vault.\n\nYour Firebase cloud vault will NOT be deleted.\n\nAre you sure?');
  if(!confirmed) return;
  await new Promise(r=>chrome.storage.local.remove(VKEY,r));
  localStorage.removeItem('kn_salt');
  sessionStorage.removeItem('kn_ok');
  SK=null;
  show('lock'); toast('🗑️ Local vault wiped. Set a new master password.');
}

// ── BIND ALL EVENTS ───────────────────────────────────────────────────────────
function bindAll(){

  // Lock screen
  $('unlock-btn').addEventListener('click',unlock);
  $('master-pw').addEventListener('keydown',e=>{if(e.key==='Enter')unlock();});
  $('toggle-lock-pw').addEventListener('click',()=>{
    const f=$('master-pw');f.type=f.type==='password'?'text':'password';
  });
  $('fb-login-btn').addEventListener('click',()=>{
    if(!fbReady){toast('⚠️ Fill in firebase-config.js first');return;}
    show('signin');
  });
  $('forgot-link').addEventListener('click',e=>{e.preventDefault();show('forgot');});

  // Vault header
  $('lock-btn').addEventListener('click',()=>{
    SK=null;sessionStorage.removeItem('kn_ok');show('lock');toast('🔒 Vault locked');
  });
  $('add-btn').addEventListener('click',()=>openEntry());
  $('gen-shortcut-btn').addEventListener('click',()=>{
    genTarget='standalone';show('generator');generate();
  });
  $('autofill-quick-btn').addEventListener('click',openAutofillScreen);
  $('sync-btn').addEventListener('click',async()=>{
    if(!fbReady){toast('⚠️ Configure firebase-config.js');return;}
    if(!fbUser){show('signin');return;}
    $('sync-btn').innerHTML='<span class="spin" style="font-size:14px">⟳</span>';
    //const ok=await cloudPush();
    $('sync-btn').innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-6.49"/></svg>';
    toast(ok?'☁️ Vault synced to Firebase':'❌ Sync failed — check connection');
  });

  // Search & filter
  $('search').addEventListener('input',async e=>{searchQ=e.target.value;await renderVault();});
  $('cat-filter').addEventListener('change',async e=>{catQ=e.target.value;await renderVault();});

  // Nav tabs
  document.querySelectorAll('.nav-tab[data-tab]').forEach(tab=>{
    tab.addEventListener('click',async()=>{
      document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active'); activeTab=tab.dataset.tab;
      await renderVault();
    });
  });

  // Entry form
  $('entry-back-btn').addEventListener('click',()=>show('vault'));
  $('save-btn').addEventListener('click',saveEntry);
  $('delete-entry-btn').addEventListener('click',deleteEntry);
  $('toggle-entry-pw').addEventListener('click',()=>{
    const f=$('entry-password');f.type=f.type==='password'?'text':'password';
  });
  $('entry-password').addEventListener('input',e=>updateStrength(e.target.value));
  $('copy-pw-btn').addEventListener('click',()=>{
    const pw=$('entry-password').value;
    if(pw){navigator.clipboard.writeText(pw).catch(()=>{});toast('📋 Password copied');}
  });
  $('gen-from-entry-btn').addEventListener('click',()=>{
    genTarget='entry';show('generator');generate();
  });

  // Generator
  $('gen-back-btn').addEventListener('click',()=>{
    show(genTarget==='entry'?'entry':'vault');
  });
  $('gen-new-btn').addEventListener('click',generate);
  $('gen-copy-btn').addEventListener('click',()=>{
    const out=$('gen-output').textContent;
    if(out&&out!=='Click Generate'){
      navigator.clipboard.writeText(out).catch(()=>{});
      $('gen-copy-btn').textContent='✅ Copied!';
      setTimeout(()=>($('gen-copy-btn').innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy'),1500);
      toast('📋 Copied to clipboard');
    }
  });
  $('gen-use-btn').addEventListener('click',()=>{
    const out=$('gen-output').textContent;
    if(out&&out!=='Click Generate'){
      if(genTarget==='entry'&&$('entry-password')){
        $('entry-password').value=out;
        $('entry-password').dispatchEvent(new Event('input'));
      }
      show(genTarget==='entry'?'entry':'vault');
      toast('⚡ Applied!');
    }
  });

  document.querySelectorAll('.gen-type-tab[data-gen]').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.gen-type-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active'); activeGen=tab.dataset.gen;
      ['password','passphrase','username'].forEach(g=>
        $('opts-'+g).classList.toggle('hidden',g!==activeGen)
      );
      generate();
    });
  });

  $('pw-len').addEventListener('input',e=>{$('pw-len-val').textContent=e.target.value;generate();});
  $('word-count').addEventListener('input',e=>{$('word-count-val').textContent=e.target.value;generate();});
  ['use-upper','use-lower','use-digits','use-symbols','excl-ambig',
   'capitalize','append-num','username-style'].forEach(id=>{
    const el=$(id);if(el)el.addEventListener('change',generate);
  });

  // Autofill
  $('autofill-back-btn').addEventListener('click',()=>show('vault'));

  // Firebase sign in
  // $('signin-btn').addEventListener('click',signIn);
  // $('signup-btn').addEventListener('click',signUp);
  $('signin-back-btn').addEventListener('click',()=>show('vault'));
  $('fb-pw').addEventListener('keydown',e=>{if(e.key==='Enter')signIn();});
  $('toggle-fb-pw').addEventListener('click',()=>{
    const f=$('fb-pw');f.type=f.type==='password'?'text':'password';
  });

  // Forgot password
  $('forgot-back-btn').addEventListener('click',()=>show('lock'));
  $('forgot-cancel-btn').addEventListener('click',()=>show('lock'));
  $('wipe-btn').addEventListener('click',wipeVault);
}

init();
