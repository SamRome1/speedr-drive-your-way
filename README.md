# Speedr

A thought experiment about navigation. What would a routing app look like if travel time were calculated assuming drivers pick how aggressively they exceed the speed limit?

Speedr models a map where you choose how much risk you trade for time, and the route and ETA change to match. It is an experiment in interface design and in making an uncomfortable trade-off visible, not a product, and it does not encourage anyone to speed.

## What it does

- Interactive Mapbox map with route rendering
- A risk slider that changes the assumed speed profile and recalculates ETA
- Side-by-side comparison of the legal route time against the chosen profile

## Stack

React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Mapbox GL. Initially scaffolded with Lovable.

## Run locally

```sh
npm install
# add VITE_MAPBOX_TOKEN to .env
npm run dev
```

## License

MIT
