# Thread Detail Frontend Handoff

Dokumen ini jadi index cepat untuk developer yang mengerjakan halaman lain.

## Dokumen Utama

- UI Style Guide global: [ui-style-guide-global.md](ui-style-guide-global.md)
- API Integration Guide frontend-backend: [api-integration-guide-frontend-backend.md](api-integration-guide-frontend-backend.md)
- OpenAPI spec: [openapi-thread-detail.yaml](openapi-thread-detail.yaml)

## Referensi Implementasi Thread Detail

- Page utama: src/pages/ThreadDetailPage.jsx
- Komponen jawaban: src/pages/thread-detail/components/AnswerCard.jsx
- Komposer jawaban: src/pages/thread-detail/components/AnswerComposerCard.jsx
- Adapter API: src/pages/thread-detail/threadDetailApi.js
- Tokens dan interaction constants: src/index.css, src/pages/thread-detail/constants.js

## Checklist Singkat Sebelum Merge

- Konsisten dengan token dan pattern dari UI guide
- Kontrak endpoint mengikuti API integration guide
- Jalankan: npm test -- --run
- Jalankan: npm run lint
- Jalankan: npm run build
