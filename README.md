# JDOS v0.6 — Joy & Delight

ชุด deploy สำหรับ `joyanddelightbkk.com`

## สิ่งที่มีใน v0.6

- Public Website responsive ใหม่
- Product Master บน Cloudflare D1
- JDOS HQ Dashboard ที่ `/hq.html`
- เพิ่ม / แก้ไข / ลบ / เปลี่ยนสถานะสินค้า
- Public Website ดึงเฉพาะสินค้าสถานะ `active` จาก Product Master
- Seed products เริ่มต้น: Classic, Olive, Cranberry Sourdough และ Soft Bagel (draft)

## Deploy ครั้งแรก

ต้องมี Node.js และบัญชี Cloudflare ที่ถือ zone `joyanddelightbkk.com`

```bash
npm install
npx wrangler login
npx wrangler d1 create jdos-products
```

คัดลอก `database_id` ที่ได้ ไปแทน `REPLACE_WITH_D1_DATABASE_ID` ใน `wrangler.jsonc`

ตั้งรหัส HQ:

```bash
npx wrangler secret put ADMIN_KEY
```

สร้างตารางและข้อมูลเริ่มต้น:

```bash
npm run db:init:remote
```

Deploy:

```bash
npm run deploy
```

จากนั้น Cloudflare Dashboard → Workers & Pages → `jdos-v06` → Settings → Domains & Routes → Add → Custom Domain → `joyanddelightbkk.com`

HQ: `https://joyanddelightbkk.com/hq.html`

## ก่อนเปิดจริง

1. แก้ปุ่ม LINE ใน `public/index.html` จาก `https://lin.ee/` เป็นลิงก์ LINE OA จริง
2. ใส่รูปสินค้าใน HQ ด้วย URL รูปภาพ
3. ตรวจราคาและสถานะสินค้า
4. ทดสอบเพิ่มสินค้าใน HQ แล้วเปิดหน้าแรกจากอีกอุปกรณ์

## หมายเหตุด้านความปลอดภัย

v0.6 ใช้ ADMIN_KEY แบบ Bearer token เพื่อให้ deploy ได้เร็วและมี backend จริง เหมาะกับผู้ดูแลคนเดียว ใน v0.7 ควรย้ายเป็น Cloudflare Access หรือระบบบัญชีผู้ใช้
