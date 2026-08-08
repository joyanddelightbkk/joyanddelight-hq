# JDOS v0.6.1 — Product Master Intake

- Expanded Product Master to one-time product intake form
- Bakery defaults to Pre-order
- Added Product ID, subcategory, MOQ, lead time, ingredients, allergens, storage, shelf life, reheat, packaging, QC, internal note
- Added separate Publish control for public website
- Added D1 migration `0002_product_passport.sql`
# JDOS Platform v0.6.0

สถานะ: Release Candidate สำหรับ production

## Scope ที่ส่งมอบ

1. Public Website
2. Product Master
3. HQ Dashboard
4. Add/Edit/Delete Product
5. Publish workflow
6. Cloudflare Worker + D1 + Static Assets

## URL หลัง deploy

- Public: `/`
- HQ: `/hq.html`
- Health: `/api/health`
