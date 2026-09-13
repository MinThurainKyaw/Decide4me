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
/* ==================================
   PROFILE PICTURE UPLOAD
================================== */

const profileDropZone =
  document.getElementById("profileDropZone");

const profilePictureInput =
  document.getElementById("profilePictureInput");

const choosePictureBtn =
  document.getElementById("choosePictureBtn");

const savePictureBtn =
  document.getElementById("savePictureBtn");

const removePictureBtn =
  document.getElementById("removePictureBtn");

const uploadPreview =
  document.getElementById("uploadPreview");

const uploadPlaceholder =
  document.getElementById("uploadPlaceholder");

const pictureMessage =
  document.getElementById("pictureMessage");


let selectedProfilePicture = null;


/* Click upload area */

profileDropZone.addEventListener("click", () => {
  profilePictureInput.click();
});


choosePictureBtn.addEventListener("click", event => {

  event.stopPropagation();

  profilePictureInput.click();

});


/* File selected */

profilePictureInput.addEventListener("change", event => {

  const file = event.target.files[0];

  if (file) {
    processProfilePicture(file);
  }

});


/* Drag over */

profileDropZone.addEventListener("dragover", event => {

  event.preventDefault();

  profileDropZone.classList.add("dragging");

});


profileDropZone.addEventListener("dragleave", () => {

  profileDropZone.classList.remove("dragging");

});


/* File dropped */

profileDropZone.addEventListener("drop", event => {

  event.preventDefault();

  profileDropZone.classList.remove("dragging");

  const file =
    event.dataTransfer.files[0];

  if (file) {
    processProfilePicture(file);
  }

});


function processProfilePicture(file) {

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];


  if (!allowedTypes.includes(file.type)) {

    pictureMessage.textContent =
      "Please choose a JPG, PNG or WebP image.";

    return;
  }


  /*
    Limit to 2 MB because the image will
    be stored in browser local storage.
  */

  if (file.size > 2 * 1024 * 1024) {

    pictureMessage.textContent =
      "The picture is too large. Please use an image smaller than 2 MB.";

    return;
  }


  const reader = new FileReader();


  reader.onload = event => {

    selectedProfilePicture =
      event.target.result;


    uploadPreview.src =
      selectedProfilePicture;


    uploadPreview.classList.remove(
      "hidden"
    );


    uploadPlaceholder.classList.add(
      "hidden"
    );


    savePictureBtn.disabled = false;


    pictureMessage.textContent =
      "Picture ready. Click Save Picture.";

  };


  reader.readAsDataURL(file);

}


/* Save picture */

savePictureBtn.addEventListener("click", () => {

  if (!selectedProfilePicture) {
    return;
  }


  const user = auth.currentUser;


  if (!user) {

    pictureMessage.textContent =
      "You must be logged in.";

    return;
  }


  const storageKey =
    `decide4me_profile_picture_${user.uid}`;


  try {

    localStorage.setItem(
      storageKey,
      selectedProfilePicture
    );


    /*
      Change the existing profile picture
      on the dashboard immediately.
    */

    profilePhoto.src =
      selectedProfilePicture;


    pictureMessage.textContent =
      "Profile picture saved successfully ✓";


    savePictureBtn.disabled = true;

  }

  catch (error) {

    console.error(error);

    pictureMessage.textContent =
      "The picture could not be saved. Try a smaller image.";

  }

});


/* Remove picture */

removePictureBtn.addEventListener("click", () => {

  const user = auth.currentUser;

  if (!user) return;


  const storageKey =
    `decide4me_profile_picture_${user.uid}`;


  localStorage.removeItem(storageKey);


  selectedProfilePicture = null;


  uploadPreview.src = "";

  uploadPreview.classList.add("hidden");

  uploadPlaceholder.classList.remove(
    "hidden"
  );


  /*
    Return to Google picture if available,
    otherwise use Decide4me icon.
  */

  const savedProfilePicture =
  localStorage.getItem(
    `decide4me_profile_picture_${user.uid}`
  );


profilePhoto.src =
  savedProfilePicture ||
  user.photoURL ||
  "./icons/icon-192.png";


if (savedProfilePicture) {

  uploadPreview.src =
    savedProfilePicture;

  uploadPreview.classList.remove("hidden");

  uploadPlaceholder.classList.add("hidden");

}


  savePictureBtn.disabled = true;


  pictureMessage.textContent =
    "Custom profile picture removed.";

});