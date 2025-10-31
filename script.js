import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// 🔹 Config Firebase (metti il tuo progetto!)
const firebaseConfig = {
  apiKey: "AIzaSyClaVE8lvlMeixx9V9_C2IAiDAuHbKkBHU",
  authDomain: "compleannooo.firebaseapp.com",
  databaseURL: "https://compleannooo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "compleannooo",
  storageBucket: "compleannooo.firebasestorage.app",
  messagingSenderId: "1067822649113",
  appId: "1:1067822649113:web:966ace24c57e2f8a17bf88"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {

  const select = document.getElementById("name-select");
  const confirmBtn = document.getElementById("confirm-btn");
  const confirmedList = document.getElementById("confirmed-list");
  const confirmedCount = document.getElementById("confirmed-count");
  const confermeRef = ref(db, "conferme");

  // Lista confermati in tempo reale
  onValue(confermeRef, snapshot => {
    const data = snapshot.val() || {};
    confirmedList.innerHTML = "";
    const confermati = Object.values(data);
    confirmedCount.textContent = `${confermati.length} persona${confermati.length !== 1 ? "e" : ""}`;
    if(confermati.length === 0) {
      confirmedList.innerHTML = "<li>Nessuna conferma ancora</li>";
    } else {
      confermati.forEach(c => {
        const li = document.createElement("li");
        li.textContent = c.name;
        confirmedList.appendChild(li);
      });
    }
  });

  // Conferma presenza
  confirmBtn.addEventListener("click", () => {
    const name = select.value;
    if(!name) return alert("Seleziona un nome!");
    set(ref(db, "conferme/"+name), {name, time: new Date().toISOString()})
      .then(()=> alert("Conferma inviata! 🎉"))
      .catch(err=> alert("Errore: "+err));
  });

  // Admin
  const adminUser = document.getElementById("admin-user");
  const adminPass = document.getElementById("admin-pass");
  const adminLogin = document.getElementById("admin-login");
  const adminLogout = document.getElementById("admin-logout");
  const adminPanel = document.getElementById("admin-panel");
  const adminList = document.getElementById("admin-list");
  const adminReset = document.getElementById("admin-reset");

  const ADMIN = {user:"lorenzo", pass:"birthday"};

  adminLogin.addEventListener("click", ()=>{
    if(adminUser.value===ADMIN.user && adminPass.value===ADMIN.pass){
      adminPanel.style.display="block";
      adminLogout.style.display="inline-block";
      adminLogin.style.display="none";
      adminUser.style.display="none";
      adminPass.style.display="none";

      // Aggiorna lista admin in realtime
      onValue(confermeRef, snapshot=>{
        const data = snapshot.val() || {};
        adminList.innerHTML="";
        const arr = Object.values(data);
        if(arr.length===0){
          const li = document.createElement("li");
          li.textContent="Nessuna conferma ancora";
          adminList.appendChild(li);
        } else {
          arr.forEach((c,i)=>{
            const li = document.createElement("li");
            li.textContent=`${i+1}. ${c.name} — ${new Date(c.time).toLocaleString()}`;
            adminList.appendChild(li);
          });
        }
      });
    } else alert("Credenziali errate");
  });

  adminLogout.addEventListener("click", ()=>{
    adminPanel.style.display="none";
    adminLogout.style.display="none";
    adminLogin.style.display="inline-block";
    adminUser.style.display="inline-block";
    adminPass.style.display="inline-block";
  });

  adminReset.addEventListener("click", ()=>{
    if(confirm("Vuoi davvero cancellare tutte le conferme?")) remove(confermeRef);
  });

});
