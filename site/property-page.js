const API_URL = window.MASQANI_API_URL || "http://localhost:4000";
const fallback = {
  "00000000-0000-4000-8000-000000000001": ["Spacious single room", "Single Room", "Near Murang'a University, Murang'a", 3000, 1, 1, "https://images.locanto.info/6618720148/Smart-spacious-single-room-to-let-at-muranga-near-muranga-univ_1.jpg", "Unfurnished 100 sq ft single room with tiled floor, white walls, a large window and wooden door."],
  "00000000-0000-4000-8000-000000000002": ["Spacious bedsitter", "Bedsitter", "Kahawa Sukari, Nairobi", 6000, 1, 1, "https://images.locanto.info/5342663400/Kahawa-sukari-spacious-bedsitter-ready-for-occupation_1.jpg", "Compact tiled bedsitter with a kitchenette and bathroom."],
  "00000000-0000-4000-8000-000000000003": ["Bedsitter with fitted kitchenette", "Bedsitter", "Githurai, Nairobi", 6500, 1, 1, "https://images.locanto.info/5251819067/Githurai-spacious-bedsitter-ready-for-occupation_1.jpg", "Open-plan bedsitter with fitted kitchenette, built-in storage and a self-contained bathroom."],
  "00000000-0000-4000-8000-000000000004": ["1 bedroom bedsitter", "1 Bedroom", "Uthiru, Dagoretti, Nairobi", 10000, 1, 1, "https://assets.jumuika.co.ke/properties/1d632590-41ff-d569-7c92-493a562b44ee/photos/1c784d74-a8fa-40d0-914e-719e8dba3f27.jpg?auto_optimize=medium&quality=85&width=1200", "30 sqm unfurnished unit with tiled flooring, compact kitchenette, modern washroom and parking."],
  "00000000-0000-4000-8000-000000000005": ["Bedsitter near Fig Tree", "Bedsitter", "Ngara, Nairobi", 6000, 1, 1, "https://images.locanto.co.ke/5890311050/bedsitter-to-let-in-ngara-fig-tree_1.jpg", "Self-contained studio bedsitter with built-in wardrobe, fitted kitchen and instant shower."],
  "00000000-0000-4000-8000-000000000006": ["Spacious bedsitter", "Bedsitter", "Langata, Nairobi", 6000, 1, 1, "https://images.locanto.info/5251414934/Langata-Spacious-bedsitter-ready-for-occupation_1.jpg", "Vacant tiled bedsitter with kitchenette, wardrobe and compact bathroom."],
  "00000000-0000-4000-8000-000000000007": ["Bedsitter with modern fittings", "Bedsitter", "Lower Kabete, Nairobi", 11000, 1, 1, "https://propscout.co.ke/storage/properties/files/bedsitters/webp/lower-kabete-bedsitters-for-rent-3hwag.webp", "Unfurnished bedsitter with kitchenette, wardrobe and bathroom."],
  "00000000-0000-4000-8000-000000000008": ["Spacious bedsitter", "Bedsitter", "Pioneer, Eldoret", 5000, 1, 1, "https://images.locanto.info/5266493946/Pioneer-spacious-bedsitter-ready-for-occupation_1.jpg", "Compact tiled bedsitter with wardrobe and kitchenette."],
  "00000000-0000-4000-8000-000000000009": ["3 bedroom bungalow", "House", "Community Road, Syokimau", 65000, 3, 3, "https://propscout.co.ke/storage/properties/files/3-bedroom-bungalow-for-rent-in-syokimau-community-road-e7xb8.jpg", "Three-bedroom bungalow with living room, dining area, closed-plan kitchen, pantry, parking and a secure compound."]
};
const id = new URLSearchParams(location.search).get("id");
const page = document.querySelector("#property-page");

function render(property) {
  if (!property) {
    page.innerHTML = '<section class="portal-panel"><h1>Listing not found</h1><p>This property may have been removed.</p><a class="button" href="listings.html">Back to listings</a></section>';
    return;
  }
  const [title, type, location, price, rooms, baths, image, description, verified] = property;
  document.title = `${title} | MASQANI`;
  page.innerHTML = `<section class="property-page-detail"><img src="${image}" alt="${title} in ${location}"><article class="portal-panel"><p class="property-type">${type}</p><h1>${title}</h1><p class="property-location">⌖ ${location}</p><p class="listing-price">KSh ${Number(price).toLocaleString()} <small>/ month</small></p><div class="detail-facts"><span>${rooms} room${rooms > 1 ? "s" : ""}</span><span>${baths} bathroom${baths > 1 ? "s" : ""}</span></div><h2>About this listing</h2><p>${description}</p><div class="safety-note"><strong>${verified ? "Masqani Verified" : "Listing pending verification"}.</strong><br>Confirm the property and landlord in person before making any payment.</div><a class="button" href="auth.html">Log in to request a viewing</a></article></section>`;
}

async function loadProperty() {
  try {
    const response = await fetch(`${API_URL}/api/properties/${id}`);
    const property = await response.json();
    if (!response.ok) throw new Error("Not found");
    const item = property.property;
    render([item.title, item.property_type, `${item.neighborhood}, ${item.city}`, item.monthly_rent, item.bedrooms, item.bathrooms, item.media?.[0]?.url || "assets/masqani-logo.png", item.description, Boolean(item.verified_at)]);
  } catch {
    render(fallback[id]);
  }
}
loadProperty();
