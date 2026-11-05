'use client';

// Administration complète (sans Supabase) : produits, catégories, commandes, codes promo.
// Les données sont stockées dans data/store.json via /api/admin/* (protégé par ADMIN_PASSWORD).
import { useEffect, useState, useCallback, FormEvent } from 'react';
import type { StoreProduct, StoreCategory, StorePromo, StoreOrder, StoreWeightOption, OrderStatus } from '@/types/store.types';

type Tab = 'products' | 'categories' | 'orders' | 'promos';

const TAG_OPTIONS = ['', 'Bestseller', 'Nouveau', 'Populaire', 'Premium', 'Promo', 'Exclusif', 'Médical', 'Économique', 'Limited', 'Bio'];
const STATUS_LABELS: Record<OrderStatus, string> = {
  paid: 'Payée',
  preparing: 'En préparation',
  shipped: 'Expédiée',
  cancelled: 'Annulée',
};

const box: React.CSSProperties = { background: '#fff', border: '1px solid #ddd', borderRadius: 10, padding: 16, marginBottom: 20 };
const th: React.CSSProperties = { padding: '8px 10px', borderBottom: '2px solid #0f3f16', textAlign: 'left', fontSize: 13, whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '8px 10px', borderBottom: '1px solid #eee', verticalAlign: 'middle', fontSize: 14 };
const input: React.CSSProperties = { width: '100%', padding: '8px 10px', border: '1px solid #bbb', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' };
const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, marginTop: 12 };
const btn: React.CSSProperties = { padding: '8px 14px', border: 'none', borderRadius: 6, background: '#0f3f16', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13 };
const btnGhost: React.CSSProperties = { ...btn, background: '#fff', color: '#0f3f16', border: '1px solid #0f3f16' };
const btnDanger: React.CSSProperties = { ...btn, background: '#b3261e' };

async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json', ...(init?.headers || {}) } : init?.headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Erreur ${res.status}`);
  return data as T;
}

const fmt = (n: number) => `${n.toFixed(2)}€`;

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [promos, setPromos] = useState<StorePromo[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, c, pr, o, im] = await Promise.all([
        api<StoreProduct[]>('/api/admin/products'),
        api<StoreCategory[]>('/api/admin/categories'),
        api<StorePromo[]>('/api/admin/promos'),
        api<StoreOrder[]>('/api/admin/orders'),
        api<string[]>('/api/admin/images'),
      ]);
      setProducts(p);
      setCategories(c);
      setPromos(pr);
      setOrders(o);
      setImages(im);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setError(null);
    setMessage(null);
    try {
      await fn();
      setMessage(ok);
      await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '110px 16px 40px' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ marginBottom: 4 }}>Administration BudaKush</h1>
        <button
          style={btnGhost}
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
        >
          Se déconnecter
        </button>
      </div>
      <p style={{ color: '#555', marginTop: 0 }}>Gestion du catalogue, des commandes et des codes promo (données locales, sans base externe).</p>

      <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {(['products', 'categories', 'orders', 'promos'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ ...btnGhost, background: tab === t ? '#0f3f16' : '#fff', color: tab === t ? '#fff' : '#0f3f16' }}
          >
            {{ products: `Produits (${products.length})`, categories: `Catégories (${categories.length})`, orders: `Commandes (${orders.length})`, promos: `Codes promo (${promos.length})` }[t]}
          </button>
        ))}
        {loading && <span style={{ alignSelf: 'center', color: '#666' }}>Chargement…</span>}
      </nav>

      {error && <div style={{ ...box, borderColor: '#b3261e', color: '#b3261e' }}>{error}</div>}
      {message && <div style={{ ...box, borderColor: '#0f3f16', color: '#0f3f16' }}>{message}</div>}

      {tab === 'products' && (
        <ProductsTab
          products={products}
          categories={categories}
          images={images}
          onSave={(p, id) =>
            run(
              () => api(id ? `/api/admin/products/${id}` : '/api/admin/products', { method: id ? 'PUT' : 'POST', body: JSON.stringify(p) }),
              id ? 'Produit mis à jour' : 'Produit créé'
            )
          }
          onDelete={id => run(() => api(`/api/admin/products/${id}`, { method: 'DELETE' }), 'Produit supprimé')}
        />
      )}

      {tab === 'categories' && (
        <CategoriesTab
          categories={categories}
          images={images}
          onSave={(c, isNew) =>
            run(
              () => api(isNew ? '/api/admin/categories' : `/api/admin/categories/${c.slug}`, { method: isNew ? 'POST' : 'PUT', body: JSON.stringify(c) }),
              isNew ? 'Catégorie créée' : 'Catégorie mise à jour'
            )
          }
          onDelete={slug => run(() => api(`/api/admin/categories/${slug}`, { method: 'DELETE' }), 'Catégorie supprimée')}
        />
      )}

      {tab === 'orders' && (
        <OrdersTab
          orders={orders}
          onStatus={(id, status) =>
            run(() => api(`/api/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }), 'Statut mis à jour')
          }
        />
      )}

      {tab === 'promos' && (
        <PromosTab
          promos={promos}
          onSave={(p, isNew) =>
            run(
              () => api(isNew ? '/api/admin/promos' : `/api/admin/promos/${p.code}`, { method: isNew ? 'POST' : 'PUT', body: JSON.stringify(p) }),
              isNew ? 'Code créé' : 'Code mis à jour'
            )
          }
          onDelete={code => run(() => api(`/api/admin/promos/${code}`, { method: 'DELETE' }), 'Code supprimé')}
        />
      )}
    </div>
  );
}

/* ---------- Produits ---------- */

const emptyProduct = (categories: StoreCategory[]): StoreProduct => ({
  id: '',
  name: '',
  description: '',
  price: 0,
  image: '',
  images: [],
  category: categories[0]?.slug || '',
  tag: '',
  rating: 4,
  reviewCount: 0,
  sku: '',
  attributes: {},
  weightOptions: [],
});

function ProductsTab({
  products,
  categories,
  images,
  onSave,
  onDelete,
}: {
  products: StoreProduct[];
  categories: StoreCategory[];
  images: string[];
  onSave: (p: StoreProduct, id?: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<StoreProduct | null>(null);
  const [isNew, setIsNew] = useState(false);

  return (
    <div style={box}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Produits</h2>
        <button style={btn} onClick={() => { setIsNew(true); setEditing(emptyProduct(categories)); }}>+ Nouveau produit</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Photo</th>
              <th style={th}>ID</th>
              <th style={th}>Nom</th>
              <th style={th}>Catégorie</th>
              <th style={th}>Prix</th>
              <th style={th}>Options de poids</th>
              <th style={th}>Tag</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={td}>{p.image && <img src={p.image} alt="" width={44} height={44} style={{ objectFit: 'cover', borderRadius: 4 }} />}</td>
                <td style={td}>{p.id}</td>
                <td style={td}>{p.name}</td>
                <td style={td}>{categories.find(c => c.slug === p.category)?.name || p.category}</td>
                <td style={td}>{fmt(p.price)}</td>
                <td style={td}>{p.weightOptions?.length ? p.weightOptions.map(w => `${w.weight} ${fmt(w.price)}`).join(' · ') : '—'}</td>
                <td style={td}>{p.tag || '—'}</td>
                <td style={{ ...td, whiteSpace: 'nowrap' }}>
                  <button style={btnGhost} onClick={() => { setIsNew(false); setEditing(p); }}>Modifier</button>{' '}
                  <button style={btnDanger} onClick={() => { if (confirm(`Supprimer « ${p.name} » ?`)) onDelete(p.id); }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductForm
          initial={editing}
          isNew={isNew}
          categories={categories}
          images={images}
          onCancel={() => setEditing(null)}
          onSubmit={p => {
            onSave(p, isNew ? undefined : p.id);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ProductForm({
  initial,
  isNew,
  categories,
  images,
  onCancel,
  onSubmit,
}: {
  initial: StoreProduct;
  isNew: boolean;
  categories: StoreCategory[];
  images: string[];
  onCancel: () => void;
  onSubmit: (p: StoreProduct) => void;
}) {
  const [form, setForm] = useState<StoreProduct>(initial);
  const [attrs, setAttrs] = useState<{ k: string; v: string }[]>(
    Object.entries(initial.attributes || {}).map(([k, v]) => ({ k, v }))
  );

  const set = <K extends keyof StoreProduct>(key: K, value: StoreProduct[K]) => setForm(f => ({ ...f, [key]: value }));

  const toggleGallery = (src: string) =>
    set('images', form.images.includes(src) ? form.images.filter(x => x !== src) : [...form.images, src]);

  const setWeight = (i: number, patch: Partial<StoreWeightOption>) =>
    set('weightOptions', (form.weightOptions || []).map((w, idx) => (idx === i ? { ...w, ...patch } : w)));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const attributes = Object.fromEntries(attrs.filter(a => a.k.trim()).map(a => [a.k.trim(), a.v]));
    const gallery = form.images.length ? form.images : form.image ? [form.image] : [];
    onSubmit({
      ...form,
      price: Number(form.price),
      rating: Number(form.rating) || 0,
      reviewCount: Number(form.reviewCount) || 0,
      images: gallery,
      image: form.image || gallery[0] || '',
      tag: form.tag || undefined,
      attributes,
      weightOptions: (form.weightOptions || []).map(w => ({ weight: w.weight, price: Number(w.price) })),
    });
  };

  return (
    <Modal title={isNew ? 'Nouveau produit' : `Modifier : ${initial.name}`} onClose={onCancel}>
      <form onSubmit={submit}>
        {!isNew && <p style={{ fontSize: 13, color: '#666' }}>ID : {initial.id}</p>}

        <label style={label}>Nom *</label>
        <input style={input} required value={form.name} onChange={e => set('name', e.target.value)} />

        <label style={label}>Description</label>
        <textarea style={{ ...input, minHeight: 80 }} value={form.description} onChange={e => set('description', e.target.value)} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <div>
            <label style={label}>Catégorie *</label>
            <select style={input} required value={form.category} onChange={e => set('category', e.target.value)}>
              {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Prix de base (€) *</label>
            <input style={input} type="number" min={0} step="0.01" required value={form.price} onChange={e => set('price', e.target.value as unknown as number)} />
          </div>
          <div>
            <label style={label}>Tag</label>
            <select style={input} value={form.tag || ''} onChange={e => set('tag', e.target.value)}>
              {TAG_OPTIONS.map(t => <option key={t} value={t}>{t || '— aucun —'}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>SKU</label>
            <input style={input} value={form.sku || ''} onChange={e => set('sku', e.target.value)} />
          </div>
          <div>
            <label style={label}>Note (sur 5)</label>
            <input style={input} type="number" min={0} max={5} step="0.1" value={form.rating} onChange={e => set('rating', e.target.value as unknown as number)} />
          </div>
          <div>
            <label style={label}>Nombre d&apos;avis</label>
            <input style={input} type="number" min={0} value={form.reviewCount || 0} onChange={e => set('reviewCount', e.target.value as unknown as number)} />
          </div>
        </div>

        <label style={label}>Photo principale</label>
        <ImagePicker value={form.image} images={images} onChange={v => set('image', v)} />

        <label style={label}>Galerie (plusieurs photos)</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8, maxHeight: 220, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 6, padding: 8 }}>
          {images.map(src => (
            <label key={src} style={{ fontSize: 11, cursor: 'pointer', textAlign: 'center' }}>
              <img src={src} alt="" width={80} height={60} style={{ objectFit: 'cover', borderRadius: 4, outline: form.images.includes(src) ? '3px solid #f5c518' : 'none' }} />
              <div>
                <input type="checkbox" checked={form.images.includes(src)} onChange={() => toggleGallery(src)} /> {src.split('/').pop()}
              </div>
            </label>
          ))}
        </div>

        <label style={label}>Options de poids / contenance</label>
        {(form.weightOptions || []).map((w, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input style={input} placeholder="Ex. 3g" value={w.weight} onChange={e => setWeight(i, { weight: e.target.value })} />
            <input style={input} type="number" min={0} step="0.01" placeholder="Prix €" value={w.price} onChange={e => setWeight(i, { price: e.target.value as unknown as number })} />
            <button type="button" style={btnDanger} onClick={() => set('weightOptions', (form.weightOptions || []).filter((_, idx) => idx !== i))}>×</button>
          </div>
        ))}
        <button type="button" style={btnGhost} onClick={() => set('weightOptions', [...(form.weightOptions || []), { weight: '', price: 0 }])}>+ Ajouter une option</button>

        <label style={label}>Caractéristiques (ex. Taux de CBD : 18%)</label>
        {attrs.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input style={input} placeholder="Nom" value={a.k} onChange={e => setAttrs(list => list.map((x, idx) => (idx === i ? { ...x, k: e.target.value } : x)))} />
            <input style={input} placeholder="Valeur" value={a.v} onChange={e => setAttrs(list => list.map((x, idx) => (idx === i ? { ...x, v: e.target.value } : x)))} />
            <button type="button" style={btnDanger} onClick={() => setAttrs(list => list.filter((_, idx) => idx !== i))}>×</button>
          </div>
        ))}
        <button type="button" style={btnGhost} onClick={() => setAttrs(list => [...list, { k: '', v: '' }])}>+ Ajouter une caractéristique</button>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <button type="button" style={btnGhost} onClick={onCancel}>Annuler</button>
          <button type="submit" style={btn}>Enregistrer</button>
        </div>
      </form>
    </Modal>
  );
}

function ImagePicker({ value, images, onChange }: { value: string; images: string[]; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      {value && <img src={value} alt="" width={64} height={64} style={{ objectFit: 'cover', borderRadius: 6 }} />}
      <select style={input} value={value} onChange={e => onChange(e.target.value)}>
        <option value="">— choisir une image —</option>
        {images.map(src => <option key={src} value={src}>{src}</option>)}
      </select>
    </div>
  );
}

/* ---------- Catégories ---------- */

function CategoriesTab({
  categories,
  images,
  onSave,
  onDelete,
}: {
  categories: StoreCategory[];
  images: string[];
  onSave: (c: StoreCategory, isNew: boolean) => void;
  onDelete: (slug: string) => void;
}) {
  const [editing, setEditing] = useState<StoreCategory | null>(null);
  const [isNew, setIsNew] = useState(false);

  return (
    <div style={box}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Catégories</h2>
        <button style={btn} onClick={() => { setIsNew(true); setEditing({ slug: '', name: '', description: '', image: '' }); }}>+ Nouvelle catégorie</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>Identifiant</th>
            <th style={th}>Nom</th>
            <th style={th}>Description</th>
            <th style={th}>Image</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.slug}>
              <td style={td}><code>{c.slug}</code></td>
              <td style={td}>{c.name}</td>
              <td style={td}>{c.description}</td>
              <td style={td}>{c.image && <img src={c.image} alt="" width={44} height={44} style={{ objectFit: 'cover', borderRadius: 4 }} />}</td>
              <td style={{ ...td, whiteSpace: 'nowrap' }}>
                <button style={btnGhost} onClick={() => { setIsNew(false); setEditing(c); }}>Modifier</button>{' '}
                <button style={btnDanger} onClick={() => { if (confirm(`Supprimer la catégorie « ${c.name} » ?`)) onDelete(c.slug); }}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <Modal title={isNew ? 'Nouvelle catégorie' : `Modifier : ${editing.name}`} onClose={() => setEditing(null)}>
          <form
            onSubmit={e => {
              e.preventDefault();
              onSave(editing, isNew);
              setEditing(null);
            }}
          >
            <label style={label}>Nom *</label>
            <input style={input} required value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
            {isNew && (
              <>
                <label style={label}>Identifiant (URL, ex. fleurs-premium) *</label>
                <input style={input} required value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} />
              </>
            )}
            <label style={label}>Description</label>
            <textarea style={{ ...input, minHeight: 70 }} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
            <label style={label}>Image</label>
            <ImagePicker value={editing.image} images={images} onChange={v => setEditing({ ...editing, image: v })} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
              <button type="button" style={btnGhost} onClick={() => setEditing(null)}>Annuler</button>
              <button type="submit" style={btn}>Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Commandes ---------- */

function OrdersTab({ orders, onStatus }: { orders: StoreOrder[]; onStatus: (id: string, status: OrderStatus) => void }) {
  return (
    <div style={box}>
      <h2 style={{ marginTop: 0 }}>Commandes</h2>
      {orders.length === 0 ? (
        <p>Aucune commande pour le moment. Les commandes de démo apparaissent ici.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Date</th>
                <th style={th}>N°</th>
                <th style={th}>Client</th>
                <th style={th}>Articles</th>
                <th style={th}>Livraison</th>
                <th style={th}>Remise</th>
                <th style={th}>Total</th>
                <th style={th}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={td}>{new Date(o.createdAt).toLocaleString('fr-FR')}</td>
                  <td style={td}><code>{o.id}</code></td>
                  <td style={td}>
                    {o.customer.name}
                    <div style={{ fontSize: 12, color: '#666' }}>{o.customer.email}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{o.shippingAddress.street}, {o.shippingAddress.postalCode} {o.shippingAddress.city}</div>
                  </td>
                  <td style={td}>
                    {o.items.map((i, idx) => (
                      <div key={idx}>{i.quantity} × {i.name}{i.weight ? ` (${i.weight})` : ''}{i.isSample ? ' (offert)' : ''}</div>
                    ))}
                  </td>
                  <td style={td}>{fmt(o.shipping)}</td>
                  <td style={td}>{o.discount > 0 ? `-${fmt(o.discount)}${o.promoCode ? ` (${o.promoCode})` : ''}` : '—'}</td>
                  <td style={td}><strong>{fmt(o.total)}</strong></td>
                  <td style={td}>
                    <select style={input} value={o.status} onChange={e => onStatus(o.id, e.target.value as OrderStatus)}>
                      {(Object.keys(STATUS_LABELS) as OrderStatus[]).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Codes promo ---------- */

function PromosTab({
  promos,
  onSave,
  onDelete,
}: {
  promos: StorePromo[];
  onSave: (p: StorePromo, isNew: boolean) => void;
  onDelete: (code: string) => void;
}) {
  const [editing, setEditing] = useState<{ code: string; discount_percent: number; min_order_amount: number; expires: string } | null>(null);
  const [isNew, setIsNew] = useState(false);

  return (
    <div style={box}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Codes promo</h2>
        <button style={btn} onClick={() => { setIsNew(true); setEditing({ code: '', discount_percent: 10, min_order_amount: 0, expires: '' }); }}>+ Nouveau code</button>
      </div>
      {promos.length === 0 ? (
        <p>Aucun code promo. Créez-en un avec le bouton ci-dessus.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Code</th>
              <th style={th}>Remise</th>
              <th style={th}>Commande minimum</th>
              <th style={th}>Expire le</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {promos.map(p => (
              <tr key={p.code}>
                <td style={td}><code>{p.code}</code></td>
                <td style={td}>{p.discount_percent} %</td>
                <td style={td}>{fmt(p.min_order_amount)}</td>
                <td style={td}>{p.expires_at ? new Date(p.expires_at).toLocaleDateString('fr-FR') : 'Jamais'}</td>
                <td style={{ ...td, whiteSpace: 'nowrap' }}>
                  <button style={btnGhost} onClick={() => { setIsNew(false); setEditing({ code: p.code, discount_percent: p.discount_percent, min_order_amount: p.min_order_amount, expires: p.expires_at ? p.expires_at.slice(0, 10) : '' }); }}>Modifier</button>{' '}
                  <button style={btnDanger} onClick={() => { if (confirm(`Supprimer le code ${p.code} ?`)) onDelete(p.code); }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <Modal title={isNew ? 'Nouveau code promo' : `Modifier ${editing.code}`} onClose={() => setEditing(null)}>
          <form
            onSubmit={e => {
              e.preventDefault();
              onSave(
                {
                  code: editing.code.trim().toUpperCase(),
                  discount_percent: Number(editing.discount_percent),
                  min_order_amount: Number(editing.min_order_amount) || 0,
                  expires_at: editing.expires ? new Date(editing.expires).toISOString() : null,
                },
                isNew
              );
              setEditing(null);
            }}
          >
            <label style={label}>Code *</label>
            <input style={input} required disabled={!isNew} value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value.toUpperCase() })} />
            <label style={label}>Remise (%) *</label>
            <input style={input} type="number" min={1} max={100} required value={editing.discount_percent} onChange={e => setEditing({ ...editing, discount_percent: e.target.value as unknown as number })} />
            <label style={label}>Commande minimum (€)</label>
            <input style={input} type="number" min={0} step="0.01" value={editing.min_order_amount} onChange={e => setEditing({ ...editing, min_order_amount: e.target.value as unknown as number })} />
            <label style={label}>Date d&apos;expiration (vide = jamais)</label>
            <input style={input} type="date" value={editing.expires} onChange={e => setEditing({ ...editing, expires: e.target.value })} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
              <button type="button" style={btnGhost} onClick={() => setEditing(null)}>Annuler</button>
              <button type="submit" style={btn}>Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Fenêtre modale ---------- */

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 20, overflowY: 'auto', zIndex: 1000 }}
    >
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 10, padding: 22, width: '100%', maxWidth: 720, marginTop: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ ...btnGhost, padding: '4px 10px' }}>✕</button>
        </div>
        <div style={{ marginTop: 8 }}>{children}</div>
      </div>
    </div>
  );
}
