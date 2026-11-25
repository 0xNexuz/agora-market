import { useEffect, useState } from 'react';
import { ADD_TO_CART, ORDER_STARTED, PRODUCT, VARIANTS, naira } from './config';
import { assignShopper, track, type Assignment } from './flagsmith';
import { Tote } from './Tote';

const total = PRODUCT.price + PRODUCT.delivery;

const whatsappLink = () => {
  const text =
    `Hello Agora Market, I'd like to order the ${PRODUCT.name} (${naira(PRODUCT.price)}). ` +
    `Please send delivery details.`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

export function Store() {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [done, setDone] = useState<null | 'paystack' | 'whatsapp'>(null);

  useEffect(() => {
    let cancelled = false;
    assignShopper().then((a) => !cancelled && setAssignment(a));
    return () => {
      cancelled = true;
    };
  }, []);

  const addToCart = () => {
    setCartOpen(true);
    void track(ADD_TO_CART);
  };

  const payWithPaystack = async () => {
    await track(ORDER_STARTED, total);
    setCartOpen(false);
    setDone('paystack');
  };

  const orderOnWhatsApp = async () => {
    // Open the tab first so pop-up blockers allow it, then record the event.
    window.open(whatsappLink(), '_blank', 'noopener');
    await track(ORDER_STARTED, total);
    setDone('whatsapp');
  };

  return (
    <div className="page">
      <header className="shopbar">
        <span className="logo">Agora Market</span>
        <span className="shopbar-note">Benin City · delivery across Nigeria</span>
      </header>

      <main className="product">
        <div className="product-shot">
          <Tote />
        </div>

        <section className="product-info">
          <p className="maker">{PRODUCT.maker}</p>
          <h1>{PRODUCT.name}</h1>
          <p className="price">{naira(PRODUCT.price)}</p>
          <p className="blurb">
            Heavy cotton wax print, lined inside, with a zip pocket for your phone and keys. Big enough for a laptop
            and the market run.
          </p>
          <ul className="facts">
            <li>Benin City: delivered next day</li>
            <li>Lagos, Abuja, Port Harcourt: 2–3 days</li>
            <li>Delivery {naira(PRODUCT.delivery)} flat</li>
          </ul>

          <div className="cta">
            {!assignment && <div className="cta-loading" aria-label="Loading" />}

            {assignment?.variant === VARIANTS.cart && (
              <button className="btn btn-primary" onClick={addToCart}>
                Add to cart
              </button>
            )}

            {assignment?.variant === VARIANTS.whatsapp && (
              <>
                <button className="btn btn-whatsapp" onClick={orderOnWhatsApp}>
                  Order on WhatsApp
                </button>
                <p className="cta-sub">Chat with the seller, then pay by transfer or on delivery.</p>
              </>
            )}
          </div>

          {assignment?.note && <p className="dev-note">{assignment.note}</p>}
        </section>
      </main>

      {cartOpen && (
        <div className="sheet-backdrop" onClick={() => setCartOpen(false)}>
          <aside className="sheet" role="dialog" aria-label="Your cart" onClick={(e) => e.stopPropagation()}>
            <h2>Your cart</h2>
            <div className="line">
              <span>{PRODUCT.name}</span>
              <span>{naira(PRODUCT.price)}</span>
            </div>
            <div className="line">
              <span>Delivery</span>
              <span>{naira(PRODUCT.delivery)}</span>
            </div>
            <div className="line line-total">
              <span>Total</span>
              <span>{naira(total)}</span>
            </div>
            <button className="btn btn-primary" onClick={payWithPaystack}>
              Pay {naira(total)} with Paystack
            </button>
            <button className="btn btn-quiet" onClick={() => setCartOpen(false)}>
              Keep shopping
            </button>
          </aside>
        </div>
      )}

      {done && (
        <div className="sheet-backdrop" onClick={() => setDone(null)}>
          <aside className="sheet" role="dialog" aria-label="Order started" onClick={(e) => e.stopPropagation()}>
            <h2>{done === 'whatsapp' ? 'Your order message is ready' : 'Checkout started'}</h2>
            <p>
              Agora Market is a demo shop for an A/B test, so no payment is taken and nothing will be delivered.
              Thanks for helping the experiment.
            </p>
            <button className="btn btn-quiet" onClick={() => setDone(null)}>
              Close
            </button>
          </aside>
        </div>
      )}

      <footer className="foot">
        Demo shop for an A/B test built with Flagsmith. No payments are taken.
      </footer>
    </div>
  );
}
