# Nostrlytics

## Visualize your nostr data.

### Running Locally

```
git clone https://github.com/thebrandonlucas/nostrlytics.git
cd nostrlytics
yarn
yarn run dev
```

Then go to `http://localhost:5173`

### Completed so far

- [x] Bar chart of events by `kind`
- [x] Allow connect by hex pubkey, `npub`, or `nip-05`
- [x] Get raw event data from UI

### Roadmap

- [ ] Add multiple relays
- [ ] Automatically connect to all relays associated with pubkey/nip-05
- [ ] Filter chart data by relay
- [ ] Reactions to your posts
- [ ] [nip-07](https://github.com/nostr-protocol/nips/blob/master/07.md) for easy connection
- [ ] Save pubkey & relays to localStorage for autoload on subsequent visits
- [ ] Time series data for `kinds` plot
- [ ] Events mentioning you
- [ ] Pie chart of your events/events referencing you
- [ ] Social graph visualization

### Suggestions welcome!

Open an issue if you find bugs or for things you think should be added!
