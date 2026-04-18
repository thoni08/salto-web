# UI Style Guide Global

Panduan ini berlaku untuk semua halaman agar tampilan konsisten dan mudah dirawat lintas tim.

## 1. Stack UI

- React + Vite
- Tailwind CSS v4 utility classes
- Design tokens di src/index.css
- Icon library: lucide-react
- Icon wrapper wajib: src/pages/thread-detail/components/Icon.jsx

## 2. Design Tokens

Sumber token: src/index.css

- --color-dark: #25343f
- --color-primary: #ff9b51
- --color-secondary: #929292
- --color-white: #ffffff
- --color-like-blue: #7783d4
- --color-light-blue: #ced0f9
- --color-gray: #f1f5f9

Rule:

- Prioritaskan token di atas sebelum menambah warna baru.
- Hindari hardcoded color kecuali untuk semantic feedback yang belum tersedia sebagai token.

## 3. Typography Baseline

Gunakan Inter sebagai default (sudah ditetapkan di @theme).

Ukuran yang sering dipakai:

- Page title: text-[26px] sampai text-[32px], font-bold atau font-extrabold
- Section title: text-[16px], font-bold
- Body utama: text-[14px], leading sekitar 20-23px
- Meta/caption: text-[12px]
- Badge kecil: text-[10px] atau text-[12px]

## 4. Spacing dan Radius

- Card radius utama: rounded-[14px]
- Card besar hero: rounded-[16px]
- Button utama: rounded-full
- Gap umum antar blok: 12px sampai 24px

Rule:

- Pertahankan rhythm vertikal antar section.
- Jangan campur terlalu banyak nilai custom spacing dalam satu komponen.

## 5. Icon Rules

Selalu render icon lewat komponen wrapper:

- src/pages/thread-detail/components/Icon.jsx

Contoh:

```jsx
import { MessageCircle } from "lucide-react";
import { Icon } from "../thread-detail/components/Icon";

<Icon icon={MessageCircle} className="h-4 w-4" strokeWidth={2} />;
```

Rule:

- Gunakan strokeWidth konsisten (default 1.8, naikkan ke 2 untuk action penting).
- Gunakan ukuran icon konsisten dengan konteks (h-3/w-3, h-4/w-4, h-5/w-5).

## 6. Interaction Class Standard

Sumber: src/pages/thread-detail/constants.js

- buttonFx: transisi tombol + focus ring standar
- darkButtonFx: variasi tombol latar gelap
- linkFx: transisi link + focus ring

Rule:

- Setiap tombol/anchor interaktif harus compose dengan class ini.
- Focus ring tidak boleh dihilangkan.

## 7. Component Patterns

### 7.1 Card

Pattern:

- border tipis
- bg-white
- shadow ringan
- radius 14/16

Contoh base:

```jsx
<section className="rounded-[14px] border border-[rgba(206,208,249,0.5)] bg-white p-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]" />
```

### 7.2 Primary Button

```jsx
<button
  type="button"
  className={`${buttonFx} rounded-full bg-(--color-like-blue) px-4 py-2 text-white`}>
  Action
</button>
```

### 7.3 Secondary Button

```jsx
<button
  type="button"
  className={`${buttonFx} rounded-full border border-(--color-secondary) px-4 py-2 text-(--color-dark)`}>
  Secondary
</button>
```

### 7.4 Small Badge

```jsx
<span className="inline-flex items-center rounded-full bg-[#eff6ff] px-2 py-0.5 text-[12px] font-medium text-[#2563eb]">
  Label
</span>
```

## 8. Accessibility Rules

- Icon-only button harus punya aria-label.
- Gunakan button untuk aksi, a untuk navigasi.
- State penting (loading/error/success) harus terlihat.
- aria-pressed untuk toggle button (contoh like).

## 9. Testing Rules for UI Components

Lokasi test:

- Unit component: src/pages/\*\*/components/**tests**
- Feature/data guards: src/pages/\*\*/**tests**
- Route/integration: src/test

Minimal untuk komponen interaktif:

- Render baseline
- Primary interaction (click/change)
- State transition (enabled/disabled, expanded/collapsed)
- Success/error feedback

## 10. New Page Starter Checklist

- Gunakan token warna global
- Gunakan Icon wrapper
- Gunakan buttonFx/linkFx
- Pastikan responsif desktop + mobile
- Tambahkan test untuk interaction penting
- Jalankan:
  - npm test -- --run
  - npm run lint
  - npm run build
