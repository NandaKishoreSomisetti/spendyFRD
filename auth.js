/**
 * spendyFRD — Authentication & Landing Controller (auth.js)
 * Clean, instant client-side auth & session management (No Animation Delay)
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // DOM Elements
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const nameGroup = document.getElementById("nameGroup");
  const studentNameInput = document.getElementById("studentName");
  const formTitle = document.getElementById("formTitle");
  const formSubtitle = document.getElementById("formSubtitle");
  const submitBtn = document.getElementById("submitBtn");
  const authForm = document.getElementById("authForm");
  const authMessage = document.getElementById("authMessage");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");
  const eyeText = document.getElementById("eyeText");
  const guestBtn = document.getElementById("guestBtn");
  const aboutBtn = document.getElementById("aboutBtn");
  const aboutModal = document.getElementById("aboutModal");
  const closeAboutBtn = document.getElementById("closeAboutBtn");

  let isSignupMode = false;

  // Check if an active session already exists
  try {
    const existingUser = JSON.parse(localStorage.getItem("spendyfrd_current_user"));
    if (existingUser && existingUser.email) {
      showMessage(`Signed in as ${existingUser.name}. Click below or switch account.`, "success");
      const btnSpan = submitBtn.querySelector("span");
      if (btnSpan) btnSpan.textContent = `Continue as ${existingUser.name} →`;
    }
  } catch (err) {
    console.warn("Session check error:", err);
  }

  // Inline feedback messenger
  function showMessage(text, type = "error") {
    if (!authMessage) return;
    authMessage.textContent = text;
    authMessage.className = `auth-message ${type}`;
  }

  // About Us Modal Controls
  if (aboutBtn && aboutModal) {
    aboutBtn.addEventListener("click", () => {
      aboutModal.classList.add("active");
      aboutModal.setAttribute("aria-hidden", "false");
    });
  }

  if (closeAboutBtn && aboutModal) {
    closeAboutBtn.addEventListener("click", () => {
      aboutModal.classList.remove("active");
      aboutModal.setAttribute("aria-hidden", "true");
    });
  }

  if (aboutModal) {
    aboutModal.addEventListener("click", (e) => {
      if (e.target === aboutModal) {
        aboutModal.classList.remove("active");
        aboutModal.setAttribute("aria-hidden", "true");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && aboutModal.classList.contains("active")) {
        aboutModal.classList.remove("active");
        aboutModal.setAttribute("aria-hidden", "true");
      }
    });
  }

  // Tab Switching: Sign In Mode (Instant)
  if (loginTab) {
    loginTab.addEventListener("click", () => {
      if (!isSignupMode) return;
      isSignupMode = false;
      loginTab.classList.add("active");
      loginTab.setAttribute("aria-selected", "true");
      signupTab.classList.remove("active");
      signupTab.setAttribute("aria-selected", "false");

      nameGroup.classList.add("hidden");
      if (studentNameInput) studentNameInput.required = false;

      formTitle.textContent = window.i18n ? window.i18n.get("welcomeBackTitle") : "Welcome back, Friend 👋";
      formSubtitle.textContent = window.i18n ? window.i18n.get("welcomeBackSub") : "Log in to check your profit, losses, and spending categories.";
      submitBtn.querySelector("span").textContent = window.i18n ? window.i18n.get("btnSignIn") : "Sign In to spendyFRD";
      showMessage("", "");
    });
  }

  // Tab Switching: Create Account Mode (Instant)
  if (signupTab) {
    signupTab.addEventListener("click", () => {
      if (isSignupMode) return;
      isSignupMode = true;
      signupTab.classList.add("active");
      signupTab.setAttribute("aria-selected", "true");
      loginTab.classList.remove("active");
      loginTab.setAttribute("aria-selected", "false");

      nameGroup.classList.remove("hidden");
      if (studentNameInput) studentNameInput.required = true;

      formTitle.textContent = window.i18n ? window.i18n.get("createAccountTitle") : "Create your spendyFRD account";
      formSubtitle.textContent = window.i18n ? window.i18n.get("createAccountSub") : "Track your monthly allowance, mess bills, and savings.";
      submitBtn.querySelector("span").textContent = window.i18n ? window.i18n.get("btnCreateAccount") : "Create Free Account";
      showMessage("", "");
    });
  }

  // Listen to Language Change
  window.addEventListener("spendyfrd:langchange", () => {
    if (isSignupMode) {
      formTitle.textContent = window.i18n.get("createAccountTitle");
      formSubtitle.textContent = window.i18n.get("createAccountSub");
      submitBtn.querySelector("span").textContent = window.i18n.get("btnCreateAccount");
    } else {
      formTitle.textContent = window.i18n.get("welcomeBackTitle");
      formSubtitle.textContent = window.i18n.get("welcomeBackSub");
      submitBtn.querySelector("span").textContent = window.i18n.get("btnSignIn");
    }
    if (eyeText && passwordInput) {
      const isHidden = passwordInput.type === "password";
      eyeText.textContent = isHidden ? window.i18n.get("btnShow") : window.i18n.get("btnHide");
    }
  });

  // Password Visibility Toggle
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";

      const showTxt = window.i18n ? window.i18n.get("btnShow") : "Show";
      const hideTxt = window.i18n ? window.i18n.get("btnHide") : "Hide";
      if (eyeText) eyeText.textContent = isHidden ? hideTxt : showTxt;
      if (eyeIcon) {
        eyeIcon.setAttribute("data-lucide", isHidden ? "eye-off" : "eye");
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  // Form Submission (Instant, No Delay or Curtain Animation)
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("email");
      const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
      const password = passwordInput ? passwordInput.value : "";

      if (!email || !password) {
        showMessage("Please fill in all required credentials.", "error");
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
      }

      let users = {};
      try {
        users = JSON.parse(localStorage.getItem("spendyfrd_users") || "{}");
      } catch (err) {
        users = {};
      }

      if (isSignupMode) {
        const name = studentNameInput ? studentNameInput.value.trim() : "";
        if (!name) {
          showMessage("Please provide your full name.", "error");
          return;
        }

        if (password.length < 4) {
          showMessage("Password should be at least 4 characters long.", "error");
          return;
        }

        if (users[email]) {
          showMessage("An account with this email already exists. Please Sign In.", "error");
          return;
        }

        users[email] = { name, email, password };
        localStorage.setItem("spendyfrd_users", JSON.stringify(users));
        localStorage.setItem("spendyfrd_current_user", JSON.stringify({ name, email }));

        // Direct instant navigation to dashboard
        window.location.href = "dashboard.html";
      } else {
        const user = users[email];
        if (!user || user.password !== password) {
          showMessage("Invalid email or password. Check credentials or Create Account.", "error");
          return;
        }

        localStorage.setItem("spendyfrd_current_user", JSON.stringify({ name: user.name, email: user.email }));

        // Direct instant navigation to dashboard
        window.location.href = "dashboard.html";
      }
    });
  }

  // Instant Guest Mode (Direct navigation)
  if (guestBtn) {
    guestBtn.addEventListener("click", () => {
      localStorage.setItem(
        "spendyfrd_current_user",
        JSON.stringify({
          name: "Guest Student",
          email: "guest@spendyfrd.app"
        })
      );
      window.location.href = "dashboard.html";
    });
  }
});
