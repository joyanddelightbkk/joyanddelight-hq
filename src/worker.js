const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
});

function isAdmin(request, env) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  return Boolean(env.ADMIN_KEY) && token === env.ADMIN_KEY;
}

function cleanProduct(input = {}) {
  const allowedStatus = new Set(['active', 'draft', 'soldout', 'archived']);
  const slug = String(input.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
  return {
    id: String(input.id || crypto.randomUUID()),
    slug,
    name_th: String(input.name_th || '').trim(),
    name_en: String(input.name_en || '').trim(),
    category: String(input.category || 'Bakery').trim(),
    short_description: String(input.short_description || '').trim(),
    description: String(input.description || '').trim(),
    price: Number(input.price || 0),
    compare_at_price: input.compare_at_price === '' || input.compare_at_price == null ? null : Number(input.compare_at_price),
    unit: String(input.unit || 'ชิ้น').trim(),
    image_url: String(input.image_url || '').trim(),
    badges: JSON.stringify(Array.isArray(input.badges) ? input.badges.map(String) : []),
    status: allowedStatus.has(input.status) ? input.status : 'draft',
    sort_order: Number.isFinite(Number(input.sort_order)) ? Number(input.sort_order) : 0,
    featured: input.featured ? 1 : 0,
    available_note: String(input.available_note || '').trim()
  };
}

function parseRow(row) {
  return { ...row, badges: (() => { try { return JSON.parse(row.badges || '[]'); } catch { return []; } })(), featured: Boolean(row.featured) };
}

async function api(request, env, url) {
  const path = url.pathname;
  if (path === '/api/health') return json({ ok: true, version: '0.6.0' });

  if (path === '/api/products' && request.method === 'GET') {
    const admin = isAdmin(request, env);
    const query = admin
      ? 'SELECT * FROM products ORDER BY sort_order ASC, updated_at DESC'
      : "SELECT * FROM products WHERE status='active' ORDER BY sort_order ASC, updated_at DESC";
    const { results } = await env.DB.prepare(query).all();
    return json({ products: results.map(parseRow) });
  }

  if (path === '/api/admin/login' && request.method === 'POST') {
    let body = {};
    try { body = await request.json(); } catch {}
    if (!env.ADMIN_KEY) return json({ error: 'ADMIN_KEY is not configured' }, 503);
    return body.key === env.ADMIN_KEY ? json({ ok: true }) : json({ error: 'รหัส HQ ไม่ถูกต้อง' }, 401);
  }

  if (path === '/api/products' && request.method === 'POST') {
    if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);
    const p = cleanProduct(await request.json());
    if (!p.slug || !p.name_th) return json({ error: 'กรุณากรอกชื่อสินค้าและ slug' }, 400);
    await env.DB.prepare(`INSERT INTO products
      (id,slug,name_th,name_en,category,short_description,description,price,compare_at_price,unit,image_url,badges,status,sort_order,featured,available_note,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`)
      .bind(p.id,p.slug,p.name_th,p.name_en,p.category,p.short_description,p.description,p.price,p.compare_at_price,p.unit,p.image_url,p.badges,p.status,p.sort_order,p.featured,p.available_note).run();
    return json({ ok: true, id: p.id }, 201);
  }

  const match = path.match(/^\/api\/products\/([^/]+)$/);
  if (match && request.method === 'PUT') {
    if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);
    const p = cleanProduct({ ...(await request.json()), id: decodeURIComponent(match[1]) });
    if (!p.slug || !p.name_th) return json({ error: 'กรุณากรอกชื่อสินค้าและ slug' }, 400);
    const result = await env.DB.prepare(`UPDATE products SET slug=?,name_th=?,name_en=?,category=?,short_description=?,description=?,price=?,compare_at_price=?,unit=?,image_url=?,badges=?,status=?,sort_order=?,featured=?,available_note=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .bind(p.slug,p.name_th,p.name_en,p.category,p.short_description,p.description,p.price,p.compare_at_price,p.unit,p.image_url,p.badges,p.status,p.sort_order,p.featured,p.available_note,p.id).run();
    return result.meta.changes ? json({ ok: true }) : json({ error: 'ไม่พบสินค้า' }, 404);
  }

  if (match && request.method === 'DELETE') {
    if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);
    await env.DB.prepare('DELETE FROM products WHERE id=?').bind(decodeURIComponent(match[1])).run();
    return json({ ok: true });
  }

  return json({ error: 'Not found' }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith('/api/')) return await api(request, env, url);
      return await env.ASSETS.fetch(request);
    } catch (error) {
      console.error(error);
      return json({ error: 'ระบบขัดข้อง', detail: error?.message || String(error) }, 500);
    }
  }
};
