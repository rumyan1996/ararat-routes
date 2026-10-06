# Ararat Routes (Armenia Tours Map)

A tool for planning **driving day trips from Yerevan** that surface detour-worthy sights *along the way*, rather than just navigating from A to B. See [`armenia-tours-prd.md`](armenia-tours-prd.md) for the full v1 PRD.

**v1 scope:** driving only, day trips from Yerevan, English only, no accounts or booking.

## Run it

It's a single static file with no build step.

- **Locally:** open `index.html` in a browser.
- **GitHub Pages:** Settings → Pages → deploy from the `main` branch, root folder.

It loads the Yandex Maps API, Leaflet (backup map, from unpkg), CARTO map tiles (backup map) and Google Fonts, so it needs an internet connection.

## How it works

- **35 real sights**, each with coordinates, category tags (historical / nature / viewpoint), a "why it's worth the detour" note, a suggested visit duration, and hours/price fields. Hours and prices that haven't been independently verified are **flagged on screen** rather than presented as fact (per the PRD).
- **Out-and-back on one road, not loops.** Every sight is tagged with a `corridor`: the road out of Yerevan it sits on (east/Garni, south/Vayots Dzor-Syunik, west/Armavir, northwest/Aragats, northeast/Sevan-Dilijan, north/Lori). A generated route only combines stops from a single corridor, ordered by distance from Yerevan, and the return leg mirrors the outbound one.
- **Seasonal closures.** The Kari Lake / Aragats road is automatically excluded outside its accessible months, with an on-screen note.
- **Click-to-inspect.** Clicking a map pin opens that sight's details, with a shortcut to plan a trip to it.
- **Save and share without login.** Saved routes live in the browser's `localStorage`. Share links encode the query and chosen route in the URL hash, so a recipient regenerates the same trip.

## Configuration

All settings sit in the `CONFIG` block near the top of the `<script>` in `index.html`.

### 0. Map (Yandex Maps)

The map uses the **Yandex Maps JavaScript API v3** when `YANDEX_MAPS_KEY` is set. If Yandex can't load (blocked, key not active yet, offline), the page automatically falls back to the basic OpenStreetMap map, and a small link under the map lets visitors switch between the two by hand. Leave the key empty to use only the basic map.

Requirements on the Yandex side (developer.tech.yandex.ru):
- The key must be linked to the **JavaScript API** product.
- The key must have its **HTTP Referer restriction** set to the site address (e.g. `ararat-routes.vercel.app`). Yandex v3 refuses keys without it, and it also stops other websites from using the key.
- Keys can take up to about 15 minutes to activate. Check the plan/rates in the Yandex dashboard.

The key is visible to anyone who opens the page; that is normal for map keys, and the referer restriction is what protects it. Yandex is used for the map view only. Drive times and route lines are separate (see below).

### 1. Real driving routes (OpenRouteService)

By default, drive times are **straight-line estimates** and route lines are straight segments. For real road geometry and drive times:

1. Get a free key at <https://openrouteservice.org/dev> (2,000 requests/day, no card).
2. Paste it into `const ORS_API_KEY = '';`.

> **The key is visible to anyone who opens the page.** If you host publicly, restrict it by HTTP referrer in the ORS dashboard. Keep the committed copy of `index.html` with an empty key and paste the real one only into your deployed copy.

If ORS is unreachable, the app falls back to the estimates automatically.

### 2. Sight photos

Add entries to the `PHOTOS` object, keyed by sight id:

```js
garni: { url: 'https://…/garni.jpg', credit: 'Photographer, CC BY-SA 4.0' },
```

A missing or broken URL falls back to the sight's flat icon. **No photos are set yet.** Only use images you have verified and are licensed to display, and keep the credit text accurate.

## Status / open items

- [x] Yandex Maps key connected (map view)
- [ ] OpenRouteService key not yet activated (estimates are used until then).
- [ ] Sight photos: none set. Needs verified image URLs.
- [ ] Hours/price data for several sights is still flagged as unverified.

## Out of scope for v1

Accommodation booking, offline mode, multi-day itineraries, walking/transit routing, user accounts, crowdsourced sights, monetization. See the PRD.

## Credits

Main map © Yandex Maps. Backup map: data © OpenStreetMap contributors, tiles © CARTO, rendered with [Leaflet](https://leafletjs.com). Routing by [OpenRouteService](https://openrouteservice.org) when enabled.
