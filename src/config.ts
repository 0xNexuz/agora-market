// Everything the experiment depends on lives here, so the flag, variant and
// event names match what you create in the Flagsmith dashboard.

/** Client-side environment key for real shoppers (safe to ship to browsers). */
export const ENV_KEY: string = import.meta.env.VITE_FLAGSMITH_ENV_KEY ?? '';

/**
 * Optional second environment for simulated traffic, so simulated shoppers
 * never mix with real ones. Falls back to the main environment if unset.
 */
export const SIM_ENV_KEY: string = import.meta.env.VITE_FLAGSMITH_SIM_ENV_KEY || ENV_KEY;

/** Multivariate flag that holds the two order flows. */
export const FLAG = 'agora_order_flow';

/** Flag values. `control` is the flag's own value; `whatsapp` is the keyed variation. */
export const VARIANTS = {
  cart: 'control',
  whatsapp: 'whatsapp',
} as const;

/** Conversion event: the shopper starts an order (Paystack checkout or WhatsApp tap). */
export const ORDER_STARTED = 'order_started';

/** Secondary event, control only: the shopper put the bag in the cart. */
export const ADD_TO_CART = 'add_to_cart';

export const PRODUCT = {
  name: 'Ankara Tote Bag',
  maker: 'Hand-sewn in Benin City',
  price: 18500,
  delivery: 2000,
};

export const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;
