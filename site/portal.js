const API_URL = window.MASQANI_API_URL || "http://localhost:4000";
const session = JSON.parse(sessionStorage.getItem("masqani-session") || "null");

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function setMessage(id, message) {
  const element = document.querySelector(id);
  if (element) element.textContent = message;
}

async function api(path, options = {}) {
  if (!session?.accessToken) throw new Error("Please log in to use your dashboard.");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}`, ...(options.headers || {}) },
    credentials: "include"
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "We could not complete that request.");
  return payload;
}

async function logout() {
  try { if (session?.accessToken) await api("/api/auth/logout", { method: "POST" }); } catch { /* Local session must still be cleared. */ }
  sessionStorage.removeItem("masqani-session"); window.location.assign("index.html");
}

function configurePortalHeader() {
  const button = document.querySelector(".header-actions .login");
  if (!button || !session) return;
  button.textContent = "Log out"; button.href = "#";
  button.addEventListener("click", (event) => { event.preventDefault(); logout(); });
}

function requireRole(role) {
  if (!session) return false;
  if (session.user?.role !== role) {
    setMessage("#dashboard-message", `This area is for ${role}s. Log in with the correct account to continue.`);
    return false;
  }
  return true;
}

function formatDate(value) {
  return new Date(value).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" });
}

async function loadTenant() {
  if (!requireRole("tenant")) return;
  try {
    const [savedResponse, viewingResponse] = await Promise.all([api("/api/saved-properties"), api("/api/viewings")]);
    const saved = savedResponse.properties || [];
    const viewings = viewingResponse.viewings || [];
    setMessage("#saved-count", saved.length); setMessage("#viewing-count", viewings.length);
    const savedList = document.querySelector("#saved-list");
    if (savedList) savedList.innerHTML = saved.length ? saved.map((property) => `<article><div><h3>${escapeHtml(property.title)}</h3><p>${escapeHtml(property.neighborhood)}, ${escapeHtml(property.city)} · KSh ${Number(property.monthly_rent).toLocaleString()}</p></div><a class="button button-small" href="property.html?id=${property.id}">View listing</a></article>`).join("") : "<p>No saved homes yet. Browse listings to save homes you want to compare.</p>";
    const viewingList = document.querySelector("#viewing-list");
    if (viewingList) viewingList.innerHTML = viewings.length ? viewings.map((viewing) => `<article><div><h3>${escapeHtml(viewing.title)}</h3><p>${formatDate(viewing.scheduled_at)}</p></div><span class="status">${escapeHtml(viewing.status)}</span></article>`).join("") : "<p>No viewing requests yet. Request one from a property listing.</p>";
  } catch (error) { setMessage("#dashboard-message", error.message); }
}

async function loadLandlord() {
  if (!requireRole("landlord")) return;
  try {
    const [propertyResponse, viewingResponse] = await Promise.all([api("/api/properties/mine"), api("/api/viewings")]);
    const properties = propertyResponse.properties || [];
    const viewings = viewingResponse.viewings || [];
    const list = document.querySelector("#landlord-properties");
    if (list) list.innerHTML = properties.length ? properties.map((property) => `<article><div><h3>${escapeHtml(property.title)}</h3><p>${escapeHtml(property.neighborhood)}, ${escapeHtml(property.city)} · KSh ${Number(property.monthly_rent).toLocaleString()} · ${escapeHtml(property.moderation_status)}</p></div><span class="status">${escapeHtml(property.availability_status)}</span></article>`).join("") : "<p>You have not submitted a property yet.</p>";
    const viewingsList = document.querySelector("#landlord-viewings");
    if (viewingsList) viewingsList.innerHTML = viewings.length ? viewings.map((viewing) => `<article><div><h3>${escapeHtml(viewing.title)}</h3><p>${formatDate(viewing.scheduled_at)}</p></div><span class="status">${escapeHtml(viewing.status)}</span></article>`).join("") : "<p>No viewing requests yet.</p>";
  } catch (error) { setMessage("#dashboard-message", error.message); }
}

async function submitProperty(event) {
  event.preventDefault();
  if (!requireRole("landlord")) return;
  const form = event.currentTarget;
  const [neighborhood, city = "Kenya"] = form.elements.location.value.trim().split(",").map((part) => part.trim());
  const payload = { title: form.elements.title.value.trim(), apartmentName: form.elements.title.value.trim(), monthlyRent: Number(form.elements.rent.value), depositAmount: 0, propertyType: form.elements.propertyType.value, city, neighborhood, bedrooms: Number(form.elements.bedrooms.value), bathrooms: Number(form.elements.bathrooms.value), description: form.elements.description.value.trim(), media: [], amenities: [] };
  try { await api("/api/properties", { method: "POST", body: JSON.stringify(payload) }); form.reset(); setMessage("#dashboard-message", "Property submitted for moderation."); await loadLandlord(); }
  catch (error) { setMessage("#dashboard-message", error.message); }
}

async function loadAdmin() {
  if (!requireRole("admin")) return;
  try {
    const [metrics, listings, reports] = await Promise.all([api("/api/admin/metrics"), api("/api/admin/listings"), api("/api/reports")]);
    const pending = listings.listings || [];
    const queue = document.querySelector("#moderation-list");
    if (queue) queue.innerHTML = pending.length ? pending.map((item) => `<article><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.landlord_name)} · ${escapeHtml(item.neighborhood)}, ${escapeHtml(item.city)} · KSh ${Number(item.monthly_rent).toLocaleString()}</p></div><div class="moderation-actions"><button data-moderate="${item.id}" data-status="approved">Approve</button><button class="reject" data-moderate="${item.id}" data-status="rejected">Reject</button></div></article>`).join("") : "<p>No listings are waiting for review.</p>";
    const reportList = document.querySelector("#report-list");
    if (reportList) reportList.innerHTML = reports.reports?.length ? reports.reports.map((report) => `<article><div><h3>${escapeHtml(report.reason)}</h3><p>${escapeHtml(report.body || "No additional details")}</p></div><span class="status">${escapeHtml(report.status)}</span></article>`).join("") : "<p>No reports require review.</p>";
    const userCounts = Object.fromEntries((metrics.users || []).map((item) => [item.role, item.total]));
    setMessage("#tenant-total", userCounts.tenant || 0); setMessage("#landlord-total", userCounts.landlord || 0); setMessage("#open-report-total", (metrics.reports || []).reduce((total, item) => total + Number(item.total), 0));
    document.querySelectorAll("[data-moderate]").forEach((button) => button.addEventListener("click", async () => {
      try { await api(`/api/admin/listings/${button.dataset.moderate}/moderate`, { method: "PATCH", body: JSON.stringify({ status: button.dataset.status }) }); await loadAdmin(); }
      catch (error) { setMessage("#dashboard-message", error.message); }
    }));
  } catch (error) { setMessage("#dashboard-message", error.message); }
}

document.querySelector("#property-form")?.addEventListener("submit", submitProperty);
configurePortalHeader();
if (document.querySelector("#saved-list")) loadTenant();
if (document.querySelector("#landlord-properties")) loadLandlord();
if (document.querySelector("#moderation-list")) loadAdmin();
