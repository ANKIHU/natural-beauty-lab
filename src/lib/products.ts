export type Product = {
  id: string;
  order: number;
  name: string;
  category: string;
  focus: string;
  price: number;
  size: string;
  vessel: string;
  desc: string;
  pitch: string;
  ingredients: [string, string][];
  howto: string;
  shelf: string;
  stock: number;
  active: boolean;
  badge: string;
  rating: number;
  reviews: number;
  /** Path to hero product photo (relative to /public). When absent, the SVG vessel illustration is used. */
  image?: string;
};

export const CATEGORIES = [
  "Cleansers",
  "Masks",
  "Oils & Serums",
  "Moisturizers",
  "Body",
  "Hair",
  "Oral Care",
  "Men's Grooming",
] as const;

export const CAT_META: Record<string, { c1: string; c2: string; ink: string }> = {
  Cleansers:       { c1: "#E9E0C9", c2: "#D9C79A", ink: "#6B5A2E" },
  Masks:           { c1: "#D4DECB", c2: "#A9BC9C", ink: "#42573D" },
  "Oils & Serums": { c1: "#EAD9C2", c2: "#B07A3F", ink: "#6E4A22" },
  Moisturizers:    { c1: "#F0E8DA", c2: "#D9CBB4", ink: "#6E6350" },
  Body:            { c1: "#E8D5BC", c2: "#C9A87C", ink: "#6E5433" },
  Hair:            { c1: "#D7E0D3", c2: "#3E5C49", ink: "#2C4335" },
  "Oral Care":     { c1: "#D8E7DD", c2: "#8FBCA1", ink: "#33604A" },
  "Men's Grooming": { c1: "#DDD8CB", c2: "#8B7355", ink: "#4A3C2A" },
};

function P(
  n: number, id: string, name: string, cat: string, focus: string,
  price: number, size: string, vessel: string, desc: string, pitch: string,
  ings: [string, string][], howto: string, shelf: string,
  extra?: Partial<Product>
): Product {
  return {
    id, order: n, name, category: cat, focus, price, size, vessel, desc, pitch,
    ingredients: ings, howto, shelf, stock: 24, active: true, badge: "",
    rating: 4.7, reviews: 38 + ((n * 37) % 140),
    ...extra,
  };
}

export const PRODUCTS: Product[] = [
  P(1,"p01","Coconut Honey Moisturizing Soap","Cleansers","Dry & normal skin",14,"120 g bar","bar",
    "Our signature bar. Simple, smells like a spa, and answers the number-one complaint about soap: dryness. Coconut oil and raw honey work together so the bar cleans without stripping your skin's natural barrier.",
    "A glycerin-rich base is superfatted with extra coconut oil, so nourishing oils are left on the skin after cleansing — while raw honey pulls moisture from the air into your skin as you shower. A moisturizer disguised as a soap.",
    [["Glycerin soap base","The foundation — provides a gentle, cleansing lather"],["Virgin coconut oil","Superfats the bar so it moisturizes as it cleans"],["Raw honey","Humectant — draws moisture to the skin"],["Lavender essential oil","Calming scent with natural antiseptic properties"]],
    "Lather between wet hands or on a cloth, massage over damp skin, rinse warm. Keep the bar on a draining dish between uses.",
    "12 months unopened; keep dry between uses.",{badge:"bestseller",rating:4.9,image:"/products/p01-coconut-honey-soap.jpg"}),
  P(2,"p02","Gentle Oat Face Cleanser","Cleansers","Sensitive skin",22,"100 g jar","jar",
    "The ultimate sensitive-skin cleanser: no detergents, no sulfates, no essential oils — safe for even the most reactive skin.",
    "A fresh, spa-style formulation. Oats contain saponins — nature's own cleansers — while lactic acid from live yogurt cultures softly dissolves dead surface cells without a single harsh ingredient.",
    [["Colloidal oats","Saponin-rich — gently lifts away dirt and soothes"],["Raw honey","Antibacterial humectant that keeps skin soft"],["Live yogurt cultures","Lactic acid gently dissolves dead skin cells"]],
    "Mix a teaspoon with warm water in your palm to form a soft paste. Massage over the face for one minute, rinse, pat dry.",
    "Fresh formulation — refrigerate and use within 7 days.",{image:"/products/p02-gentle-oat-cleanser.jpg"}),
  P(3,"p03","The Clarity Mask","Masks","Oily & acne-prone skin",28,"90 g jar","jar",
    "Designed to draw impurities to the surface, absorb excess oil and calm inflammation — the go-to treatment for congested skin and hormonal breakouts.",
    "Bentonite clay carries a negative charge that binds to impurities and lifts them out of the pore, while tea tree calms active blemishes.",
    [["Bentonite clay","Draws impurities and excess oil from the pores"],["Activated charcoal","Deep-cleans congested skin"],["Tea tree essential oil","Calms and clarifies active breakouts"],["Witch hazel","Natural toner that tightens the look of pores"]],
    "Apply a thin, even layer to clean skin, avoiding the eye area. Leave 10–12 minutes — never let it fully crack-dry — then rinse with warm water. Use 1–2 times weekly.",
    "9 months; keep water out of the jar.",{image:"/products/p03-clarity-mask.jpg"}),
  P(4,"p04","The Brightening Mask","Masks","Hyperpigmentation & dullness",30,"90 g jar","jar",
    "Targets dark spots, sun damage and uneven tone using natural sources of vitamin C and fruit enzymes that gently resurface the skin.",
    "Fruit enzymes dissolve the dull surface layer while botanical vitamin C brightens the skin beneath — resurfacing without scrubbing.",
    [["Papaya enzyme","Gently dissolves dull surface cells"],["Botanical vitamin C","Brightens and helps fade dark spots"],["Turmeric","Traditional brightener that calms inflammation"],["Raw honey","Hydrates while the actives work"]],
    "Apply to clean skin for 10 minutes, then rinse. A gentle tingle is normal; always follow with moisturizer and daily sun protection.",
    "9 months unopened.",{image:"/products/p04-brightening-mask.jpg"}),
  P(5,"p05","The Nourishing Mask","Masks","Dry & mature skin",30,"90 g jar","jar",
    "No exfoliants here — this mask's only job is to feed, hydrate and plump the skin. Perfect for winter months and for skin that has started to lose its bounce.",
    "Rich plant fats and humectants flood the skin with moisture and lipids, leaving it visibly plumped after a single use.",
    [["Avocado","Deeply nourishing fatty acids and vitamin E"],["Raw honey","Draws and holds moisture in the skin"],["Rosehip oil","Supports elasticity and skin repair"],["Oat flour","Soothes and softens as the mask sets"]],
    "Smooth a generous layer over face and neck. Relax for 15 minutes, then rinse with warm water and press the residue into damp skin.",
    "9 months unopened.",{image:"/products/p05-nourishing-mask.jpg"}),
  P(6,"p06","Turmeric Brightening Mask","Masks","Uneven tone",26,"80 g jar","jar",
    "One of the oldest beauty recipes in the world, with roots in India and Southeast Asia. It has stood the test of time for good reason: it works.",
    "Turmeric's curcumin calms redness and brightens, buffered by honey and lactic cultures so it treats the skin gently.",
    [["Turmeric","Calms inflammation and brightens tone"],["Raw honey","Antibacterial humectant"],["Live yogurt cultures","Gentle lactic-acid exfoliation"],["Chickpea flour","The traditional base that binds the mask"]],
    "Mix with a little warm water, apply for 8–10 minutes, rinse well. Use an old towel — turmeric loves to leave its mark.",
    "6 months unopened.",{image:"/products/p06-turmeric-mask.jpg"}),
  P(7,"p07","Activated Charcoal Detox Mask","Masks","Oily & congested skin",27,"90 g jar","jar",
    "The modern answer to the old-fashioned mud mask — visually striking and deeply satisfying for anyone who loves to see proof that a mask is working.",
    "Charcoal and clay pull oil and grime out of the pore while aloe keeps the skin calm and comfortable throughout.",
    [["Activated charcoal","Binds to oil and impurities"],["Bentonite clay","Deep-cleans and refines pores"],["Aloe vera","Keeps the mask soothing, never stripping"],["Peppermint oil","A clean, cooling finish"]],
    "Apply a thin layer to the T-zone or full face, leave 10 minutes, rinse. Follow with moisturizer.",
    "9 months unopened.",{image:"/products/p07-charcoal-detox-mask.jpg"}),
  P(8,"p08","The Balancing Facial Oil","Oils & Serums","Normal & combination skin",34,"30 ml dropper","dropper",
    "Your gateway facial oil — safe for most skin, a pleasure to use, and beautifully balanced between light and nourishing.",
    "Jojoba so closely mirrors the skin's own sebum that combination skin reads it as 'enough oil produced' — helping rebalance shine over time.",
    [["Jojoba oil","Mirrors skin's own sebum to rebalance oil production"],["Grapeseed oil","Featherlight, rich in linoleic acid"],["Lavender essential oil","Calms and conditions"],["Geranium essential oil","Traditional skin-balancer with a soft floral note"]],
    "Warm 3–4 drops between fingertips and press into damp skin, morning or night, as the last step of your routine.",
    "12 months; store away from direct sun.",{image:"/products/p08-balancing-facial-oil.jpg"}),
  P(9,"p09","The Anti-Aging Repair Oil","Oils & Serums","Mature skin",48,"30 ml dropper","dropper",
    "A concentrate of the most treasured repair oils in natural skincare, targeting fine lines, loss of elasticity and uneven texture.",
    "Rosehip's natural trans-retinoic acid supports renewal the gentle way, while sea buckthorn floods the skin with rare omega-7.",
    [["Rosehip seed oil","Nature's retinol-alternative for renewal"],["Argan oil","Deep nourishment and elasticity support"],["Sea buckthorn oil","Rare omega-7 for repair and glow"],["Frankincense essential oil","Time-honored for mature skin"]],
    "Press 3–5 drops into clean, damp skin nightly. Layer under night cream in dry seasons.",
    "9 months; amber glass protects the actives — keep it cool and shaded.",{badge:"new",image:"/products/p09-anti-aging-repair-oil.jpg"}),
  P(10,"p10","The Clarity Serum","Oils & Serums","Acne-prone skin",38,"30 ml dropper","dropper",
    "An oil-based serum that targets breakouts without harsh drying agents — clearing skin while respecting its barrier.",
    "High-linoleic grapeseed thins congested sebum while tea tree keeps blemish bacteria in check. Clear skin without the tight, stripped feeling.",
    [["Grapeseed oil","High-linoleic — helps decongest pores"],["Tea tree essential oil","Nature's most studied blemish-fighter"],["Lavender essential oil","Calms redness around breakouts"],["Rosemary extract","Antioxidant that keeps the formula fresh"]],
    "Smooth 2–3 drops over the whole face at night, or press onto breakout-prone zones morning and night.",
    "12 months; keep from direct sun.",{image:"/products/p10-clarity-serum.jpg"}),
  P(11,"p11","The Simple Daily Lotion","Moisturizers","Everyday moisture",24,"200 ml pump","pump",
    "The foundational moisturizer: light enough for every morning, nourishing enough that you'll never skip it.",
    "A classic cold-process emulsion of sweet almond oil and aloe — everything skin needs daily, nothing it doesn't.",
    [["Sweet almond oil","Softens and conditions"],["Aloe vera juice","Lightweight hydration"],["Plant emulsifying wax","Holds the silky texture together"],["Vitamin E","Antioxidant protection"]],
    "Massage over face and body after cleansing, morning and evening.",
    "6 months; store cool.",{image:"/products/p11-simple-daily-lotion.jpg"}),
  P(12,"p12","The Rich Night Cream","Moisturizers","Dry & mature skin",36,"60 ml jar","jar",
    "A heavier cream for dry or mature skin. Beeswax creates a protective veil that locks moisture in while you sleep.",
    "Overnight is when skin repairs itself — this cream seals in hydration and hands the skin the lipids it needs to do the work.",
    [["Beeswax","Forms a breathable, protective overnight barrier"],["Shea butter","Deep, lasting nourishment"],["Rosehip oil","Supports overnight renewal"],["Chamomile essential oil","Calms skin (and senses) before sleep"]],
    "As the last step each evening, warm a small amount and press into face and neck.",
    "9 months unopened.",{image:"/products/p12-rich-night-cream.jpg"}),
  P(13,"p13","Lightweight Gel Moisturiser","Moisturizers","Oily skin",28,"60 ml jar","jar",
    "Not everyone wants a rich cream. This water-based gel gives oily and blemish-prone skin real hydration without a trace of heaviness.",
    "Aloe and glycerin hydrate like a drink of water; green tea and cucumber keep everything cool and calm. Zero greasy afterfeel.",
    [["Aloe vera gel","Weightless, cooling hydration"],["Vegetable glycerin","Draws water into the skin"],["Cucumber extract","Soothes and refreshes"],["Green tea","Antioxidant support for stressed skin"]],
    "Apply a thin layer morning and night. Layers beautifully under sunscreen and makeup.",
    "6 months; refrigerate for an extra-cooling finish.",{image:"/products/p13-lightweight-gel-moisturiser.jpg"}),
  P(14,"p14","Whipped Body Butter","Body","Dry body skin",26,"200 g jar","jar",
    "The product that sells itself. It looks like frosting, smells like dessert, and melts into skin like magic.",
    "Triple-whipped shea and cocoa butters trap air into a cloud-light texture that melts on contact and keeps skin soft all day.",
    [["Shea butter","Deep, long-lasting moisture"],["Cocoa butter","Silky texture and a soft chocolate note"],["Virgin coconut oil","Fast-absorbing nourishment"],["Vanilla & sweet orange","The signature dessert-like scent"]],
    "Scoop a little, warm between palms, and massage into damp skin after bathing. A little goes a long way.",
    "9 months; keeps its whip best below 24 °C.",{badge:"bestseller",rating:4.9,image:"/products/p14-whipped-body-butter.jpg"}),
  P(15,"p15","Brown Sugar Body Scrub","Body","Exfoliation",22,"250 g jar","jar",
    "Warm, gentle and endlessly moreish — brown sugar polishes away rough skin while coconut oil and honey leave it glowing.",
    "Sugar crystals dissolve as you massage, so the scrub can never over-exfoliate — polish first, nourish after, all in one jar.",
    [["Brown sugar","Gentle crystals that melt as they polish"],["Virgin coconut oil","Leaves a nourished, dewy finish"],["Raw honey","Humectant that softens as you scrub"],["Cinnamon","A warm, spiced scent"]],
    "In the shower, massage over damp skin in circles, then rinse. Use 1–2 times a week; keep water out of the jar.",
    "9 months.",{image:"/products/p15-brown-sugar-scrub.jpg"}),
  P(16,"p16","Calming Magnesium Body Lotion","Body","Rest & recovery",29,"200 ml pump","pump",
    "A wellness lotion that goes beyond moisturizing — transdermal magnesium supports muscle relaxation, deeper rest and calmer evenings.",
    "Magnesium absorbed through the skin is one of the oldest recovery rituals — here it rides in a soft shea lotion with lavender for a true wind-down.",
    [["Magnesium chloride","Absorbed through skin to ease tension"],["Shea butter","Comforting, rich moisture"],["Sweet almond oil","Softens and carries the actives"],["Lavender essential oil","The classic sleep-time note"]],
    "Massage into legs, shoulders and feet 30 minutes before bed. A brief tingle on first uses is normal.",
    "6 months.",{badge:"new",image:"/products/p16-magnesium-body-lotion.jpg"}),
  P(17,"p17","Gentle Everyday Shampoo","Hair","All hair types",24,"250 ml bottle","bottle",
    "The foundational shampoo — gentle enough for daily use, effective enough to actually clean.",
    "A castile base cleans without sulfates while aloe and jojoba keep the scalp balanced instead of stripped.",
    [["Castile soap base","Plant-based, sulfate-free cleansing"],["Aloe vera","Soothes and hydrates the scalp"],["Jojoba oil","Conditions without weighing hair down"],["Rosemary essential oil","Invigorates the scalp"]],
    "Massage into wet hair and scalp, rinse thoroughly. Follow with our conditioner. Shake before use.",
    "6 months.",{image:"/products/p17-gentle-shampoo.jpg"}),
  P(18,"p18","Moisturising Hair Conditioner","Hair","Dry hair",26,"250 ml bottle","bottle",
    "A true emulsified conditioner that detangles, softens and restores slip to dry, thirsty hair.",
    "Shea and argan smooth the cuticle while marshmallow root gives the natural slip that makes detangling effortless.",
    [["Shea butter","Deep softness for dry lengths"],["Argan oil","Shine and manageability"],["Aloe vera","Lightweight moisture at the roots"],["Marshmallow root","Natural slip for easy detangling"]],
    "After shampooing, work through mid-lengths and ends, leave 2–3 minutes, rinse cool for extra shine.",
    "6 months.",{image:"/products/p18-moisturising-conditioner.jpg"}),
  P(19,"p19","Dry Shampoo Powder","Hair","Oily roots",18,"60 g shaker","pot",
    "A between-wash miracle. This silky powder absorbs oil at the roots and refreshes hair in under a minute.",
    "Arrowroot and kaolin drink up excess oil invisibly; a whisper of cocoa tints it for deeper hair tones.",
    [["Arrowroot powder","Silky oil absorption"],["Kaolin clay","Refreshes the scalp"],["Cocoa powder","Tints the blend for darker hair"],["Lavender essential oil","A clean, just-washed scent"]],
    "Sprinkle a little at the roots, wait one minute, then massage in and brush through.",
    "18 months; keep dry.",{image:"/products/p19-dry-shampoo-powder.jpg"}),
  P(20,"p20","Natural Whitening Toothpaste","Oral Care","Daily oral care",12,"100 ml tube","tube",
    "Gentle mineral abrasives and antibacterial plant oils clean teeth, freshen breath, and lift surface stains — without the harsh chemistry of commercial pastes.",
    "Calcium carbonate polishes gently below the abrasiveness of enamel, while coconut oil and peppermint keep the whole mouth fresh.",
    [["Calcium carbonate","Gentle mineral polish for surface stains"],["Baking soda","Neutralizes acids and freshens"],["Virgin coconut oil","Traditional oral-care oil"],["Peppermint essential oil","Long-lasting freshness"]],
    "Brush twice daily with a pea-sized amount. Natural pastes don't foam like commercial ones — that's the point.",
    "6 months.",{image:"/products/p20-natural-toothpaste.jpg"}),
  P(21,"p21","Herbal Hair Growth Oil","Hair","Scalp care & growth",32,"100 ml bottle","bottle",
    "Stimulating essential oils meet deeply nourishing carriers to boost circulation to the scalp and support strong, healthy growth.",
    "Rosemary is one of the most studied natural growth allies; here it's blended into black castor oil, a traditional hair treatment.",
    [["Black castor oil","The traditional classic for strength and growth"],["Rosemary essential oil","Stimulates scalp circulation"],["Peppermint essential oil","A cool, wake-up tingle"],["Jojoba oil","Lightens the blend and conditions"]],
    "Part hair and massage a few drops into the scalp 2–3 evenings a week. Leave in overnight or wash out after an hour.",
    "12 months.",{badge:"bestseller",rating:4.8,image:"/products/p21-herbal-hair-growth-oil.jpg"}),
  P(22,"p22","Deep Hydration Conditioner","Hair","Deep treatment",28,"200 g jar","jar",
    "A fresh, preservative-free treatment that delivers intense moisture. No added water means a shorter shelf life — and much deeper penetration.",
    "Because nothing dilutes it, every gram is active conditioning — a salon-depth treatment made the fresh way.",
    [["Aloe vera","The hydrating heart of the formula"],["Virgin coconut oil","Penetrates the hair shaft"],["Raw honey","Locks moisture into each strand"],["Avocado oil","Rich fatty acids for softness"]],
    "Once a week, work through damp hair, cover with a warm towel for 20–30 minutes, then shampoo lightly and rinse.",
    "Fresh formulation — refrigerate, use within 14 days.",{image:"/products/p22-deep-hydration-conditioner.jpg"}),
  P(23,"p23","Anti-Aging Serum","Oils & Serums","Mature skin",52,"30 ml dropper","dropper",
    "Our most concentrated formula: a blend of the most potent natural anti-aging ingredients available, for skin that wants visible results.",
    "Every oil in this bottle earns its place — renewal, elasticity, antioxidant defense and barrier repair in five precise drops a night.",
    [["Rosehip seed oil","Renewal and tone"],["Pomegranate seed oil","Rare punicic acid for elasticity"],["Evening primrose oil","Barrier repair for mature skin"],["Carrot seed essential oil","Antioxidant-rich glow"]],
    "Press 4–5 drops into clean skin every night. Results build over 4–6 weeks of consistent use.",
    "9 months; keep cool and shaded.",{badge:"new",rating:4.8,image:"/products/p23-anti-aging-serum.jpg"}),
  P(24,"p24","Vitamin C Brightening Serum","Oils & Serums","Dullness & dark spots",42,"30 ml dropper","dropper",
    "Vitamin C is the gold standard for brightening skin and fading dark spots. This water-based serum delivers it pure, fresh and simple.",
    "Made in micro-batches so the vitamin C reaches you at full strength — the difference is a glow you can see in the mirror.",
    [["Vitamin C (L-ascorbic acid)","The gold-standard brightener"],["Rose water","A soothing, fragrant base"],["Vegetable glycerin","Binds hydration to the skin"],["Vitamin E","Stabilizes and boosts the vitamin C"]],
    "Apply 3–4 drops to clean skin each morning before moisturizer and sun protection.",
    "Micro-batch: use within 8 weeks of opening; refrigerate.",{badge:"bestseller",rating:4.9,image:"/products/p24-vitamin-c-serum.jpg"}),
  P(25,"p25","Zinc Shield Body Butter","Body","Outdoor days",30,"120 g tin","tin",
    "A rich shea butter loaded with non-nano zinc oxide — the mineral that physically sits on the skin and reflects the sun's rays away.",
    "Note from the Lab: this is sold as a zinc body butter, not a rated sunscreen. Zinc oxide is a physical UV reflector, but this artisan formula carries no laboratory-tested SPF rating.",
    [["Non-nano zinc oxide","The mineral that physically reflects UV rays"],["Shea butter","Comfort and lasting moisture"],["Virgin coconut oil","Smooth, even application"],["Beeswax","Helps the butter stay put outdoors"]],
    "Smooth generously over exposed skin before time outdoors and reapply often — especially after water. Pair with shade and cover-ups.",
    "12 months. Not a laboratory-rated SPF product.",{image:"/products/p25-zinc-shield-body-butter.jpg"}),
  P(26,"p26","Acne Treatment Oil","Oils & Serums","Blemishes",26,"15 ml roll-on","dropper",
    "A precise spot treatment: potent where you need it, gentle everywhere else. Targets individual blemishes without drying the surrounding skin.",
    "Tea tree and black seed oil calm the blemish while jojoba stops the area from flaking — treat the spot, keep the skin.",
    [["Tea tree essential oil","Targets the blemish directly"],["Black cumin seed oil","Traditional skin-clearing powerhouse"],["Jojoba oil","Prevents the dry, flaky halo"],["Lavender essential oil","Calms redness fast"]],
    "Dab directly onto blemishes morning and night after cleansing.",
    "12 months.",{image:"/products/p26-acne-treatment-oil.jpg"}),
  P(27,"p27","Foot Repair Balm","Body","Dry, cracked heels",20,"90 g tin","tin",
    "Feet work harder than any other part of the body — and get the least care. This rich balm softens rough heels, soothes cracked skin, and smells wonderful doing it.",
    "Beeswax seals the repair in while peppermint leaves feet feeling brand new — best applied under socks overnight.",
    [["Beeswax","Seals moisture into hard-working skin"],["Shea butter","Softens rough, cracked heels"],["Peppermint essential oil","Cooling, refreshing finish"],["Tea tree essential oil","Keeps feet fresh and clear"]],
    "Massage into clean feet before bed, focusing on heels. Cotton socks overnight double the effect.",
    "12 months.",{image:"/products/p27-foot-repair-balm.jpg"}),
  // ── Men's Grooming (10 products) ──────────────────────────────────────
  P(28,"mg01","Gentle Beard & Face Wash","Men's Grooming","Beard & face cleansing",16.50,"150 ml","pump",
    "A mild daily cleanser for facial skin and beard hair. It removes oil, sweat and grooming-product residue without leaving the face or beard feeling stripped.",
    "Gently cleanses the face and beard. Helps coarse beard hair feel softer. Supports a comfortable, non-tight after-feel. Suitable for everyday use.",
    [["Aloe vera","Soothes and hydrates during cleansing"],["Colloidal oatmeal","Helps soften and condition"],["Panthenol","Supports skin comfort"],["Hydrolysed oat protein","Conditions beard hair"]],
    "Massage one or two pumps over a wet face and beard, working the cleanser through to the skin. Rinse thoroughly and pat dry.",
    "12 months.",{image:"/images/mens-grooming/53-beard-face-wash.jpg"}),
  P(29,"mg02","Cedarwood Beard Oil","Men's Grooming","Beard conditioning",18.50,"30 ml","dropper",
    "A lightweight blend of botanical oils that softens coarse facial hair, adds a controlled natural sheen and conditions the skin beneath the beard.",
    "Softens and conditions beard hair. Helps reduce a dry, flyaway appearance. Adds natural polish without a heavy finish. Conditions the skin beneath the beard.",
    [["Jojoba oil","Mirrors skin's natural sebum"],["Argan oil","Adds softness and sheen"],["Squalane","Lightweight conditioning"],["Hemp seed oil","Balances without heaviness"],["Black cumin seed oil","Rich in essential fatty acids"],["Bisabolol","Helps soothe the skin beneath"]],
    "Warm two to five drops between the palms. Massage through a slightly damp beard and into the skin, then comb into shape.",
    "12 months.",{image:"/images/mens-grooming/54-cedarwood-beard-oil.jpg"}),
  P(30,"mg03","Conditioning Beard Balm","Men's Grooming","Beard styling & conditioning",17.50,"60 g","tin",
    "A butter-rich styling balm that conditions coarse beard hair, controls stray hairs and provides flexible everyday shaping.",
    "Provides flexible, natural-looking control. Conditions coarse and dry facial hair. Helps smooth stray hairs. Adds polish without creating a hard pomade finish.",
    [["Shea butter","Deep conditioning"],["Mango butter","Softens coarse hair"],["Jojoba oil","Lightweight moisture"],["Argan oil","Adds natural sheen"],["Beeswax","Provides flexible hold"],["Candelilla wax","Plant-based shaping support"]],
    "Warm a pea-sized amount between the palms. Work through a dry or slightly damp beard and comb to distribute.",
    "12 months.",{image:"/images/mens-grooming/55-conditioning-beard-balm.jpg"}),
  P(31,"mg04","Post-Shave Soothing Gel","Men's Grooming","Post-shave comfort",14.95,"100 ml","pump",
    "A lightweight, alcohol-free and fragrance-free gel that provides cooling hydration and comfort after shaving.",
    "Provides lightweight post-shave hydration. Helps reduce a dry or tight after-feel. Leaves skin feeling cool and comfortable. Contains no added fragrance or drying alcohol.",
    [["Aloe vera","Cooling hydration"],["Cucumber hydrosol","Refreshes and soothes"],["Panthenol","Supports skin recovery"],["Niacinamide","Helps maintain a calm complexion"],["Bisabolol","Gentle comfort"],["Allantoin","Softens and conditions"]],
    "Apply a thin layer to clean, intact skin after shaving. Avoid the eyes and areas that are cut or actively irritated.",
    "12 months.",{image:"/images/mens-grooming/56-post-shave-soothing-gel.jpg"}),
  P(32,"mg05","Natural Shaving Cream","Men's Grooming","Shaving",15.50,"100 g","jar",
    "A rich, non-soap shaving cream that softens stubble and creates a protective cushion for comfortable razor glide.",
    "Improves razor glide. Helps soften stubble before shaving. Creates a rich, protective cushion. Leaves skin feeling soft after rinsing.",
    [["Shea butter","Rich protective cushion"],["Jojoba oil","Conditions during shaving"],["Aloe vera","Soothes the shave area"],["Colloidal oatmeal","Softens stubble"],["Panthenol","Supports skin comfort"]],
    "Soften stubble with warm water. Massage a thin, even layer over the shave area, shave with a clean razor and rinse thoroughly.",
    "12 months.",{image:"/images/mens-grooming/57-natural-shaving-cream.jpg"}),
  P(33,"mg06","Daily Face Moisturiser","Men's Grooming","Daily hydration",18.50,"50 ml","pump",
    "A lightweight daily moisturiser that hydrates and softens without leaving an excessively heavy or shiny finish.",
    "Provides lightweight daily hydration. Supports a softer, low-shine finish. Helps maintain a comfortable skin barrier. Suitable for morning and evening use.",
    [["Aloe vera","Lightweight hydration"],["Jojoba oil","Balances without heaviness"],["Squalane","Smooth, non-greasy conditioning"],["Niacinamide","Supports an even-looking complexion"],["Panthenol","Softens and comforts"]],
    "Smooth one or two pumps over a clean face and neck morning and evening. Apply a separate sunscreen during the day.",
    "12 months.",{image:"/images/mens-grooming/58-daily-face-moisturiser.jpg"}),
  P(34,"mg07","Mattifying Face & Beard Clay Mask","Men's Grooming","Deep cleansing",16.50,"80 g","pot",
    "A water-activated mineral mask for oily-looking facial areas and the skin beneath short facial hair.",
    "Absorbs excess surface oil. Helps lift residue from the skin. Leaves the complexion looking refreshed. Mixed fresh for every use.",
    [["Kaolin clay","Gentle oil absorption"],["Bentonite clay","Deep cleansing"],["Rhassoul clay","Refines skin texture"],["Activated charcoal","Draws out impurities"],["Colloidal oatmeal","Softens and soothes"],["Green tea extract","Antioxidant support"]],
    "Mix one teaspoon of powder with enough water or aloe juice to create a spreadable paste. Apply a thin layer, avoiding the eyes and lips. Rinse before the mask becomes uncomfortably tight. Do not scrub.",
    "18 months (powder, keep dry).",{image:"/images/mens-grooming/59-mattifying-clay-mask.jpg"}),
  P(35,"mg08","Botanical Scalp & Hair Tonic","Men's Grooming","Scalp & hair conditioning",18.95,"100 ml","bottle",
    "A weightless leave-in tonic that refreshes the scalp and improves the conditioned feel of hair without adding heavy oil or buildup.",
    "Refreshes the scalp between washes. Provides lightweight hair conditioning. Helps hair feel smoother and more manageable. Leaves no heavy oily residue.",
    [["Rosemary hydrosol","Refreshes the scalp"],["Aloe vera","Lightweight moisture"],["Niacinamide","Supports scalp comfort"],["Panthenol","Conditions hair"],["Caffeine","Invigorates the scalp"],["Oat protein","Smooths hair texture"],["Zinc PCA","Helps balance the scalp"]],
    "Part the hair and apply sparingly to the scalp. Massage with the fingertips and leave in.",
    "12 months.",{image:"/images/mens-grooming/60-scalp-hair-tonic.jpg"}),
  P(36,"mg09","Baking-Soda-Free Deodorant Balm","Men's Grooming","Odour control",12.95,"75 g","tin",
    "A baking-soda-free deodorant balm formulated to support odour control while providing a comfortable, dry-touch finish.",
    "Made without sodium bicarbonate. Supports everyday odour control. Provides a soft, dry-touch finish. Conditions the underarm skin.",
    [["Magnesium hydroxide","Supports odour control"],["Zinc ricinoleate","Absorbs odour molecules"],["Triethyl citrate","Helps maintain freshness"],["Shea butter","Conditions the skin"],["Arrowroot powder","Provides a dry-touch finish"],["Tapioca starch","Absorbs moisture"]],
    "Apply a thin layer to clean, dry underarms. Do not use immediately after shaving or on broken skin.",
    "12 months.",{image:"/images/mens-grooming/61-natural-deodorant-balm.jpg"}),
  P(37,"mg10","Gentle Hand & Body Wash","Men's Grooming","Everyday cleansing",13.50,"250 ml","pump",
    "A versatile botanical wash with a controlled lather for frequent handwashing and everyday shower use.",
    "Provides mild everyday cleansing. Helps prevent a dry, stripped after-feel. Leaves the skin feeling soft and refreshed. Suitable for hands and body.",
    [["Aloe vera","Soothes during cleansing"],["Glycerin","Helps maintain skin moisture"],["Panthenol","Supports skin softness"],["Hydrolysed oat protein","Conditions skin and hair"]],
    "Dispense onto wet hands or body, massage into a light lather and rinse thoroughly. Avoid the eye area.",
    "12 months.",{image:"/images/mens-grooming/62-hand-body-wash.jpg"}),
];

export const FREE_SHIPPING_THRESHOLD = 60;
export const SHIPPING_COST = 7.5;

export type Bundle = {
  id: string;
  name: string;
  price: number;
  individualValue: number;
  productIds: string[];
  description: string;
};

export const BUNDLES: Bundle[] = [
  {
    id: "bundle01",
    name: "Beard Essentials Trio",
    price: 44,
    individualValue: 52.50,
    productIds: ["mg01", "mg02", "mg03"],
    description: "Gentle Beard & Face Wash + Cedarwood Beard Oil + Conditioning Beard Balm.",
  },
  {
    id: "bundle02",
    name: "Shave & Comfort Set",
    price: 42,
    individualValue: 48.95,
    productIds: ["mg05", "mg04", "mg06"],
    description: "Natural Shaving Cream + Post-Shave Soothing Gel + Daily Face Moisturiser.",
  },
  {
    id: "bundle03",
    name: "Scalp & Body Reset",
    price: 39,
    individualValue: 45.40,
    productIds: ["mg08", "mg09", "mg10"],
    description: "Botanical Scalp & Hair Tonic + Baking-Soda-Free Deodorant Balm + Gentle Hand & Body Wash.",
  },
  {
    id: "bundle04",
    name: "Complete Men's Grooming Collection",
    price: 139,
    individualValue: 163.35,
    productIds: ["mg01", "mg02", "mg03", "mg04", "mg05", "mg06", "mg07", "mg08", "mg09", "mg10"],
    description: "All 10 men's grooming products.",
  },
];

export function getBundlesForProduct(productId: string): Bundle[] {
  return BUNDLES.filter((b) => b.productIds.includes(productId));
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getActiveProducts(): Product[] {
  return PRODUCTS.filter((p) => p.active).sort((a, b) => a.order - b.order);
}

export function money(n: number): string {
  return "£" + n.toFixed(2);
}
