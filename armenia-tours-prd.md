# Armenia Tours Map — v1 PRD

## Problem
Existing tools (Google Maps, TripAdvisor, generic tourism sites) don't surface sights that sit *along the way* between destinations. Travelers plan point A → point B and miss point C, D, E that a short detour would reach. There's no tool that treats a trip through Armenia as a route to be optimized for discovery, not just a point to be navigated to.

## Target users (v1)
Foreign tourists visiting Armenia and local citizens, planning driving day-trips reachable from Yerevan. Not diaspora-specific, not multi-day trip planners — that's later.

## What a user request contains
- A starting point (default: Yerevan) and/or a specific sight they already want to visit
- A time or distance budget (e.g. "I have 4 hours" / "up to 90 min drive")
- Optionally, interest filters: historical & religious sites, nature, viewpoints
- Mode: driving (v1 only)

## What the AI does
- Given a chosen sight or a time budget, algorithmically generates one or more candidate routes that include nearby sights worth a detour, within the stated time/distance constraint
- Returns structured route data: ordered stops, coordinates, drive times between them, total trip time
- Generates short descriptive text per stop explaining *why* it's worth the detour
- Presents multiple route options for comparison when relevant, in English and Armenian
- Lets users save a route as a favorite and get a shareable link, without requiring login
- Accounts for known seasonal/weather-driven road closures (e.g. mountain passes) when building routes
- Flags data it isn't fully confident about (hours, pricing, accessibility) rather than omitting it outright

## What the AI must never do
- Never route through or suggest sights in border-adjacent or access-restricted regions, even if technically reachable — always route conservatively around them
- Never present an unverified or uncertain detail (hours, price, road status) as if it were confirmed fact
- Never fabricate a sight, coordinate, or distance that isn't backed by real data
- Never silently drop the stated time/distance budget to fit in more stops — the constraint the user gave is binding

## Out of scope for v1
- Hotel or accommodation booking
- Offline maps / offline mode
- Multi-day itinerary planning
- Walking or public-transit routing
- User accounts / login (beyond anonymous save & share)
- User-generated or crowdsourced sights
- Monetization implementation (partnerships/ads are a direction, not built in v1)

## Open items to resolve during build (not blocking the plan)
- Primary sight data source (leaning hybrid: OSM/Google Places base + manual enrichment, especially for per-sight recommended visit duration)
- Exact monetization mechanics (which tour operators, ad placement)
