# AGENTS.md

Working guide for coding agents in `@multiversx/sdk-js-web-wallet-io`. Humans: see [README.md](./README.md) for what the package does and how to consume it.

## What this repo is

The **input/output layer of the MultiversX Web Wallet**. It parses inbound "hook" URLs that dApps send to the wallet, validates them, and replies to the dApp. No UI, no signing logic, no network calls except one allow-list fetch in `validateToken`.

Treat this as a **security boundary**: every input is an untrusted URL from a third-party dApp, and the output decides where the wallet redirects or posts a message. Prefer a rejected valid hook over an accepted invalid one.

## Setup

Node **>= 24**, pnpm (pinned via `packageManager`; `corepack enable` if needed).

```bash
pnpm install
```

## Commands

```bash
pnpm test                       # jest, all tests
pnpm test src/hooks/signHook    # single file / path filter
pnpm test -t "rejects a transaction"   # single test by name
pnpm lint                       # eslint src (flat config)
pnpm compile                    # tsc (CommonJS) + tsc-alias -> out/
pnpm compile-next               # ESM/ESNext build (tsconfig.next.json)
pnpm publish-yalc               # compile + yalc publish, for local consumer testing
pnpm audit
```

There is no watch mode and no dev server — this is a library.

## Before you call a change done

```bash
pnpm test && pnpm lint && pnpm compile && pnpm compile-next
```

Then check the **emitted output**, because tests run against `src/` via Jest's `modulePaths` and stay green even when the build is broken:

```bash
# alias rewriting worked — must print nothing
grep -rE "require\(['\"](lib|hooks|helpers|constants|types)/" out/

# no test artifacts shipped — must print 0
find out \( -name "*.spec.*" -o -path "*__mocks__*" -o -path "*/tests/*" \) | wc -l
```

Baseline: **14 suites / 95 tests**, `pnpm lint` exit 0.

## Architecture

### Inbound: hook parsers

Each interaction has a `src/hooks/<name>Hook/get<Name>HookData.ts` entry point following one shape:

1. `parseQueryParams(search)` (`src/helpers/navigation`) turns the query string into an object.
2. A **yup schema** from `src/hooks/helpers/` (`login.ts`, `sign.ts`, `signMessage.ts`, `transaction.ts`) validates it via `validateSync(..., { strict: true })`.
3. The `callbackUrl` is decoded and sanitized — `decodeAndSanitizeUrl`, `sanitizeCallbackUrl` (sdk-dapp), or `sanitizeSignHookCallbackUrl` for sign hooks.
4. On **any** failure the function returns `null`, logging only when `IS_DEVELOPMENT`/`IS_TEST`.

When adding a hook, follow this shape and put the schema next to the existing ones.

### Outbound: replyToDapp

`src/replyToDapp/replyToDapp.ts` is the single exit point. It selects a transport in this order:

1. no `postMessageData` → URL redirect with transaction data
2. `window.opener` or inside an iframe → `postMessage` to opener/parent
3. `extensionReplyToDapp` callback supplied → delegate to it
4. `webwiewApp` iframe supplied → `postMessage` to it
5. otherwise → URL redirect

**Keep this ordering.** Wallet, extension, and webview clients each depend on a different branch.

### `src/lib/` — the dependency firewall

Every import from `@multiversx/sdk-dapp`, `@multiversx/sdk-dapp-utils`, `@multiversx/sdk-web-wallet-provider`, and `@multiversx/sdk-web-wallet-cross-window-provider` is re-exported through `src/lib/*.ts` using deep `out/...` paths. Application code imports `lib/sdkDapp`, `lib/sdkDappUtils`, etc. — **never the packages directly**.

Those deep paths break on upstream major bumps (a recurring theme in `CHANGELOG.md`); the indirection keeps each fix to one file. Preserve it.

These packages are **peerDependencies**. Only `qs` and `yup` are real runtime dependencies — adding one ships it to every wallet consumer, so don't without good reason.

### Path aliases

`tsconfig.base.json` sets `baseUrl: ./src`, so imports are bare (`hooks/helpers/sign`, `lib/sdkDapp`, `constants/index`). `tsc-alias` rewrites them at build time; Jest resolves them via `modulePaths`/`moduleDirectories`. A build that skips `tsc-alias` emits unresolvable imports.

### Public surface

`src/index.ts` re-exports only `./hooks` → `getLoginHookData`, `getLogoutHookData`, `getSignMessageHookData`, and `SignBaseHookType`. `getSignHookData`, `replyToDapp`, and everything under `helpers/` are reached by consumers through deep `out/...` paths. **Adding to the root barrel is a deliberate API change** — don't do it incidentally.

## Invariants — do not break these

- **`.when()` takes an array in yup 1.x.** `src/hooks/helpers/transaction.ts` has `when(['data'], ([data], schema) => ...)`. Do not "simplify" the destructuring: an array is truthy even wrapping `''`, which silently inverts the token/data rule with no type error and no failing test outside `schemaBehaviour.spec.ts`.
- **Hook parsers return `null`, never throw.** Callers branch on `null`. A thrown error changes the contract.
- **`getIsValidUrl` has no browser-specific branching.** The Safari/Firefox specs mock `isSafari`/`isFirefox` and run the *same* shared assertions from `runValidUrlTests.ts` — they exist to prove behaviour is browser-independent. A result that differs per browser is a regression, not a feature.
- **`callbackUrl` must stay required and non-empty.** `validUrlSchema` treats `''` as valid; `required()` is what rejects it. An empty callback URL is a redirect-target bug.
- **Don't widen a schema to satisfy the type checker.** Cast at the untyped boundary instead (see `parseSignUrl`, where `unknown` + `Array.isArray` does the narrowing).
- **Never reference bare `window`/`document`** — use `safeWindow` from `lib/sdkDappUtils`. Optional chaining does *not* guard an undeclared identifier: `window?.x` still throws `ReferenceError` when `window` is undefined, which breaks the module on import under SSR. `safeWindow` is `typeof window !== 'undefined' ? window : {}`.

## Testing

Jest with `@swc/jest`, `jsdom` environment. Specs live in `tests/` folders beside the code (`src/**/tests/*.spec.ts`); fixtures in `src/__mocks__/`. Neither is compiled — `tsconfig.base.json` excludes them so they stay out of the published `out/`.

`src/hooks/helpers/tests/schemaBehaviour.spec.ts` holds **characterization tests** pinning validation outcomes that are easy to break silently during dependency upgrades: token/data mutual exclusion, empty-`callbackUrl` rejection, unknown keys in the array-length check, empty-array rejection. **If one fails, the validation contract moved — fix the code, not the test.**

When upgrading anything that touches validation, write the characterization test *first*, prove it green on the old version, then upgrade. That is how the yup 1.x `.when()` inversion was caught; without it the suite was fully green with the rule reversed.

## Code style

Enforced by `pnpm lint`, so just run it. Notable: single quotes, semicolons, no trailing commas, 2-space indent, `curly: all`. Import ordering uses **`eslint-plugin-import-x`** (rules namespaced `import-x/*`) — the original `eslint-plugin-import` is not ESLint 10 compatible, so don't switch back. Prettier runs through `eslint-plugin-prettier`, so `--fix` handles formatting.

## Releasing

Do **not** commit, push, or publish unless explicitly asked.

- `.github/workflows/changelog.yml` requires a `CHANGELOG.md` entry on every PR.
- **Merging to `main` publishes to npm automatically** via `npm-publish.yml`, using `--tag next` when the version is a prerelease. The version bump is what gates a release.

## Known and accepted

- **`uuid@8.3.2`** shows in `pnpm audit`. It is hard-pinned by `@multiversx/sdk-core` (still true in sdk-core 16). The advisory only affects `v3`/`v5`/`v6` with a `buf` argument; sdk-core calls `v4`. Not exploitable — do not override it.
- **The built package cannot be `require()`d by Node's CJS resolver.** `@multiversx/sdk-dapp` ships its modules as `.cjs`/`.mjs` with **no `.js`**, so the extensionless deep imports in `src/lib/sdkDapp.ts` (e.g. `@multiversx/sdk-dapp/out/utils/decoders/base64Utils`) resolve at compile time through `.d.ts` but fail at runtime with `MODULE_NOT_FOUND`. Bundlers resolve them; bare Node does not. `@multiversx/sdk-dapp-utils` ships `.js` and is unaffected.

  Consequence: `node -e "require('./out/index.js')"` is **not** a valid smoke test, and SSR consumers importing from the package root will hit this. Verify against a real bundled consumer via `pnpm publish-yalc` instead.
