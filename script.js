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
const registrationForm = document.getElementById("registration-form") || document.querySelector(".registration-form") || document.querySelector("form");
const formStatus = document.getElementById("form-status") || document.querySelector(".form-status") || document.querySelector("[data-form-status]");
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
  event.preventDefault(); // Keeps the page from resetting/reloading

  // 1. Package the form values cleanly
  const formData = new FormData(registrationForm);
  const name = formData.get("name") ? formData.get("name").trim() : "";
  const email = formData.get("email") ? formData.get("email").trim() : "";
  
  // This line was missing! It safely reads your HTML department text input box
  const department = formData.get("department") ? formData.get("department").trim() : "General";

  // 2. Validate email syntax before sending
  if (!email.includes("@") || !email.includes(".")) {
    formStatus.textContent = "Please enter a valid institute email.";
    formStatus.style.color = "red";
    return;
  }

  formStatus.textContent = "Processing registration...";
  formStatus.style.color = "orange";

  try {
    // 3. Dispatch data across the network to your Cloudflare D1 Backend pipeline
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, department })
    });

    const result = await response.json();

    if (result.success) {
      // 4. Safely display success state without refreshing
      formStatus.textContent = `Thank you, ${name}. Your registration has been securely saved!`;
      formStatus.style.color = "green";
      registrationForm.reset();
    } else {
      throw new Error(result.error || "Server rejected save");
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    formStatus.textContent = "Connection issue. Data could not be saved.";
    formStatus.style.color = "red";
  }
});
      registrationForm.reset();
    } else {
      throw new Error(result.error || "Server rejected save operation");
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    formStatus.textContent = "Connection issue. Data could not be saved.";
    formStatus.style.color = "red";
  }
});
  formStatus.style.color = "orange";

  try {
    // This is the missing network bridge sending your payload data to functions/submit.js
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, department })
    });

    const result = await response.json();

    if (result.success) {
      formStatus.textContent = `Thank you, ${name}. Your registration has been securely saved!`;
      formStatus.style.color = "green";
      registrationForm.reset();
    } else {
      throw new Error(result.error || "Server rejected save operation");
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    formStatus.textContent = "Connection issue. Data could not be saved.";
    formStatus.style.color = "red";
  }
});

saveButton.addEventListener("click", () => {
  const nextSettings = collectEditorSettings();
  updateLiveContent(nextSettings);
  saveSettings(nextSettings);
  editorStatus.textContent = "Saved in this browser.";
});

resetButton.addEventListener("click", () => {
  localStorage.removeItem("startupWeekendSettings");
  Object.assign(settings, defaults);
  hydrateEditor(defaults);
  updateLiveContent(defaults);
  editorStatus.textContent = "Default content restored.";
});

hydrateEditor(settings);
updateLiveContent(settings);
