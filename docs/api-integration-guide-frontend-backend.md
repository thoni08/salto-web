# API Integration Guide (Frontend-Backend Contract)

Panduan ini mendefinisikan kontrak antara frontend dan backend agar implementasi fitur tetap konsisten.

## 1. Tujuan

- Frontend tetap bisa berjalan saat backend belum siap (mode mock).
- Frontend bisa pindah ke backend live tanpa ubah komponen UI utama.
- Shape response/error seragam untuk semua endpoint.

## 0. OpenAPI Spec

Spesifikasi machine-readable untuk backend dan QA:

- docs/openapi-thread-detail.yaml

## 2. Environment Variables

Lihat template: .env.example

- VITE_THREAD_DETAIL_API_MODE
  - mock: frontend-only fallback
  - live: call backend
- VITE_API_BASE_URL
  - contoh: http://localhost:3000/api

## 3. Adapter yang Sudah Ada

File adapter saat ini:

- src/pages/thread-detail/threadDetailApi.js

Fungsi aktif:

- submitThreadAnswer({ threadId, content, viewer })

Return shape standar frontend:

```js
{
  ok: boolean,
  message?: string,
  source?: "mock" | "live",
  answer?: {
    id: string,
    author: string,
    accent: boolean,
    subtitle: string,
    createdAt: string,
    badges: string[],
    likes: number,
    paragraphs: string[],
    replies: Array<{
      id: string,
      author: string,
      role: string,
      text: string,
      createdAt: string,
      likes: number,
    }>,
  }
}
```

## 4. Endpoint Contract yang Direkomendasikan

### 4.1 Auth Me

- Method: GET
- Path: /auth/me

Response sukses:

```json
{
  "id": "user-123",
  "name": "Rizky Mahendra",
  "role": "alumni",
  "isAlumni": true,
  "subtitle": "Alumni IF'24 · Software Engineer"
}
```

Catatan:

- Frontend gate jawaban memakai isAlumni atau mapping dari role.

### 4.2 Thread Detail

- Method: GET
- Path: /threads/:threadId

Response sukses (contoh minimum):

```json
{
  "thread": {
    "id": "thread-big-tech-001",
    "title": "Bagaimana cara persiapan technical interview di perusahaan Big Tech (Google, Meta, Apple)?",
    "author": "Kiki Mahendra",
    "role": "Mahasiswa",
    "createdAt": "2026-03-10T09:14:00.000Z",
    "views": 4732,
    "answersCount": 14,
    "breadcrumbs": [
      "Beranda",
      "Diskusi",
      "Bagaimana cara persiapan technical..."
    ],
    "categoryChips": [
      { "id": "chip-career", "label": "Karir", "tone": "career" },
      { "id": "chip-tech", "label": "Tech", "tone": "tech" }
    ],
    "introParagraphs": ["...", "..."]
  },
  "answers": [
    {
      "id": "a-1",
      "author": "Andri Wirawan",
      "accent": true,
      "subtitle": "Software Engineer L5 · Google",
      "createdAt": "2026-03-10T11:40:00.000Z",
      "badges": ["top", "mentor"],
      "likes": 287,
      "paragraphs": ["..."],
      "replies": [
        {
          "id": "a-1-r-1",
          "author": "Kiki Mahendra",
          "role": "Mahasiswa IF'27",
          "text": "...",
          "createdAt": "2026-03-10T12:05:00.000Z",
          "likes": 4
        }
      ]
    }
  ],
  "contributors": [],
  "stats": [],
  "relatedThreads": []
}
```

### 4.3 Submit Answer

- Method: POST
- Path: /threads/:threadId/answers
- Body:

```json
{ "content": "string" }
```

Validasi backend minimal:

- content tidak kosong
- minimal 100 karakter
- hanya alumni yang boleh submit

Response sukses:

```json
{
  "message": "Jawaban berhasil dikirim.",
  "answer": {
    "id": "a-99",
    "author": "Rizky Mahendra",
    "accent": false,
    "subtitle": "Alumni IF'24",
    "createdAt": "2026-04-05T10:20:00.000Z",
    "badges": [],
    "likes": 0,
    "paragraphs": ["..."],
    "replies": []
  }
}
```

## 5. Standard Error Envelope

Disarankan semua endpoint pakai format error seragam:

```json
{
  "code": "FORBIDDEN",
  "message": "Hanya alumni yang bisa menjawab thread ini."
}
```

HTTP status:

- 400: bad request / validation
- 401: unauthenticated
- 403: unauthorized (mis. bukan alumni)
- 404: resource tidak ditemukan
- 500: server error

## 6. Role Mapping Frontend

Rule saat ini:

- isAlumni === true -> boleh jawab
- isAlumni === false -> tampil gate alumni

Fallback jika backend belum kirim isAlumni:

- role in ["alumni", "mentor", "expert", "admin"] -> true
- lainnya -> false

## 7. Integrasi Bertahap yang Disarankan

1. Aktifkan auth/me dulu untuk gate role.
2. Pindahkan data thread+answers dari mock ke GET /threads/:threadId.
3. Pertahankan submit lewat adapter yang sama.
4. Tambahkan endpoint reply dan like setelah kontrak stabil.

## 8. Contract QA Checklist

Sebelum merge integrasi backend:

- Env live sudah terisi
- auth/me mengembalikan role/isAlumni valid
- thread detail response sesuai shape
- submit answer berhasil + error validation tampil benar
- fallback mock tetap jalan jika backend down
- test, lint, build harus hijau
