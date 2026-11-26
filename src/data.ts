export type Shape = 'tee' | 'crew' | 'hoodie' | 'shirt' | 'jacket' | 'kaftan' | 'tote';
export type Pattern = 'plain' | 'wax' | 'adire' | 'stripe';
export type Category = 'Tees' | 'Shirts & Kaftans' | 'Hoodies & Jackets' | 'Bags';

export type Product = {
  id: string;
  name: string;
  category: Category;
  shape: Shape;
  pattern: Pattern;
  /** main cloth colour */
  color: string;
  /** second colour for patterns and trims */
  accent: string;
  price: number;
  blurb: string;
  facts: string[];
  print?: string;
};

export const CATEGORIES: Category[] = ['Tees', 'Shirts & Kaftans', 'Hoodies & Jackets', 'Bags'];
export const SIZES = ['S', 'M', 'L', 'XL'] as const;
export const DELIVERY = 2000;

const p = (
  id: string,
  name: string,
  category: Category,
  shape: Shape,
  pattern: Pattern,
  color: string,
  accent: string,
  price: number,
  blurb: string,
  facts: string[],
  print?: string,
): Product => ({ id, name, category, shape, pattern, color, accent, price, blurb, facts, print });

// Demo catalogue for the experiment. Prices are in naira.
export const PRODUCTS: Product[] = [
  p('tee-bone', 'Heavyweight Tee · Bone', 'Tees', 'tee', 'plain', '#e9e2d3', '#1b1b1b', 14500,
    'Thick cotton tee with a boxy cut that holds its shape after washing.', ['240 gsm cotton', 'Boxy fit', 'Ribbed collar']),
  p('tee-agora', 'Graphic Tee · Agora', 'Tees', 'tee', 'plain', '#1b1b1b', '#f4efe6', 16000,
    'Black tee with the Agora wordmark screen-printed across the chest.', ['200 gsm cotton', 'Regular fit', 'Screen print'], 'AGORA'),
  p('tee-ochre', 'Oversized Tee · Ochre', 'Tees', 'tee', 'plain', '#d9962a', '#1b1b1b', 15500,
    'Dropped shoulders and a longer body, in a warm ochre dye.', ['220 gsm cotton', 'Oversized fit', 'Garment dyed']),
  p('tee-adire', 'Adire Tee · Indigo', 'Tees', 'tee', 'adire', '#22386b', '#dfe7f5', 18000,
    'Tie-dyed in the adire style, so no two come out the same.', ['200 gsm cotton', 'Regular fit', 'Hand dyed']),
  p('tee-stripe', 'Breton Tee · Ink Stripe', 'Tees', 'tee', 'stripe', '#f4efe6', '#1b1b1b', 15000,
    'Classic ink stripes on off-white cotton.', ['200 gsm cotton', 'Regular fit', 'Yarn-dyed stripe']),

  p('shirt-sky', 'Oxford Shirt · Sky', 'Shirts & Kaftans', 'shirt', 'plain', '#a9c8ea', '#ffffff', 24000,
    'Pale blue oxford with a button-down collar and chest pocket.', ['Oxford cotton', 'Button-down collar', 'Chest pocket']),
  p('shirt-ankara', 'Ankara Shirt · Sunset', 'Shirts & Kaftans', 'shirt', 'wax', '#e4572e', '#1f3a5f', 22500,
    'Wax-print shirt for owambe weekends and Friday at the office.', ['Cotton wax print', 'Relaxed fit', 'Chest pocket']),
  p('shirt-sand', 'Linen Shirt · Sand', 'Shirts & Kaftans', 'shirt', 'plain', '#d8c6a5', '#ffffff', 26000,
    'Light linen that stays cool through harmattan dust and April heat.', ['Linen blend', 'Relaxed fit', 'Shell buttons']),
  p('shirt-forest', 'Camp Shirt · Forest', 'Shirts & Kaftans', 'shirt', 'plain', '#1f5c3d', '#ffffff', 21000,
    'Deep green camp shirt with a soft open collar.', ['Cotton poplin', 'Boxy fit', 'Chest pocket']),
  p('shirt-adire', 'Adire Shirt · Indigo', 'Shirts & Kaftans', 'shirt', 'adire', '#22386b', '#dfe7f5', 25000,
    'Indigo adire shirt, dyed in small batches.', ['Cotton', 'Relaxed fit', 'Hand dyed']),
  p('kaftan-white', 'Kaftan · White', 'Shirts & Kaftans', 'kaftan', 'plain', '#f6f3ec', '#b98a55', 32000,
    'Long white kaftan with tonal embroidery at the neck.', ['Cotton cashmere blend', 'Knee length', 'Embroidered neck']),
  p('kaftan-indigo', 'Kaftan · Indigo', 'Shirts & Kaftans', 'kaftan', 'plain', '#22386b', '#d9962a', 34000,
    'Deep indigo kaftan with gold thread at the neck.', ['Cotton cashmere blend', 'Knee length', 'Embroidered neck']),

  p('hoodie-heather', 'Hoodie · Heather', 'Hoodies & Jackets', 'hoodie', 'plain', '#a9abb0', '#ffffff', 28000,
    'Heavy fleece hoodie with a deep hood and front pocket.', ['400 gsm fleece', 'Regular fit', 'Kangaroo pocket']),
  p('hoodie-forest', 'Hoodie · Forest', 'Hoodies & Jackets', 'hoodie', 'plain', '#1f5c3d', '#ffffff', 28000,
    'The same heavy hoodie in forest green.', ['400 gsm fleece', 'Regular fit', 'Kangaroo pocket']),
  p('hoodie-brick', 'Hoodie · Brick', 'Hoodies & Jackets', 'hoodie', 'plain', '#b5452c', '#ffffff', 28000,
    'The same heavy hoodie in brick red.', ['400 gsm fleece', 'Regular fit', 'Kangaroo pocket']),
  p('crew-lilac', 'Crewneck · Lilac', 'Hoodies & Jackets', 'crew', 'plain', '#c3a6e0', '#ffffff', 23000,
    'Soft crewneck sweatshirt in washed lilac.', ['350 gsm fleece', 'Regular fit', 'Ribbed cuffs']),
  p('jacket-slate', 'Chore Jacket · Slate', 'Hoodies & Jackets', 'jacket', 'plain', '#3f536b', '#d8c6a5', 45000,
    'Canvas work jacket with patch pockets and corozo buttons.', ['Cotton canvas', 'Boxy fit', 'Two patch pockets']),
  p('jacket-ankara', 'Ankara Bomber · Teal', 'Hoodies & Jackets', 'jacket', 'wax', '#127a6e', '#f4c542', 48000,
    'Wax-print bomber, lined in black cotton.', ['Cotton wax print', 'Lined', 'Two patch pockets']),

  p('tote-ankara', 'Ankara Tote · Sunset', 'Bags', 'tote', 'wax', '#e8742a', '#1f3a5f', 18500,
    'Wax-print tote, lined, with a zip pocket for phone and keys.', ['Cotton wax print', 'Lined', 'Fits a 15-inch laptop']),
  p('tote-canvas', 'Canvas Tote · Natural', 'Bags', 'tote', 'plain', '#e9e2d3', '#1b1b1b', 9500,
    'Plain heavy canvas tote for the market run.', ['Heavy canvas', 'Unlined', 'Long handles']),
  p('tote-adire', 'Adire Tote · Indigo', 'Bags', 'tote', 'adire', '#22386b', '#dfe7f5', 17000,
    'Hand-dyed adire tote with reinforced handles.', ['Cotton', 'Lined', 'Hand dyed']),
  p('tote-black', 'Market Tote · Black', 'Bags', 'tote', 'plain', '#1b1b1b', '#f4efe6', 11000,
    'Black canvas tote with a flat base.', ['Heavy canvas', 'Flat base', 'Long handles']),
  p('tote-kraft', 'Shopper · Kraft', 'Bags', 'tote', 'plain', '#c79a63', '#ffffff', 8500,
    'Kraft-brown cotton shopper that folds flat.', ['Cotton twill', 'Unlined', 'Folds flat']),
  p('tote-stripe', 'Beach Tote · Ink Stripe', 'Bags', 'tote', 'stripe', '#f4efe6', '#1b1b1b', 12500,
    'Striped tote big enough for a towel and a flask.', ['Heavy canvas', 'Unlined', 'Wide opening']),
];

export const needsSize = (product: Product) => product.shape !== 'tote';
