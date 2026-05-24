import { LegalPageLayout } from "./legal/LegalPageLayout.jsx";

const tocItems = [
  { href: "#komitmen", label: "Komitmen" },
  { href: "#cakupan", label: "Cakupan" },
  { href: "#bantuan", label: "Butuh Bantuan?" },
  { href: "#known-issues", label: "Keterbatasan yang Diketahui" },
  { href: "#feedback", label: "Masukan & Pelaporan" },
];

export default function AccessibilityPage() {
  return (
    <LegalPageLayout
      title="Pernyataan Aksesibilitas"
      description="Kami berupaya membuat SALTO dapat digunakan oleh sebanyak mungkin orang, termasuk pengguna dengan kebutuhan aksesibilitas."
      lastUpdated="2026-05-24"
      tocItems={tocItems}>
      <section id="komitmen">
        <h2>Komitmen</h2>
        <p>
          SALTO adalah project tugas/demonstrasi yang dikelola oleh{" "}
          <strong>Tim SALTO — UKM Softdev</strong>. Kami berkomitmen untuk
          meningkatkan aksesibilitas secara bertahap selama pengembangan.
        </p>
      </section>

      <section id="cakupan">
        <h2>Cakupan</h2>
        <p>
          Pernyataan ini berlaku untuk aplikasi web SALTO, termasuk halaman
          thread, profil, dan halaman legal.
        </p>
      </section>

      <section id="bantuan">
        <h2>Butuh Bantuan?</h2>
        <p>
          Jika kamu mengalami kendala akses (mis. tidak bisa mengoperasikan
          fitur dengan keyboard, kontras kurang jelas, atau pembaca layar tidak
          membacakan elemen tertentu), hubungi kami supaya kami bisa membantu
          dan memperbaiki.
        </p>
        <p>
          Kontak:{" "}
          <a className="text-(--color-like-blue) underline" href="mailto:surekind@protonmail.com">
            surekind@protonmail.com
          </a>
          .
        </p>
      </section>

      <section id="known-issues">
        <h2>Keterbatasan yang Diketahui</h2>
        <p>
          Karena SALTO masih dalam tahap pengembangan, beberapa hal mungkin
          belum optimal, misalnya:
        </p>
        <ul>
          <li>Struktur heading dan urutan fokus yang belum sempurna di semua halaman.</li>
          <li>Komponen tertentu yang belum memiliki label ARIA lengkap.</li>
          <li>Variasi kontras warna di beberapa bagian UI.</li>
        </ul>
      </section>

      <section id="feedback">
        <h2>Masukan &amp; Pelaporan</h2>
        <p>
          Saat melapor, mohon sertakan:
        </p>
        <ul>
          <li>URL/halaman yang bermasalah.</li>
          <li>Perangkat dan browser yang kamu gunakan.</li>
          <li>Deskripsi masalah dan, jika bisa, screenshot.</li>
        </ul>
      </section>
    </LegalPageLayout>
  );
}

