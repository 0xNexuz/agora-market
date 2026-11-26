# Agora Market: WhatsApp vs cart, an A/B test with Flagsmith

Entry for **Toggle Wars: The Flagsmith Experimentation Hackathon** (WeMakeDevs), **Track 01: Test Something Real**.

**Live shop:** https://agora-market-sage.vercel.app · **Traffic lab:** https://agora-market-sage.vercel.app/lab

![Agora Market: the clothing rail and collection](docs/shop-rail.png)

## The question

Many small Nigerian online shops sell through WhatsApp chats, not checkout carts. Shop owners keep asking whether a
"proper" website checkout is worth it. This project tests that one question on a real product page:

> **Hypothesis:** On a Nigerian product page, a single **Order on WhatsApp** button gets more shoppers to start an
> order than the usual **Add to bag → Checkout with Paystack** flow, because it takes fewer taps and lets
> shoppers talk to a person before paying.

| | Control (`control`) | Variation (`whatsapp`) |
|---|---|---|
| Order flow | Add to bag → bag drawer → Checkout with Paystack → delivery details | Order on WhatsApp (opens a pre-filled chat for that piece and size) |
| Counts as an order started | Tap **Checkout with Paystack** in the bag | Tap **Order on WhatsApp** |

| Control: Add to bag | Variation: Order on WhatsApp |
|---|---|
| ![Control](docs/variant-control.png) | ![WhatsApp variation](docs/variant-whatsapp.png) |

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

- **Flag:** `agora_order_flow`, multivariate. Flag value `control` = bag flow. The variation has the value `whatsapp`
  and shows in Flagsmith under its key, `Variant_1`
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
   end. It does not prove which flow is better. Lab traffic goes to the **Development** environment
   (`VITE_FLAGSMITH_SIM_ENV_KEY`), which runs the same flag, metric and experiment, so it never mixes with the real
   shoppers in **Production**.

## Results

Two experiments run on the same flag, one per Flagsmith environment, so simulated and real shoppers never mix.

### Development: simulated shoppers (the main result)

The hackathon allows simulated traffic for Track 01, so this is the result the entry is judged on. The traffic lab
sent 600 simulated shoppers through the experiment with these assumptions, set on the lab page:

- Bag flow: 35% add to bag, and 50% of those go on to checkout, so about 17.5% start an order
- WhatsApp flow: 20% tap Order on WhatsApp

| Flagsmith reported (26 Nov 2026) | |
|---|---|
| Users enrolled | 600 |
| Leading variation | `Variant_1` (Order on WhatsApp) |
| Lift vs control | +4.4% |
| Chance to be best | 60% |

![Flagsmith results, Development](docs/flagsmith-development-results.png)

**How to read it.** The WhatsApp button is ahead, but a 60% chance to be best is only a little better than a coin
flip, and the interval in the chart runs from roughly -30% to +39%. The lab was set so that WhatsApp really is about
14% better in relative terms, and 600 shoppers was not enough for Flagsmith to see that clearly. A gap of 17.5% vs
20% needs roughly 3,800 shoppers per variation to detect reliably (80% power, 5% significance).

**Decision.** Do not roll out yet. Keep the 50 / 50 split and keep collecting. The simulation measures the
assumptions typed into the lab, so it shows the experiment working end to end and how much traffic a real answer
needs. It does not show what real shoppers prefer.

### Production: real shoppers (small test)

The live shop was opened in a few browsers to check the real path. Flagsmith enrolled 3 shoppers and both order
flows were served. That is far too few for a result, and Flagsmith shows the experiment as still collecting data.

![Flagsmith experiment running, Production](docs/flagsmith-production-running.png)

### Limits

- Agora Market is a demo shop: no payment is taken, and a tap on an order button is not a purchase.
- Each browser counts as one shopper, so the same person on two devices is counted twice.
- The catalogue and prices are written for the demo.
- The "Order on WhatsApp" button opens WhatsApp with the message filled in, but there is no real seller number.

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
   `whatsapp`. Every variation needs a key (Flagsmith names it `Variant_1` by default): a variation without a
   key records no exposures.
3. Create the metric `order_started`: occurrence, direction up.
4. Create the experiment on `agora_order_flow` with the hypothesis above, 100% rollout, 50% to `whatsapp`, and
   `order_started` as the metric. Start it.
5. Put the environment's **client-side** key in `VITE_FLAGSMITH_ENV_KEY` (in `.env` locally, in the Vercel project
   settings when deployed).
6. For the traffic lab, repeat steps 1, 3 and 4 in a second environment and put its client-side key in
   `VITE_FLAGSMITH_SIM_ENV_KEY`.

## Stack

Vite, React and TypeScript, the `@flagsmith/flagsmith` JavaScript SDK (12.6), deployed on Vercel.
