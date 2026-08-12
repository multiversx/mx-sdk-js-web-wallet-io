# mx-sdk-js-web-wallet-io

Web-wallet input/output mechanism.

`@multiversx/sdk-js-web-wallet-io` is the I/O layer of the [MultiversX Web Wallet](https://wallet.multiversx.com). It parses the inbound "hook" URLs that dApps send to the wallet, validates them, and replies back to the dApp over the right transport.

It contains no UI and no signing logic — it is the boundary between an untrusted dApp request and the wallet acting on it.

## Installation

```bash
npm install @multiversx/sdk-js-web-wallet-io
# or
pnpm add @multiversx/sdk-js-web-wallet-io
```

The MultiversX SDK packages are **peer dependencies**, so install them alongside:

| Peer | Range |
| --- | --- |
| `@multiversx/sdk-core` | `^14 \|\| ^15 \|\| ^16` |
| `@multiversx/sdk-dapp` | `^5` |
| `@multiversx/sdk-dapp-utils` | `^3` |
| `@multiversx/sdk-web-wallet-cross-window-provider` | `^3` |
| `@multiversx/sdk-web-wallet-provider` | `^5` |
| `axios` | `^1.18.1` |
| `bignumber.js` | `^9` |

Only `qs` and `yup` are pulled in as runtime dependencies.

## How it works

```
dApp ──hook URL──▶ parse ──▶ validate (yup) ──▶ sanitize callbackUrl ──▶ wallet acts
                                                                              │
dApp ◀── redirect / postMessage ◀────────────── replyToDapp ◀─────────────────┘
```

Every parser follows the same contract: **it returns `null` on any validation failure rather than throwing.** Callers branch on the result. A malformed or disallowed hook is simply not actionable.

## Usage

### Reading a hook

Each hook type has a parser that takes the URL query string:

```ts
import {
  getLoginHookData,
  getLogoutHookData,
  getSignMessageHookData
} from '@multiversx/sdk-js-web-wallet-io';

const login = getLoginHookData(window.location.search);
// -> { hookUrl, callbackUrl, token?, method? } | null

const logout = getLogoutHookData();          // defaults to window.location.search
// -> { hookUrl, callbackUrl } | null

const signMessage = getSignMessageHookData(window.location.search);
// -> { hookUrl, callbackUrl } | null

if (login === null) {
  // invalid or disallowed hook — do not proceed
}
```

### Reading a sign hook

The sign hook is network-aware, so you build a transaction schema first:

```ts
import { signTxSchema } from '@multiversx/sdk-js-web-wallet-io/out/hooks/helpers/sign';
import { getSignHookData } from '@multiversx/sdk-js-web-wallet-io/out/hooks/signHook';

const schema = signTxSchema({
  isMainnet: true,
  hookWhitelist: [],   // receivers allowed on mainnet
  chainId: '1',
  isSignHook: true
});

const data = getSignHookData(schema)(window.location.search);
// -> { hookUrl, callbackUrl } | null
```

The `receiver` allow-list applies only when `isMainnet` is `true` **and** `isSignHook` is `false` — that is, to transaction hooks on mainnet, where the receiver must be a smart contract or appear in `hookWhitelist`. Sign hooks (`isSignHook: true`) bypass that restriction.

### Replying to the dApp

`replyToDapp` picks the transport automatically based on how the wallet was opened — popup (`window.opener`), iframe, browser extension, webview, or plain redirect:

```ts
import { replyToDapp } from '@multiversx/sdk-js-web-wallet-io/out/replyToDapp';

replyToDapp({
  callbackUrl,
  postMessageData,   // omit to force a URL redirect
  transactionData,
  webwiewApp         // optional iframe target
});
```

### Public API surface

`getLoginHookData`, `getLogoutHookData`, `getSignMessageHookData`, and the `SignBaseHookType` type are exported from the package root. `getSignHookData`, `replyToDapp`, and the schema helpers are reached through deep `out/...` paths as shown above.

## Requirements

Node **>= 24** for local development. The published build targets `es2021` and runs in browsers. `pnpm compile` emits CommonJS (the published `out/index.js`); `pnpm compile-next` emits an ESM/ESNext build to the same directory — they are alternative build modes, not a dual-format package.

> **Note:** this package targets browser environments and expects to be bundled. It cannot be loaded by Node's CommonJS resolver directly, because `@multiversx/sdk-dapp` publishes `.cjs`/`.mjs` files without a plain `.js`, which the extensionless deep imports in this package rely on. Bundlers resolve them correctly.

## Contributing

See **[AGENTS.md](./AGENTS.md)** for setup, commands, architecture, the invariants that must not be broken, and the verification checklist. It is written for coding agents but is the fastest orientation for humans too.

Two things to know up front:

- Every PR needs a `CHANGELOG.md` entry — this is enforced by CI.
- Merging to `main` publishes to npm automatically, so the version bump gates the release.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT
