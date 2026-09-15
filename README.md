# HowAICite open research kit

Reproducible methods for separating **AI brand mentions**, **recommendations** and **citations**.

[Research protocol](https://howaicite.com/research/recommendation-citation-gap) · [Methodology](https://howaicite.com/methodology) · [HowAI Suite](https://howaicite.com/suite)

## Current release

**Version:** 1.0.0  
**Status:** Protocol and analysis tool published; no AI-answer observations collected  
**Scope:** United States, English, 30 frozen questions, four consumer surfaces, three planned replicates  
**Publisher:** HowAICite, the AI citation intelligence product in HowAI Suite

This release contains a research protocol, an editorial prompt panel and a deterministic analysis tool. It does **not** contain an AI visibility benchmark. An empty observations file returns `not-collected`, never a fabricated 0% result.

## Repository contents

| File | Purpose |
| --- | --- |
| `prompt-panel.json` | Frozen 30-question evaluation panel |
| `observations.json` | Intentionally empty observation dataset |
| `metrics.mjs` | Local, deterministic metric calculator |
| `howaicite-readiness.json` | Historical HTML-readiness snapshots of HowAICite-owned pages |
| `CITATION.cff` | Machine-readable citation metadata |
| `LICENSE.txt` | MIT license for the analysis code |

The prompt panel contains 24 unbranded and six branded questions. It is an editorial research sample, not search-volume data or a claim about real user demand. Use a new versioned panel for another country, language, API surface or prompt set.

## Run locally

Requires Node.js 22 or later. The tool makes no network requests and writes no data.

```bash
node metrics.mjs prompt-panel.json observations.json
```

The script reports missing attempts, failed requests and unreviewed records separately. It does not infer recommendation labels automatically.

## Observation record

Each array entry requires:

- `id`: unique observation identifier; retries must not duplicate a planned cell.
- `wave`: collection wave, such as `2026-09-16-baseline`.
- `promptId`: an ID from the frozen panel.
- `surface`: exact panel surface; APIs must be named separately with `API` in the name.
- `replicate`: integer from 1 through the panel replicate count.
- `countryCode` and `language`: must match the panel.
- `observedAt`: ISO timestamp including timezone.
- `collectionMethod`: `consumer-ui` or `api`.
- `model`: exposed model version, or `unknown` when the interface does not show it.
- `locationProvenance`: for example `requested-only`, `collector-reported` or `verified-session`.
- `status`: `complete`, `failed` or `no-answer`.
- `answer`: original answer for a completed attempt; empty otherwise.
- `sourceUrls`: observed HTTP or HTTPS source URLs.
- `mentioned`, `recommended`, `cited`: boolean labels, or `null` when unreviewed or incomplete.
- `reviewer`: reviewer ID for fully reviewed records; omit for unreviewed records.
- `recommendationQuote`: exact answer excerpt supporting a positive recommendation.

A citation is a reviewed attribution to the target domain, including its subdomains—not merely a URL in the answer. A recommendation is a positive selection for a use case, not a name occurrence.

## Study discipline

1. Freeze the panel before collection.
2. Record failures and `no-answer` attempts instead of deleting them.
3. Use fresh sessions and document personalization, location and provider settings.
4. Keep API observations separate from consumer chatbot observations.
5. Treat model, location-provenance and panel changes as separate cohorts.
6. Double-review a random 20% of completed annotations and resolve disagreements before publication.
7. Publish null findings and limitations alongside positive results.

Repeated answers are dependent samples. This toolkit does not produce a population confidence interval or prove that a website change caused an AI response to change.

## Disclosure and privacy

HowAICite sells software in the category this protocol studies. That conflict is disclosed in the protocol and must remain visible in derivative publications. The target brand is not treated as an independent benchmark publisher.

Do not commit customer answers, credentials, private URLs, personal data or copyrighted third-party response archives. Preserve full evidence privately when redistribution rights are absent; publish only material you are authorized to distribute.

## Licenses and citation

Prompt panel, protocol and HowAICite-owned readiness findings: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).  
`metrics.mjs`: MIT, see `LICENSE.txt`.  
Third-party answers and source content retain their own rights.

Suggested citation:

> HowAICite. *Recommendation–Citation Gap Protocol*, version 1.0.0. September 9, 2026. https://howaicite.com/research/recommendation-citation-gap

Questions and responsible disclosure: [hello@howaicite.com](mailto:hello@howaicite.com)
