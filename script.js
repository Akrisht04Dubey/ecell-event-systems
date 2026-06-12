const defaults = {
  eventTitle: "Startup Weekend 2026",
  eventTagline:
    "Build bold ideas, meet future co-founders, and pitch your startup in one high-energy weekend.",
  eventDate: "April 10-12, 2026",
  eventVenue: "Innovation Hub Auditorium",
  eventTheme: "Green Tech and Campus Ideas",
  eventDays: "3",
  primaryColor: "#0f7a3b",
  accentColor: "#f4c430",
  heroImage:
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1800&q=85",
};

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav-links]");
const registrationForm = document.getElementById("registration-form");
const formStatus = document.getElementById("form-status");
const editorForm = document.querySelector("[data-editor-form]");
const editorStatus = document.querySelector("[data-editor-status]");
const saveButton = document.querySelector("[data-save-edits]");
const resetButton = document.querySelector("[data-reset-edits]");

const savedSettings = JSON.parse(localStorage.getItem("startupWeekendSettings") || "{}");
const settings = { ...defaults, ...savedSettings };

function setThemeColor(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function updateLiveContent(nextSettings) {
  document.querySelectorAll("[data-live-key]").forEach((element) => {
    const key = element.dataset.liveKey;
    if (nextSettings[key]) {
      element.textContent = nextSettings[key];
    }
  });

  setThemeColor("--primary", nextSettings.primaryColor);
  setThemeColor("--primary-dark", shadeColor(nextSettings.primaryColor, -28));
  setThemeColor("--accent", nextSettings.accentColor);
  document.documentElement.style.setProperty(
    "--hero-image",
    `url("${nextSettings.heroImage}")`
  );
}

function hydrateEditor(nextSettings) {
  Object.entries(nextSettings).forEach(([key, value]) => {
    const field = editorForm.elements[key];
    if (field) {
      field.value = value;
    }
  });
}

function collectEditorSettings() {
  return {
    ...settings,
    eventTitle: editorForm.elements.eventTitle.value.trim() || defaults.eventTitle,
    eventTagline: editorForm.elements.eventTagline.value.trim() || defaults.eventTagline,
    eventDate: editorForm.elements.eventDate.value.trim() || defaults.eventDate,
    eventVenue: editorForm.elements.eventVenue.value.trim() || defaults.eventVenue,
    eventTheme: editorForm.elements.eventTheme.value.trim() || defaults.eventTheme,
    primaryColor: editorForm.elements.primaryColor.value || defaults.primaryColor,
    accentColor: editorForm.elements.accentColor.value || defaults.accentColor,
    heroImage: editorForm.elements.heroImage.value.trim() || defaults.heroImage,
  };
}

function saveSettings(nextSettings) {
  Object.assign(settings, nextSettings);
  localStorage.setItem("startupWeekendSettings", JSON.stringify(settings));
}

function shadeColor(hexColor, percent) {
  const cleanHex = hexColor.replace("#", "");
  const number = parseInt(cleanHex, 16);
  const amount = Math.round(2.55 * percent);
  const red = Math.max(0, Math.min(255, (number >> 16) + amount));
  const green = Math.max(0, Math.min(255, ((number >> 8) & 0x00ff) + amount));
  const blue = Math.max(0, Math.min(255, (number & 0x0000ff) + amount));

  return `#${(0x1000000 + red * 0x10000 + green * 0x100 + blue)
    .toString(16)
    .slice(1)}`;
}

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

registrationForm.addEventListener("submit", async (event) => {
    // 1. Instantly stop the browser from refreshing
    event.preventDefault(); 

    // 2. Package the form values cleanly
    const formData = new FormData(registrationForm);
    const name = formData.get("name") ? formData.get("name").trim() : "";
    const email = formData.get("email") ? formData.get("email").trim() : "";
    const department = formData.get("department") ? formData.get("department").trim() : "General";

    // 3. Simple email syntax validation
    if (!email.includes("@") || !email.includes(".")) {
        formStatus.textContent = "Please enter a valid institute email.";
        formStatus.style.color = "red";
        return; 
    }

    // 4. Update status loader feedback for Day 1
    formStatus.textContent = "Processing your registration... Please wait.";
    formStatus.style.color = "#dfa638"; 

    console.log("Form data captured cleanly:", { name, email, department });
    
    // ====== 🌟 DAY 2: THE GOOGLE SHEETS NETWORK BRIDGE ======
    
    // Paste your unique Google deployment link right here inside the quotes:
    const googleWebAppUrl = "https://script.google.com/macros/s/AKfycbxdNoXHJMTZW2k8bihcTnRnoWscfyodmU33oOSNOJ3RSmG5Hrnw481M9PEAgILzP8bRIA/exec";

    // Bundle the data parameters into a structured JSON string package
    const payload = {
        name: name,
        email: email,
        department: department,
        year: "Second year" // Default placeholder matching your form options
    };

    // Dispatch the payload over the web network asynchronously
    fetch(googleWebAppUrl, {
        method: "POST",
        mode: "no-cors", // Bypasses browser cross-origin policy roadblocks safely
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        // Once completed successfully:
        formStatus.textContent = "Thank you for registering! Check your inbox for confirmation.";
        formStatus.style.color = "green";
        registrationForm.reset(); // Beautifully blanks out input inputs for the next student
    })
    .catch((error) => {
        console.error("Network dispatch error encountered:", error);
        formStatus.textContent = "Registration transmission issue. Please try again.";
        formStatus.style.color = "red";
    });
});



   