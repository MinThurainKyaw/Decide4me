import { auth } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const welcomeTitle =
  document.getElementById("welcomeTitle");

const profilePhoto =
  document.getElementById("profilePhoto");

const profileName =
  document.getElementById("profileName");

const profileEmail =
  document.getElementById("profileEmail");

const profileProvider =
  document.getElementById("profileProvider");

const historyCount =
  document.getElementById("historyCount");

const dashboardHistory =
  document.getElementById("dashboardHistory");

const logoutBtn =
  document.getElementById("logoutBtn");

const clearHistoryBtn =
  document.getElementById("clearHistoryBtn");


function getHistory() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "decide4me_history_v2"
        ) || "[]"
      );

    return Array.isArray(saved)
      ? saved
      : [];

  }

  catch {

    return [];

  }

}


function renderHistory() {

  const history = getHistory();

  historyCount.textContent =
    history.length;

  dashboardHistory.innerHTML = "";


  if (!history.length) {

    const empty =
      document.createElement("p");

    empty.className =
      "dashboard-empty";

    empty.textContent =
      "No recent meal history yet.";

    dashboardHistory.appendChild(empty);

    return;

  }


  const recent =
    history.slice(-6).reverse();


  recent.forEach(item => {

    const row =
      document.createElement("div");

    row.className =
      "dashboard-history-item";


    const name =
      document.createElement("strong");

    name.textContent =
      typeof item === "string"
        ? item
        : item.name || "Food";


    const type =
      document.createElement("span");

    type.textContent =
      typeof item === "string"
        ? "Meal"
        : item.mealType || "Meal";


    row.append(
      name,
      type
    );

    dashboardHistory.appendChild(row);

  });

}


onAuthStateChanged(auth, user => {

  if (!user) {

    window.location.href =
      "./index.html#loginSection";

    return;

  }


  const displayName =
    user.displayName ||
    user.email?.split("@")[0] ||
    "Member";


  welcomeTitle.textContent =
    `Welcome, ${displayName} 👋`;


  profileName.textContent =
    displayName;


  profileEmail.textContent =
    user.email || "";


  profilePhoto.src =
    user.photoURL ||
    "./icons/icon-192.png";


  const providerId =
    user.providerData?.[0]?.providerId;


  profileProvider.textContent =
    providerId === "google.com"
      ? "Signed in with Google"
      : "Signed in with Email & Password";


  renderHistory();

});


logoutBtn.addEventListener(
  "click",
  async () => {

    try {

      await signOut(auth);

      window.location.href =
        "./index.html#loginSection";

    }

    catch (error) {

      console.error(
        "Logout failed:",
        error
      );

    }

  }
);


clearHistoryBtn.addEventListener(
  "click",
  () => {

    const confirmed =
      confirm(
        "Clear your recent food history?"
      );

    if (!confirmed) return;


    localStorage.removeItem(
      "decide4me_history_v2"
    );


    renderHistory();

  }
);