# Agora Market: WhatsApp vs cart, an A/B test with Flagsmith

Entry for **Toggle Wars: The Flagsmith Experimentation Hackathon** (WeMakeDevs), **Track 01: Test Something Real**.

## The question

Many small Nigerian online shops sell through WhatsApp chats, not checkout carts. Shop owners keep asking whether a
"proper" website checkout is worth it. This project tests that one question on a real product page:

> **Hypothesis:** On a Nigerian product page, a single **Order on WhatsApp** button gets more shoppers to start an
> order than the usual **Add to cart → Pay with Paystack** flow, because it is one tap instead of two and lets
> shoppers talk to a person before paying.

| | Control (`control`) | Variation (`whatsapp`) |
|---|---|---|
| Order flow | Add to bag → bag drawer → Checkout with Paystack → delivery details | Order on WhatsApp (opens a pre-filled chat for that piece and size) |
| Counts as an order started | Tap **Checkout with Paystack** in the bag | Tap **Order on WhatsApp** |

Everything else is identical for both groups: the same 24-piece catalogue, the rail, the product views, prices and
delivery fee.

## The shop

- **The rail:** all 24 pieces hang on a clothing rail. Hover to turn a piece to face you, drag a hanger sideways to
  move it along the rail (Shift + arrow keys on a keyboard), click to inspect it.
- **Inspect:** front and back views, size picker, and the order button for the shopper's variation.
- **Collection:** grid of every piece with category filters.
- **Bag and checkout (control only):** quantities, subtotal, delivery and total are computed from the bag. The
  delivery form stays in the browser and is not sent anywhere.
- The garments and the hero artwork are drawn in SVG for this project. The catalogue is a demo: no payments are
  taken and nothing is delivered, and the page says so.

- **Flag:** `agora_order_flow`, multivariate. Flag value `control` = cart flow, keyed variation `whatsapp` = WhatsApp flow
- **Metric:** `order_started`, occurrence, higher is better. It fires early in a visit, so four days of data is enough
- **Split:** 100% of shoppers enrolled, 50 / 50
- **Secondary event:** `add_to_cart` (control only), to see where the bag flow loses people

## How Flagsmith is used

- `getExperimentFlag('agora_order_flow')` picks the order flow and records the **exposure** at the moment the flow is
  shown ([src/flagsmith.ts](src/flagsmith.ts))
- Each browser gets a stable identity (`shopper_<uuid>`), so exposures and conversions join per shopper
- `trackEvent('order_started')` fires on the conversion tap, then `flushEvents()` sends it before the shopper leaves
  (for WhatsApp the chat opens in a new tab)
- Flagsmith Experimentation's Bayesian engine reports lift and win probability, and the winner is rolled out with the
  same flag, with no redeploy

## Traffic

Two sources, kept honest:

1. **Real shoppers:** the store page is shared on WhatsApp and X. These visits are the ones that answer the question.
2. **Traffic lab (`/lab`):** simulated shoppers, each a fresh Flagsmith identity, sent through the live experiment.
   The conversion rates are **assumptions set with sliders on the page**, so the lab proves the pipeline works end to
   end. It does not prove which flow is better. Set `VITE_FLAGSMITH_SIM_ENV_KEY` to send lab traffic to a separate
   environment, so it never mixes with real shoppers.

## Results

_To be filled in from the Flagsmith experiment page at the end of the hackathon: shoppers per variation, orders
started, lift, credible interval and win probability, and the decision taken._

## Run it locally

```bash
npm install
cp .env.example .env   # paste your client-side environment key
npm run dev
```

Without a key the page runs in preview mode and tracks nothing. Add `?variant=whatsapp` or `?variant=control` to the
URL to see each flow.

## Set up the experiment in Flagsmith

1. Create a project and an environment on [Flagsmith Cloud](https://app.flagsmith.com) and connect the managed
   warehouse for experiments.
2. Create the multivariate flag `agora_order_flow`, enabled, with value `control`, and add a variation with value
   `whatsapp` and key `whatsapp` (a variation without a key records no exposures).
3. Create the metric `order_started`: occurrence, direction up.
4. Create the experiment on `agora_order_flow` with the hypothesis above, 100% rollout, 50% to `whatsapp`, and
   `order_started` as the metric. Start it.
5. Put the environment's **client-side** key in `VITE_FLAGSMITH_ENV_KEY` (in `.env` locally, in the Vercel project
   settings when deployed).

## Stack

Vite, React and TypeScript, the `@flagsmith/flagsmith` JavaScript SDK (12.6), deployed on Vercel.
