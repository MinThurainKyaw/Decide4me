import { auth } from "./firebase-config.js";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const googleLoginBtn =
  document.getElementById("googleLoginBtn");

const loginForm =
  document.getElementById("loginForm");

const emailInput =
  document.getElementById("loginEmail");

const passwordInput =
  document.getElementById("loginPassword");

const createAccountBtn =
  document.getElementById("createAccountBtn");

const forgotPasswordBtn =
  document.getElementById("forgotPasswordBtn");

const authMessage =
  document.getElementById("authMessage");

const signedInBox =
  document.getElementById("signedInBox");

const signedInText =
  document.getElementById("signedInText");

const loginControls =
  document.getElementById("loginControls");


setPersistence(auth, browserLocalPersistence)
  .catch(error => {
    console.error("Persistence error:", error);
  });


function showMessage(message, isError = false) {

  authMessage.textContent = message;

  authMessage.classList.remove("hidden", "error");

  if (isError) {
    authMessage.classList.add("error");
  }
}


function friendlyError(error) {

  console.error(error);

  const messages = {

    "auth/invalid-credential":
      "Incorrect email or password.",

    "auth/email-already-in-use":
      "An account already exists with this email.",

    "auth/weak-password":
      "Please choose a stronger password.",

    "auth/invalid-email":
      "Please enter a valid email address.",

    "auth/popup-closed-by-user":
      "Google sign-in was cancelled.",

    "auth/popup-blocked":
      "Your browser blocked the Google login popup.",

    "auth/unauthorized-domain":
      "This website is not yet authorized in Firebase.",

    "auth/network-request-failed":
      "Internet connection is required to sign in.",

    "auth/too-many-requests":
      "Too many attempts. Please wait and try again."

  };

  return messages[error.code] ||
    "Authentication failed. Please try again.";
}


// GOOGLE LOGIN
googleLoginBtn.addEventListener("click", async () => {

  try {

    showMessage("Opening Google sign-in...");

    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);

    window.location.href = "./dashboard.html";

  }

  catch (error) {

    showMessage(
      friendlyError(error),
      true
    );

  }

});


// EMAIL LOGIN
loginForm.addEventListener("submit", async event => {

  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {

    showMessage("Signing in...");

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    window.location.href = "./dashboard.html";

  }

  catch (error) {

    showMessage(
      friendlyError(error),
      true
    );

  }

});


// CREATE ACCOUNT
createAccountBtn.addEventListener("click", async () => {

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {

    showMessage(
      "Enter an email and password first.",
      true
    );

    return;
  }

  try {

    showMessage("Creating your account...");

    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    window.location.href = "./dashboard.html";

  }

  catch (error) {

    showMessage(
      friendlyError(error),
      true
    );

  }

});


// PASSWORD RESET
forgotPasswordBtn.addEventListener("click", async () => {

  const email = emailInput.value.trim();

  if (!email) {

    showMessage(
      "Enter your email address first.",
      true
    );

    return;
  }

  try {

    await sendPasswordResetEmail(
      auth,
      email
    );

    showMessage(
      "Password reset email sent. Check your inbox."
    );

  }

  catch (error) {

    showMessage(
      friendlyError(error),
      true
    );

  }

});


// SHOW USER STATUS
onAuthStateChanged(auth, user => {

  if (user) {

    loginControls.classList.add("hidden");

    signedInBox.classList.remove("hidden");

    signedInText.textContent =
      `Signed in as ${user.displayName || user.email}`;

  }

  else {

    loginControls.classList.remove("hidden");

    signedInBox.classList.add("hidden");

  }

});