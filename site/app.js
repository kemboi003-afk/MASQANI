const API_URL = window.MASQANI_API_URL || "http://localhost:4000";
let properties = [
  { id: "00000000-0000-4000-8000-000000000001", title: "Spacious single room", location: "Near Murang'a University, Murang'a", price: 3000, type: "Single Room", beds: 1, baths: 1, image: "https://images.locanto.info/6618720148/Smart-spacious-single-room-to-let-at-muranga-near-muranga-univ_1.jpg" },
  { id: "00000000-0000-4000-8000-000000000002", title: "Spacious bedsitter", location: "Kahawa Sukari, Nairobi", price: 6000, type: "Bedsitter", beds: 1, baths: 1, image: "https://images.locanto.info/5342663400/Kahawa-sukari-spacious-bedsitter-ready-for-occupation_1.jpg" },
  { id: "00000000-0000-4000-8000-000000000003", title: "Bedsitter with fitted kitchenette", location: "Githurai, Nairobi", price: 6500, type: "Bedsitter", beds: 1, baths: 1, image: "https://images.locanto.info/5251819067/Githurai-spacious-bedsitter-ready-for-occupation_1.jpg" },
  { id: "00000000-0000-4000-8000-000000000004", title: "1 bedroom bedsitter", location: "Uthiru, Dagoretti, Nairobi", price: 10000, type: "1 Bedroom", beds: 1, baths: 1, image: "https://assets.jumuika.co.ke/properties/1d632590-41ff-d569-7c92-493a562b44ee/photos/1c784d74-a8fa-40d0-914e-719e8dba3f27.jpg?auto_optimize=medium&quality=85&width=1200" },
  { id: "00000000-0000-4000-8000-000000000005", title: "Bedsitter near Fig Tree", location: "Ngara, Nairobi", price: 6000, type: "Bedsitter", beds: 1, baths: 1, image: "https://images.locanto.co.ke/5890311050/bedsitter-to-let-in-ngara-fig-tree_1.jpg" },
  { id: "00000000-0000-4000-8000-000000000006", title: "Spacious bedsitter", location: "Langata, Nairobi", price: 6000, type: "Bedsitter", beds: 1, baths: 1, image: "https://images.locanto.info/5251414934/Langata-Spacious-bedsitter-ready-for-occupation_1.jpg" },
  { id: "00000000-0000-4000-8000-000000000007", title: "Bedsitter with modern fittings", location: "Lower Kabete, Nairobi", price: 11000, type: "Bedsitter", beds: 1, baths: 1, image: "https://propscout.co.ke/storage/properties/files/bedsitters/webp/lower-kabete-bedsitters-for-rent-3hwag.webp" },
  { id: "00000000-0000-4000-8000-000000000008", title: "Spacious bedsitter", location: "Pioneer, Eldoret", price: 5000, type: "Bedsitter", beds: 1, baths: 1, image: "https://images.locanto.info/5266493946/Pioneer-spacious-bedsitter-ready-for-occupation_1.jpg" },
  { id: "00000000-0000-4000-8000-000000000009", title: "3 bedroom bungalow", location: "Community Road, Syokimau", price: 65000, type: "House", beds: 3, baths: 3, image: "https://propscout.co.ke/storage/properties/files/3-bedroom-bungalow-for-rent-in-syokimau-community-road-e7xb8.jpg" }
];

const grid = document.querySelector("#property-grid");
const count = document.querySelector("#result-count");
const toast = document.querySelector("#toast");
const authDialog = document.querySelector("#auth-dialog");
const viewingDialog = document.querySelector("#viewing-dialog");
let selectedProperty;
let authMode = "login";
let session = JSON.parse(sessionStorage.getItem("masqani-session") || "null");
let savedIds = new Set(JSON.parse(localStorage.getItem("masqani-saved") || "[]"));
let localViewings = JSON.parse(localStorage.getItem("masqani-viewings") || "[]");

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(notify.timeout);
  notify.timeout = window.setTimeout(() => toast.classList.remove("show"), 3400);
}

function saveState() {
  localStorage.setItem("masqani-saved", JSON.stringify([...savedIds]));
  localStorage.setItem("masqani-viewings", JSON.stringify(localViewings));
}

function updateAccountUI() {
  const button = document.querySelector("#open-auth");
  const account = document.querySelector("#account-button");
  const logoutButton = document.querySelector("#logout-button");
  if (session) {
    button.textContent = session.user.name.split(" ")[0];
    account.querySelector("span").textContent = "Account";
    logoutButton.hidden = false;
  } else {
    button.textContent = "Log in";
    logoutButton.hidden = true;
  }
}

async function logout() {
  try { if (session?.accessToken) await api("/api/auth/logout", { method: "POST" }); } catch { /* Local session must still be cleared. */ }
  session = null; sessionStorage.removeItem("masqani-session"); updateAccountUI(); render(properties); notify("You have been logged out.");
}

function render(list) {
  grid.innerHTML = list.map((p) => `<article class="property-card"><div class="property-image" style="background-image:url('${p.image}')"><button class="heart ${savedIds.has(p.id) ? "liked" : ""}" data-save="${p.id}" aria-label="Save ${p.title}">${savedIds.has(p.id) ? "♥" : "♡"}</button><span class="badge">Preview listing</span></div><div class="property-content"><p class="property-type">${p.type}</p><h3>${p.title}</h3><p class="property-location">⌖ ${p.location}</p><p class="price">KSh ${p.price.toLocaleString()} <small>/ month</small></p><div class="meta"><span>▣ ${p.beds} room${p.beds > 1 ? "s" : ""}</span><span>◉ ${p.baths} bath${p.baths > 1 ? "s" : ""}</span></div><button class="view-button" data-view="${p.id}" type="button">Request viewing</button></div></article>`).join("");
  count.textContent = `Showing ${list.length} ${list.length === 1 ? "home" : "homes"}${list.length < properties.length ? " matching your search" : " from Kenya rental listings"}`;
  document.querySelectorAll("[data-save]").forEach((button) => button.addEventListener("click", async () => {
    const id = button.dataset.save;
    if (!session) { notify("Log in as a house hunter to save homes."); openAuth("login"); return; }
    if (session.user.role !== "tenant") { notify("Saved homes are available to house hunters."); return; }
    const wasSaved = savedIds.has(id);
    try {
      await api(wasSaved ? `/api/saved-properties/${id}` : "/api/saved-properties", { method: wasSaved ? "DELETE" : "POST", body: wasSaved ? undefined : JSON.stringify({ propertyId: id }) });
      wasSaved ? savedIds.delete(id) : savedIds.add(id);
      saveState(); render(list);
      notify(wasSaved ? "Home removed from saved homes." : "Home saved.");
    } catch (error) { notify(error.message); }
  }));
  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => openViewing(button.dataset.view)));
}

function filter() {
  const type = document.querySelector("#type").value;
  const budget = Number(document.querySelector("#budget").value || document.querySelector("#modal-budget").value || 0);
  const beds = Number(document.querySelector("#bedrooms").value || 0);
  const location = document.querySelector("#location").value.trim().toLowerCase();
  const list = properties.filter((p) => (!type || p.type === type) && (!budget || p.price <= budget) && (!beds || p.beds >= beds) && (!location || p.location.toLowerCase().includes(location) || location === "nairobi" || location === "kenya"));
  render(list);
  document.querySelector("#homes").scrollIntoView({ behavior: "smooth" });
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (session?.accessToken) headers.Authorization = `Bearer ${session.accessToken}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: "include" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

function switchAuthMode(mode) {
  authMode = mode;
  const registering = mode === "register";
  document.querySelector("#auth-title").textContent = registering ? "Create your account" : "Log in";
  document.querySelector("#auth-copy").textContent = registering ? "Save homes and request viewings in a few steps." : "Access saved homes and viewing requests.";
  document.querySelector("#register-fields").hidden = !registering;
  document.querySelector("#auth-name").required = registering;
  document.querySelector("#auth-phone").required = registering;
  document.querySelector("#auth-password").autocomplete = registering ? "new-password" : "current-password";
  document.querySelector(".auth-submit").textContent = registering ? "Create account" : "Log in";
  document.querySelectorAll(".auth-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.mode === mode));
}

function openAuth(mode = "login") {
  if (session && mode === "login") {
    notify(`Signed in as ${session.user.name}.`);
    return;
  }
  switchAuthMode(mode);
  authDialog.showModal();
}

function openViewing(id) {
  if (!session) {
    notify("Log in first to request a viewing.");
    openAuth("login");
    return;
  }
  if (session.user.role !== "tenant") {
    notify("Viewing requests are available to house hunters.");
    return;
  }
  selectedProperty = properties.find((property) => property.id === id);
  document.querySelector("#viewing-title").textContent = selectedProperty.title;
  viewingDialog.showModal();
}

async function googleSignIn() {
  if (!window.MASQANI_GOOGLE_CLIENT_ID) {
    notify("Google sign-in is ready to configure. Add your Google OAuth client ID in google-config.js.");
    return;
  }
  if (!window.google?.accounts?.id) {
    notify("Google sign-in is loading. Please try again in a moment.");
    return;
  }
  window.google.accounts.id.initialize({ client_id: window.MASQANI_GOOGLE_CLIENT_ID, callback: async ({ credential }) => {
    try {
      const data = await api("/api/auth/google", { method: "POST", body: JSON.stringify({ idToken: credential, role: "tenant" }) });
      session = data; sessionStorage.setItem("masqani-session", JSON.stringify(session)); updateAccountUI(); authDialog.close(); notify("Welcome to MASQANI.");
    } catch (error) { notify(error.message); }
  }});
  window.google.accounts.id.prompt();
}

render(properties);
updateAccountUI();
async function loadLiveProperties() {
  try {
    const response = await fetch(`${API_URL}/api/properties?limit=50&page=1`);
    const payload = await response.json();
    if (!response.ok || !payload.properties?.length) return;
    properties = payload.properties.map((property) => ({
      id: property.id, title: property.title, location: `${property.neighborhood}, ${property.city}`,
      price: Number(property.monthly_rent), type: property.property_type, beds: property.bedrooms,
      baths: property.bathrooms, image: property.media?.[0]?.url || "assets/masqani-logo.png"
    }));
    render(properties);
  } catch { /* Preview data stays available when the API is offline. */ }
}
loadLiveProperties();
document.querySelector("#search-form").addEventListener("submit", (event) => { event.preventDefault(); filter(); });
document.querySelectorAll(".filter-chip").forEach((button) => button.addEventListener("click", () => { document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active")); button.classList.add("active"); render(button.dataset.filter === "all" ? properties : properties.filter((p) => p.type === button.dataset.filter)); }));
const dialog = document.querySelector("#filter-dialog");
document.querySelector("#filter-button").onclick = () => dialog.showModal();
document.querySelector("#apply-filter").onclick = () => setTimeout(filter, 0);
document.querySelector("#open-auth").onclick = () => openAuth();
document.querySelector("#account-button").onclick = () => openAuth();
document.querySelector("#logout-button").onclick = logout;
document.querySelector("#list-property").onclick = () => openAuth("register");
document.querySelectorAll(".auth-tab").forEach((tab) => tab.onclick = () => switchAuthMode(tab.dataset.mode));
document.querySelectorAll("[data-close]").forEach((button) => button.onclick = () => document.querySelector(`#${button.dataset.close}`).close());
document.querySelector("#google-login").onclick = googleSignIn;
document.querySelector("#saved-button").onclick = () => { const saved = properties.filter((p) => savedIds.has(p.id)); render(saved); document.querySelector("#homes").scrollIntoView({ behavior: "smooth" }); notify(saved.length ? `${saved.length} saved home${saved.length === 1 ? "" : "s"}.` : "No saved homes yet."); };
document.querySelector("#viewings-button").onclick = () => notify(localViewings.length ? `${localViewings.length} viewing request${localViewings.length === 1 ? "" : "s"} sent.` : "No viewing requests yet.");
document.querySelector("#auth-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.querySelector("#auth-email").value.trim();
  const password = document.querySelector("#auth-password").value;
  const body = authMode === "register" ? { role: document.querySelector("#auth-role").value, name: document.querySelector("#auth-name").value.trim(), phone: document.querySelector("#auth-phone").value.trim(), email, password } : { email, password };
  try {
    const data = await api(`/api/auth/${authMode === "register" ? "register" : "login"}`, { method: "POST", body: JSON.stringify(body) });
    session = { user: data.user, accessToken: data.accessToken };
    sessionStorage.setItem("masqani-session", JSON.stringify(session)); updateAccountUI(); authDialog.close();
    notify(authMode === "register" ? "Account created. You can now request a viewing." : "Welcome back.");
  } catch (error) { notify(error.message); }
});
document.querySelector("#viewing-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const scheduledAt = document.querySelector("#viewing-date").value;
  if (!scheduledAt || !selectedProperty) return;
  try {
    await api("/api/viewings", { method: "POST", body: JSON.stringify({ propertyId: selectedProperty.id, scheduledAt: new Date(scheduledAt).toISOString() }) });
    localViewings.push({ title: selectedProperty.title, scheduledAt }); saveState(); viewingDialog.close(); notify("Viewing request sent. The landlord will confirm it.");
  } catch (error) { notify(error.message); }
});

if (new URLSearchParams(window.location.search).get("auth")) openAuth("login");
