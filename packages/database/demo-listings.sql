-- Local MASQANI demonstration inventory. These remain preview listings until an
-- owner has submitted evidence and a MASQANI administrator approves them.
insert into users (id, role, name, email, phone, active)
values ('00000000-0000-4000-8000-000000000100', 'landlord', 'MASQANI Demo Listings', 'demo-listings@masqani.local', '', true)
on conflict (email) do nothing;

insert into properties (id, landlord_id, title, apartment_name, description, monthly_rent, deposit_amount, bedrooms, bathrooms, property_type, city, neighborhood, availability_status, moderation_status)
values
('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000100','Spacious single room','Murang''a University rooms','Unfurnished 100 sq ft single room with tiled floor, white walls, a large window and wooden door.',3000,3000,1,1,'Single Room','Murang''a','Near Murang''a University','available','approved'),
('00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000100','Spacious bedsitter','Kahawa Sukari bedsitter','Compact tiled bedsitter with a kitchenette and bathroom.',6000,6000,1,1,'Bedsitter','Nairobi','Kahawa Sukari','available','approved'),
('00000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000100','Bedsitter with fitted kitchenette','Githurai bedsitter','Open-plan bedsitter with fitted kitchenette, built-in storage and a self-contained bathroom.',6500,6500,1,1,'Bedsitter','Nairobi','Githurai','available','approved'),
('00000000-0000-4000-8000-000000000004','00000000-0000-4000-8000-000000000100','1 bedroom bedsitter','Uthiru rental','30 sqm unfurnished unit with tiled flooring, compact kitchenette, modern washroom and parking.',10000,10000,1,1,'1 Bedroom','Nairobi','Uthiru, Dagoretti','available','approved'),
('00000000-0000-4000-8000-000000000005','00000000-0000-4000-8000-000000000100','Bedsitter near Fig Tree','Ngara Fig Tree bedsitter','Self-contained studio bedsitter with built-in wardrobe, fitted kitchen and instant shower.',6000,6000,1,1,'Bedsitter','Nairobi','Ngara','available','approved'),
('00000000-0000-4000-8000-000000000006','00000000-0000-4000-8000-000000000100','Spacious bedsitter','Langata bedsitter','Vacant tiled bedsitter with kitchenette, wardrobe and compact bathroom.',6000,6000,1,1,'Bedsitter','Nairobi','Langata','available','approved'),
('00000000-0000-4000-8000-000000000007','00000000-0000-4000-8000-000000000100','Bedsitter with modern fittings','Lower Kabete bedsitter','Unfurnished bedsitter with kitchenette, wardrobe and bathroom.',11000,11000,1,1,'Bedsitter','Nairobi','Lower Kabete','available','approved'),
('00000000-0000-4000-8000-000000000008','00000000-0000-4000-8000-000000000100','Spacious bedsitter','Pioneer bedsitter','Compact tiled bedsitter with wardrobe and kitchenette.',5000,5000,1,1,'Bedsitter','Eldoret','Pioneer','available','approved'),
('00000000-0000-4000-8000-000000000009','00000000-0000-4000-8000-000000000100','3 bedroom bungalow','Syokimau bungalow','Three-bedroom bungalow with living room, dining area, closed-plan kitchen, pantry, parking and a secure compound.',65000,65000,3,3,'House','Syokimau','Community Road','available','approved')
on conflict (id) do nothing;

insert into property_media (property_id, url, media_type, caption, sort_order)
values
('00000000-0000-4000-8000-000000000001','https://images.locanto.info/6618720148/Smart-spacious-single-room-to-let-at-muranga-near-muranga-univ_1.jpg','image','Spacious single room',0),
('00000000-0000-4000-8000-000000000002','https://images.locanto.info/5342663400/Kahawa-sukari-spacious-bedsitter-ready-for-occupation_1.jpg','image','Kahawa Sukari bedsitter',0),
('00000000-0000-4000-8000-000000000003','https://images.locanto.info/5251819067/Githurai-spacious-bedsitter-ready-for-occupation_1.jpg','image','Githurai bedsitter',0),
('00000000-0000-4000-8000-000000000004','https://assets.jumuika.co.ke/properties/1d632590-41ff-d569-7c92-493a562b44ee/photos/1c784d74-a8fa-40d0-914e-719e8dba3f27.jpg?auto_optimize=medium&quality=85&width=1200','image','Uthiru rental',0),
('00000000-0000-4000-8000-000000000005','https://images.locanto.co.ke/5890311050/bedsitter-to-let-in-ngara-fig-tree_1.jpg','image','Ngara bedsitter',0),
('00000000-0000-4000-8000-000000000006','https://images.locanto.info/5251414934/Langata-Spacious-bedsitter-ready-for-occupation_1.jpg','image','Langata bedsitter',0),
('00000000-0000-4000-8000-000000000007','https://propscout.co.ke/storage/properties/files/bedsitters/webp/lower-kabete-bedsitters-for-rent-3hwag.webp','image','Lower Kabete bedsitter',0),
('00000000-0000-4000-8000-000000000008','https://images.locanto.info/5266493946/Pioneer-spacious-bedsitter-ready-for-occupation_1.jpg','image','Pioneer bedsitter',0),
('00000000-0000-4000-8000-000000000009','https://propscout.co.ke/storage/properties/files/3-bedroom-bungalow-for-rent-in-syokimau-community-road-e7xb8.jpg','image','Syokimau bungalow',0)
on conflict (property_id, url) do nothing;
