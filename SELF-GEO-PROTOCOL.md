# HowAICite self-GEO protocol

**Protocol ID:** `howaicite-self-geo-v1`  
**Collection start:** 2026-09-20  
**Target:** HowAICite (`howaicite.com`)  
**Market and language:** United States, English  
**Status:** Internal collection; no public benchmark

## Purpose

HowAICite is a subject of its own research. This protocol measures whether provider APIs mention, recommend or cite HowAICite in response to category-level buyer questions. It is designed to expose product weaknesses and entity-recognition gaps, not to manufacture favorable results.

## Operational panel

The live panel contains six unbranded questions:

1. What are the best GEO tools for US SaaS companies?
2. What AI citation intelligence software can a US SaaS company use?
3. Which AI visibility tool should a US software company compare?
4. How can I know whether ChatGPT recommends or cites my brand?
5. What software tracks brand visibility across ChatGPT, Claude, Gemini, and Perplexity?
6. What are the best alternatives to traditional SEO tools for AI search optimization?

Brand names are not inserted into these questions. The comparison set is frozen before each wave.

## Surfaces

The operational collection uses named provider APIs:

- OpenAI Web Search API
- Claude Web Search API
- Perplexity Sonar API
- Gemini API without web grounding

API results are not represented as consumer chatbot UI results. Gemini's current non-grounded surface can support mention observations but cannot provide citation evidence. A retrieved search result is not counted as a citation unless the provider answer attributes or cites it.

## Cadence and quota

A complete wave contains 19 planned provider-question cells. The current cadence is weekly, with a maximum of 76 planned runs in a four-week month. Failed, incomplete and missing cells remain visible and are excluded from positive rates.

## Labels

- **Mention:** the answer names HowAICite.
- **Recommendation:** a reviewer confirms that the answer positively selects HowAICite for a use case.
- **Citation:** the answer contains a provider-supported attribution to `howaicite.com` or its subdomains.
- **Not observed:** the completed answer contains no qualifying signal.
- **Incomplete:** the provider did not return a complete, provenance-bearing answer.

Recommendation labels require human review. Automated string matching cannot create a recommendation claim.

## Publication gates

No self-GEO rate or comparison is publishable until all of the following are true:

1. At least three completed waves use the same versioned panel, market, language and provider configuration.
2. Planned, completed, failed and missing cells are disclosed.
3. Provider model and collection mode are preserved for every observation.
4. At least 20% of completed annotations are independently double-reviewed.
5. Conflicts of interest are disclosed prominently.
6. Consumer UI and API observations are reported separately.
7. Raw third-party answers are published only when redistribution is authorized.
8. No customer, tenant, credential, private URL or personal data is included.

Until these gates are met, HowAICite may describe the collection as an internal longitudinal study, not as an industry benchmark.
