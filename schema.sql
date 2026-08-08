CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_th TEXT NOT NULL,
  name_en TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Bakery',
  short_description TEXT DEFAULT '',
  description TEXT DEFAULT '',
  price REAL NOT NULL DEFAULT 0,
  compare_at_price REAL,
  unit TEXT DEFAULT 'ชิ้น',
  image_url TEXT DEFAULT '',
  badges TEXT DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('active','draft','soldout','archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  available_note TEXT DEFAULT '',
  product_code TEXT DEFAULT '',
  subcategory TEXT DEFAULT '',
  order_type TEXT NOT NULL DEFAULT 'preorder',
  lead_time_days INTEGER NOT NULL DEFAULT 2,
  moq REAL NOT NULL DEFAULT 1,
  ingredients TEXT DEFAULT '',
  allergens TEXT DEFAULT '',
  shelf_life TEXT DEFAULT '',
  storage TEXT DEFAULT '',
  reheat TEXT DEFAULT '',
  packaging TEXT DEFAULT '',
  qc_standard TEXT DEFAULT '',
  internal_note TEXT DEFAULT '',
  published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code) WHERE product_code <> '';
CREATE INDEX IF NOT EXISTS idx_products_status_sort ON products(status, sort_order, updated_at);

INSERT OR IGNORE INTO products
(id, slug, name_th, name_en, category, short_description, description, price, unit, image_url, badges, status, sort_order, featured, available_note)
VALUES
('P001','classic-sourdough','ซาวร์โดว์คลาสสิก','Classic Sourdough','Sourdough','ขนมปังยีสต์ธรรมชาติ เปลือกหอม เนื้อหนึบ','หมักด้วยยีสต์ธรรมชาติ ไม่ใส่สารเสริม เหมาะกับอาหารคาวและแซนด์วิช',180,'ก้อน','', '["Natural Levain","No Additives"]','active',10,1,'อบตามรอบ กรุณาสั่งล่วงหน้า'),
('P002','olive-sourdough','ซาวร์โดว์มะกอก','Olive Sourdough','Sourdough','หอมมะกอก รสกลมกล่อม ทานง่าย','ซาวร์โดว์ยีสต์ธรรมชาติผสมมะกอก เหมาะกับชีส ซุป และอาหารตะวันตก',220,'ก้อน','', '["Best Seller","Natural Levain"]','active',20,1,'อบตามรอบ กรุณาสั่งล่วงหน้า'),
('P003','cranberry-sourdough','ซาวร์โดว์แครนเบอร์รี','Cranberry Sourdough','Sourdough','เปรี้ยวหวานพอดี ทานเดี่ยวก็อร่อย','ซาวร์โดว์แครนเบอร์รีสำหรับมื้อเช้า ชีสบอร์ด หรือของว่าง',220,'ก้อน','', '["Fruit Bread","Natural Levain"]','active',30,0,'อบตามรอบ กรุณาสั่งล่วงหน้า'),
('P004','soft-bagel','เบเกิลนุ่ม','Soft Bagel','Bagel','เบเกิลเนื้อนุ่มหนึบ อุ่นแล้วหอม','เหมาะทำแซนด์วิชหรือทานกับครีมชีส',65,'ชิ้น','', '["Soft & Chewy"]','draft',40,0,'กำลังพัฒนารอบจำหน่าย');
