---
timestamp: 'Mon Oct 20 2025 18:54:43 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251020_185443.9f90ea57.md]]'
content_id: f8cecafa09891eb1a2ad9a74280c1d8c11e6d3cf1474cb2ddda425b9e93af4f8
---

# file: deno.json

```json
{
  "imports": {
    "@concepts/": "./src/concepts/",
    "@google/generative-ai": "npm:@google/generative-ai@^0.24.1",
    "@utils/": "./src/utils/",
    "mongodb": "npm:mongodb@^6.3.0",
    "jsr:@std/assert": "jsr:@std/assert@^0.223.0"
  },
  "tasks": {
    "concepts": "deno run --allow-net --allow-read --allow-sys --allow-env src/concept_server.ts --port 8000 --baseUrl /api"
  }
}

```
