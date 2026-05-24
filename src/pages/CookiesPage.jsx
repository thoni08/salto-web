import { LegalPageLayout } from "./legal/LegalPageLayout.jsx";

const tocItems = [
  { href: "#ringkasan", label: "Ringkasan" },
  { href: "#cookies", label: "Apa itu Cookies?" },
  { href: "#pemakaian", label: "Cookies di SALTO" },
  { href: "#penyimpanan", label: "Penyimpanan di Browser (Local/Session Storage)" },
  { href: "#kontrol", label: "Cara Mengontrol" },
  { href: "#kontak", label: "Kontak" },
];

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Kebijakan Cookie"
      description="Penjelasan mengenai cookies dan penyimpanan di browser saat kamu menggunakan SALTO."
      lastUpdated="2026-05-24"
      tocItems={tocItems}>
      <section id="ringkasan">
        <h2>Ringkasan</h2>
        <ul>
          <li>
            Saat ini SALTO tidak secara sengaja menggunakan cookies untuk login
            atau pelacakan iklan.
          </li>
          <li>
            Sesi login menggunakan token yang disimpan di{" "}
            <em>localStorage</em> atau <em>sessionStorage</em>.
          </li>
          <li>
            Browser/hosting dapat tetap membuat cookies teknis tertentu di luar
            kendali kami (mis. yang diperlukan untuk koneksi/keamanan dasar).
          </li>
        </ul>
      </section>

      <section id="cookies">
        <h2>Apa itu Cookies?</h2>
        <p>
          Cookies adalah file kecil yang disimpan di perangkat kamu oleh browser
          saat mengunjungi situs web. Cookies biasanya digunakan untuk
          mengingat preferensi, menjaga sesi, atau membantu analitik situs.
        </p>
      </section>

      <section id="pemakaian">
        <h2>Cookies di SALTO</h2>
        <p>
          Pada versi saat ini, SALTO tidak memasang cookies analitik atau
          marketing pihak ketiga. Jika di masa depan kami menambahkan cookies
          non-esensial, kami akan memperbarui kebijakan ini dan, jika relevan,
          menampilkan pemberitahuan.
        </p>
      </section>

      <section id="penyimpanan">
        <h2>Penyimpanan di Browser (Local/Session Storage)</h2>
        <p>
          Selain cookies, browser memiliki mekanisme penyimpanan lain seperti{" "}
          <em>localStorage</em> dan <em>sessionStorage</em>. SALTO menggunakan
          penyimpanan ini untuk menyimpan token login dan data akun agar kamu
          tetap masuk (tergantung pilihan “ingat saya”).
        </p>
        <ul>
          <li>
            <strong>sessionStorage</strong>: biasanya hilang saat tab/browser
            ditutup.
          </li>
          <li>
            <strong>localStorage</strong>: tersimpan lebih lama sampai dihapus
            atau kamu logout.
          </li>
        </ul>
      </section>

      <section id="kontrol">
        <h2>Cara Mengontrol</h2>
        <p>Kamu bisa mengontrol cookies dan penyimpanan browser dengan:</p>
        <ul>
          <li>Logout dari SALTO untuk menghapus token sesi.</li>
          <li>Menghapus data situs (cookies &amp; site data) via pengaturan browser.</li>
          <li>
            Menggunakan mode private/incognito untuk membatasi penyimpanan sesi.
          </li>
        </ul>
        <p>
          Menghapus data situs dapat membuat kamu perlu login ulang dan dapat
          menghapus preferensi tertentu.
        </p>
      </section>

      <section id="kontak">
        <h2>Kontak</h2>
        <p>
          Pertanyaan terkait kebijakan ini dapat dikirim ke{" "}
          <a className="text-(--color-like-blue) underline" href="mailto:surekind@protonmail.com">
            surekind@protonmail.com
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}

