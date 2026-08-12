let chain=[],successCount=0,blockedCount=0,failed=0,mismatch=0;
const SALT="PUF_Hardware_Secret_Key_",GENESIS="GENESIS";
const $=id=>document.getElementById(id);

async function sha256(text){
 const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));
 return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,"0")).join("");
}
async function puf(id,challenge){return sha256(id+"::"+challenge+"::"+SALT);}
function log(t){$("logs").innerHTML=`<p>[${new Date().toLocaleTimeString()}] ${t}</p>`+$("logs").innerHTML;}
function registered(id){return chain.some(b=>b.type==="REGISTRATION"&&b.device===id);}
function stats(){
 $("total").textContent=chain.filter(b=>b.type==="REGISTRATION").length;
 $("success").textContent=successCount;$("blocked").textContent=blockedCount;
 let score=Math.min(100,failed*15+mismatch*20);$("risk").textContent=score;
 $("fails").textContent=failed;$("mismatches").textContent=mismatch;$("bar").style.width=score+"%";
 let l=$("riskLabel"),d=$("riskDesc");l.className=score>=60?"high":score>=30?"medium":"low";
 l.textContent=score>=60?"HIGH":score>=30?"MEDIUM":"LOW";
 d.textContent=score>=60?"Multiple suspicious events detected.":score>=30?"Some suspicious activity detected.":"No significant suspicious activity detected.";
}
async function makeBlock(data){
 let prev=chain.length?chain[chain.length-1].hash:GENESIS;
 let base={index:chain.length+1,previousHash:prev,...data};
 let hash=await sha256(JSON.stringify(base));
 return {...base,hash,timestamp:new Date().toLocaleString()};
}
function render(){
 $("ledger").innerHTML=chain.length?chain.map(b=>`<div class="block"><b>Block #${b.index}</b> <span>${b.result}</span><p>Device: ${b.device} · Challenge: ${b.challenge}</p><code>Previous: ${b.previousHash}</code><code>Hash: ${b.hash}</code></div>`).join(""):"No blocks recorded yet.";
}
async function registerDevice(){
 let id=$("regId").value.trim();if(!id){$("regMsg").textContent="Enter a Device ID.";return;}
 if(registered(id)){$("regMsg").textContent="Device already registered.";return;}
 let fp=await puf(id,"REGISTRATION");
 chain.push(await makeBlock({type:"REGISTRATION",device:id,challenge:"REGISTRATION",response:fp,result:"REGISTERED"}));
 $("regMsg").textContent="Device registered successfully.";$("regId").value="";
 log(`Device "${id}" registered with a simulated PUF fingerprint.`);render();stats();
}
async function generateResponse(){
 let id=$("authId").value.trim(),c=$("challenge").value.trim();
 if(!id||!c){$("authMsg").textContent="Enter a Device ID and challenge.";return;}
 if(!registered(id)){$("authMsg").textContent="Device is not registered.";return;}
 $("response").value=await puf(id,c);$("authMsg").textContent="PUF-like response generated.";
}
async function authenticate(){
 let id=$("authId").value.trim(),c=$("challenge").value.trim(),given=$("response").value.trim().toLowerCase();
 if(!id||!c){$("authMsg").textContent="Enter a Device ID and challenge.";return;}
 if(!registered(id)){failed++;mismatch++;blockedCount++;$("authMsg").textContent="ACCESS DENIED — device is not registered.";log(`Unknown device "${id}" blocked.`);stats();return;}
 let expected=await puf(id,c);
 if(given!==expected){failed++;mismatch++;blockedCount++;$("authMsg").textContent="ACCESS DENIED — PUF response mismatch.";log(`Authentication blocked for "${id}": response mismatch.`);stats();return;}
 successCount++;$("authMsg").textContent="AUTHORIZED — authentication successful.";
 chain.push(await makeBlock({type:"AUTHENTICATION",device:id,challenge:c,response:given,result:"AUTHORIZED"}));
 log(`Authentication successful for "${id}". Audit block created.`);render();stats();
}
async function attack(){
 let fake="Spoofed_Device_"+Math.floor(Math.random()*9999);$("authId").value=fake;$("response").value="";
 $("attackMsg").textContent="Testing "+fake;log(`Spoofing simulation started with "${fake}".`);await authenticate();
}
async function verifyChain(){
 let prev=GENESIS;
 for(const b of chain){
  let base={index:b.index,previousHash:b.previousHash,type:b.type,device:b.device,challenge:b.challenge,response:b.response,result:b.result};
  if(b.previousHash!==prev||b.hash!==await sha256(JSON.stringify(base))){alert("Chain verification failed.");log("CHAIN VERIFICATION FAILED.");return;}
  prev=b.hash;
 }
 alert("Chain verified successfully.");log("Blockchain-style audit chain verified successfully.");
}
log("Decentralized Authentication System initialized successfully.");render();stats();