import { useEffect, useMemo, useRef, useState } from 'react';
import { ADD_TO_CART, ORDER_STARTED, VARIANTS, naira } from './config';
import { CATEGORIES, DELIVERY, PRODUCTS, SIZES, needsSize, type Category, type Product } from './data';
import { assignShopper, track, type Assignment } from './flagsmith';
import { Garment } from './Garment';
import { HeroArt } from './Hero';

type Line = { id: string; size: string; qty: number };
type Panel = null | 'bag' | 'details' | 'done';

const BAG_KEY = 'agora_bag';
const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

function loadBag(): Line[] {
  try {
    const raw = JSON.parse(localStorage.getItem(BAG_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((l) => byId.has(l?.id) && l.qty > 0) : [];
  } catch {
    return [];
  }
}

const whatsappLink = (product: Product, size: string) => {
  const sizeText = needsSize(product) ? `, size ${size}` : '';
  const text =
    `Hello Agora Market, I'd like to order the ${product.name}${sizeText} (${naira(product.price)}). ` +
    `Please send delivery details.`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

export function Store() {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [order, setOrder] = useState<string[]>(() => PRODUCTS.map((p) => p.id));
  const [filter, setFilter] = useState<'All' | Category>('All');
  const [openId, setOpenId] = useState<string | null>(null);
  const [back, setBack] = useState(false);
  const [size, setSize] = useState<string>('M');
  const [bag, setBag] = useState<Line[]>(loadBag);
  const [panel, setPanel] = useState<Panel>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [buyer, setBuyer] = useState('');
  const drag = useRef<{ id: string; startX: number; startIndex: number; moved: boolean } | null>(null);

  const isWhatsApp = assignment?.variant === VARIANTS.whatsapp;
  const isCart = assignment?.variant === VARIANTS.cart;
  const open = openId ? byId.get(openId)! : null;

  useEffect(() => {
    let cancelled = false;
    assignShopper().then((a) => !cancelled && setAssignment(a));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(BAG_KEY, JSON.stringify(bag));
    } catch {
      // storage blocked: the bag just lasts for this visit
    }
  }, [bag]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (panel) setPanel(null);
      else setOpenId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panel]);

  const lines = useMemo(
    () => bag.map((l) => ({ ...l, product: byId.get(l.id)! })).filter((l) => l.product),
    [bag],
  );
  const pieces = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0);
  const total = subtotal + (pieces ? DELIVERY : 0);
  const shown = filter === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  const inspect = (id: string) => {
    setOpenId(id);
    setBack(false);
    setSize('M');
    setJustAdded(false);
    setWhatsappSent(false);
  };

  const addToBag = (product: Product, chosen: string) => {
    const s = needsSize(product) ? chosen : 'One size';
    setBag((b) => {
      const i = b.findIndex((l) => l.id === product.id && l.size === s);
      if (i === -1) return [...b, { id: product.id, size: s, qty: 1 }];
      return b.map((l, j) => (j === i ? { ...l, qty: l.qty + 1 } : l));
    });
    setJustAdded(true);
    void track(ADD_TO_CART);
  };

  const changeQty = (line: Line, by: number) =>
    setBag((b) =>
      b.map((l) => (l.id === line.id && l.size === line.size ? { ...l, qty: l.qty + by } : l)).filter((l) => l.qty > 0),
    );

  const orderOnWhatsApp = async (product: Product, chosen: string) => {
    // Open the tab first so pop-up blockers allow it, then record the event.
    window.open(whatsappLink(product, chosen), '_blank', 'noopener');
    setWhatsappSent(true);
    await track(ORDER_STARTED, product.price + DELIVERY);
  };

  const startCheckout = async () => {
    setPanel('details');
    await track(ORDER_STARTED, total);
  };

  const placeOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBuyer(String(new FormData(e.currentTarget).get('name') ?? '').trim());
    setBag([]);
    setPanel('done');
  };

  // Slide a hanger along the rail (mouse): drag sideways to reorder.
  const SLOT = 62;
  const onHangerDown = (e: React.PointerEvent, id: string) => {
    if (e.pointerType !== 'mouse') return;
    drag.current = { id, startX: e.clientX, startIndex: order.indexOf(id), moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onHangerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 10) d.moved = true;
    if (!d.moved) return;
    const target = Math.max(0, Math.min(order.length - 1, d.startIndex + Math.round(dx / SLOT)));
    setOrder((o) => {
      const from = o.indexOf(d.id);
      if (from === target) return o;
      const next = o.filter((x) => x !== d.id);
      next.splice(target, 0, d.id);
      return next;
    });
  };
  const onHangerClick = (id: string) => {
    const moved = drag.current?.moved;
    drag.current = null;
    if (!moved) inspect(id);
  };
  const onHangerKey = (e: React.KeyboardEvent, id: string) => {
    if (!e.shiftKey || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    e.preventDefault();
    setOrder((o) => {
      const from = o.indexOf(id);
      const to = Math.max(0, Math.min(o.length - 1, from + (e.key === 'ArrowLeft' ? -1 : 1)));
      const next = o.filter((x) => x !== id);
      next.splice(to, 0, id);
      return next;
    });
  };

  return (
    <div className="page">
      <header className="shopbar">
        <a className="logo" href="/">
          Agora Market
        </a>
        <nav className="nav">
          <a href="#rail">Rail</a>
          <a href="#collection">Collection</a>
        </nav>
        {isCart && (
          <button className="bag-btn" onClick={() => setPanel('bag')}>
            Bag ({pieces})
          </button>
        )}
        {isWhatsApp && <span className="bag-btn bag-btn-static">Orders on WhatsApp</span>}
        {!assignment && <span className="bag-btn bag-btn-static bag-btn-loading" aria-hidden="true" />}
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Benin City · {PRODUCTS.length} pieces on the rail</p>
          <h1>A market rail you can handle, right on the page.</h1>
          <p className="hero-sub">
            Brush along the rail, slide a hanger, lift a piece to see the back. Delivery across Nigeria,{' '}
            {naira(DELIVERY)} flat.
          </p>
          <a className="btn btn-dark hero-cta" href="#collection">
            Shop the collection
          </a>
        </div>
        <HeroArt />
      </section>

      <section className="rail-wrap" id="rail" aria-label="Clothing rail">
        <div className="rail-bar" />
        <div className="rail">
          {order.map((id) => {
            const product = byId.get(id)!;
            return (
              <button
                key={id}
                className="hanger"
                aria-label={`${product.name}, ${naira(product.price)}. Open to inspect. Shift plus arrow keys move it along the rail.`}
                onPointerDown={(e) => onHangerDown(e, id)}
                onPointerMove={onHangerMove}
                onClick={() => onHangerClick(id)}
                onKeyDown={(e) => onHangerKey(e, id)}
              >
                <Garment product={product} className="hanger-art" />
                <span className="hanger-tag">{naira(product.price)}</span>
              </button>
            );
          })}
        </div>
        <p className="rail-hint">Drag a hanger sideways to move it. Click a piece to inspect it.</p>
      </section>

      <main className="collection" id="collection">
        <div className="collection-head">
          <div>
            <p className="eyebrow">Ready to wear</p>
            <h2>Every piece on the rail</h2>
          </div>
          <div className="filters" role="tablist" aria-label="Filter by category">
            {(['All', ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={filter === c}
                className={filter === c ? 'chip chip-on' : 'chip'}
                onClick={() => setFilter(c)}
              >
                {c} ({c === 'All' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c).length})
              </button>
            ))}
          </div>
        </div>

        <div className="grid">
          {shown.map((product) => (
            <article key={product.id} className="card">
              <button className="card-shot" onClick={() => inspect(product.id)} aria-label={`Inspect ${product.name}`}>
                <Garment product={product} className="card-art" />
                <span className="card-inspect">Inspect</span>
              </button>
              <div className="card-meta">
                <span>{product.category}</span>
                <span>{naira(product.price)}</span>
              </div>
              <h3>{product.name}</h3>
              <p>{product.blurb}</p>
              {isCart && (
                <button className="btn btn-dark btn-small" onClick={() => inspect(product.id)}>
                  Add to bag
                </button>
              )}
              {isWhatsApp && (
                <button className="btn btn-whatsapp btn-small" onClick={() => inspect(product.id)}>
                  Order on WhatsApp
                </button>
              )}
            </article>
          ))}
        </div>
        {assignment?.note && <p className="dev-note">{assignment.note}</p>}
      </main>

      {open && (
        <div className="inspect" role="dialog" aria-modal="true" aria-label={open.name}>
          <button className="close" onClick={() => setOpenId(null)}>
            Close ✕
          </button>
          <div className="inspect-shot">
            <div className="string" />
            <Garment product={open} back={back} className="inspect-art" title={`${open.name}, ${back ? 'back' : 'front'}`} />
          </div>
          <div className="inspect-info">
            <p className="eyebrow">
              {open.category} · {naira(open.price)}
            </p>
            <h2>{open.name}</h2>
            <p className="inspect-blurb">{open.blurb}</p>
            <ul className="facts">
              {open.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="toggle" role="group" aria-label="View">
              <button className={!back ? 'on' : ''} onClick={() => setBack(false)}>
                Front
              </button>
              <button className={back ? 'on' : ''} onClick={() => setBack(true)}>
                Back
              </button>
            </div>
            {needsSize(open) && (
              <div className="sizes" role="group" aria-label="Size">
                <span>Size</span>
                {SIZES.map((s) => (
                  <button key={s} className={size === s ? 'on' : ''} aria-pressed={size === s} onClick={() => setSize(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="cta">
              {!assignment && <div className="cta-loading" aria-label="Loading" />}
              {isCart &&
                (justAdded ? (
                  <div className="added">
                    <span>✓ Added{needsSize(open) ? ` · size ${size}` : ''}</span>
                    <button
                      className="btn btn-dark"
                      onClick={() => {
                        setOpenId(null);
                        setPanel('bag');
                      }}
                    >
                      View bag ({pieces})
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-dark" onClick={() => addToBag(open, size)}>
                    Add to bag · {naira(open.price)}
                  </button>
                ))}
              {isWhatsApp && (
                <>
                  <button className="btn btn-whatsapp" onClick={() => orderOnWhatsApp(open, size)}>
                    Order on WhatsApp · {naira(open.price)}
                  </button>
                  <p className="cta-sub">
                    {whatsappSent
                      ? 'Your order message is ready in WhatsApp. This is a demo shop, so nothing will be delivered.'
                      : 'Chat with the seller, then pay by transfer or on delivery.'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {panel && (
        <div className="drawer-backdrop" onClick={() => setPanel(null)}>
          <aside className="drawer" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            {panel === 'bag' && (
              <>
                <div className="drawer-head">
                  <h2>Shopping bag ({pieces})</h2>
                  <button className="close-x" onClick={() => setPanel(null)} aria-label="Close">
                    ✕
                  </button>
                </div>
                {lines.length === 0 ? (
                  <p className="drawer-empty">Your bag is empty. Lift a piece off the rail to add it.</p>
                ) : (
                  <ul className="lines">
                    {lines.map((l) => (
                      <li key={l.id + l.size}>
                        <Garment product={l.product} className="line-art" />
                        <div className="line-info">
                          <strong>{l.product.name}</strong>
                          <span>{l.size}</span>
                          <div className="qty">
                            <button onClick={() => changeQty(l, -1)} aria-label={`Remove one ${l.product.name}`}>
                              −
                            </button>
                            <span>{l.qty}</span>
                            <button onClick={() => changeQty(l, 1)} aria-label={`Add one ${l.product.name}`}>
                              +
                            </button>
                          </div>
                        </div>
                        <span className="line-price">{naira(l.qty * l.product.price)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="drawer-foot">
                  <div className="sum">
                    <span>Subtotal</span>
                    <span>{naira(subtotal)}</span>
                  </div>
                  <div className="sum">
                    <span>Delivery</span>
                    <span>{naira(pieces ? DELIVERY : 0)}</span>
                  </div>
                  <div className="sum sum-total">
                    <span>Total</span>
                    <span>{naira(total)}</span>
                  </div>
                  <button className="btn btn-dark" disabled={!pieces} onClick={startCheckout}>
                    Checkout with Paystack
                  </button>
                </div>
              </>
            )}

            {panel === 'details' && (
              <form className="details" onSubmit={placeOrder}>
                <div className="drawer-head">
                  <h2>
                    <button type="button" className="back" onClick={() => setPanel('bag')} aria-label="Back to bag">
                      ←
                    </button>{' '}
                    Delivery details
                  </h2>
                  <button type="button" className="close-x" onClick={() => setPanel(null)} aria-label="Close">
                    ✕
                  </button>
                </div>
                <label>
                  Full name
                  <input name="name" required autoComplete="name" />
                </label>
                <label>
                  Phone number
                  <input name="phone" required type="tel" autoComplete="tel" placeholder="080…" />
                </label>
                <label>
                  Delivery address
                  <textarea name="address" required rows={3} autoComplete="street-address" />
                </label>
                <p className="drawer-note">
                  {pieces} {pieces === 1 ? 'piece' : 'pieces'} · {naira(total)}. Demo shop: these details stay in your
                  browser and are not sent anywhere.
                </p>
                <div className="drawer-foot">
                  <button className="btn btn-dark" type="submit">
                    Pay {naira(total)} with Paystack
                  </button>
                </div>
              </form>
            )}

            {panel === 'done' && (
              <div className="done">
                <div className="drawer-head">
                  <h2>Checkout complete</h2>
                  <button className="close-x" onClick={() => setPanel(null)} aria-label="Close">
                    ✕
                  </button>
                </div>
                <div className="done-body">
                  <div className="tick">✓</div>
                  <h3>Thank you{buyer ? `, ${buyer}` : ''}</h3>
                  <p>
                    Agora Market is a demo shop for an A/B test, so no payment was taken and nothing will be delivered.
                  </p>
                  <button className="btn btn-dark" onClick={() => setPanel(null)}>
                    Return to rail
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      <footer className="foot">Demo shop for an A/B test built with Flagsmith. No payments are taken.</footer>
    </div>
  );
}
