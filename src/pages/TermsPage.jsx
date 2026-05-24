import { LegalPageLayout } from "./legal/LegalPageLayout.jsx";

const tocItems = [
  { href: "#penerimaan", label: "Penerimaan Syarat" },
  { href: "#layanan", label: "Deskripsi Layanan" },
  { href: "#akun", label: "Akun & Keamanan" },
  { href: "#konten", label: "Konten Pengguna" },
  { href: "#perilaku", label: "Perilaku yang Dilarang" },
  { href: "#penangguhan", label: "Penangguhan & Penghapusan" },
  { href: "#disclaimer", label: "Disclaimer" },
  { href: "#batasan", label: "Batasan Tanggung Jawab" },
  { href: "#perubahan", label: "Perubahan Syarat" },
  { href: "#kontak", label: "Kontak" },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Syarat & Ketentuan (Terms of Use)"
      description="Syarat penggunaan platform SALTO (project tugas/demonstrasi) yang dikelola oleh Tim SALTO — UKM Softdev."
      lastUpdated="2026-05-24"
      tocItems={tocItems}>
      <section id="penerimaan">
        <h2>Penerimaan Syarat</h2>
        <p>
          Dengan mengakses atau menggunakan SALTO, kamu menyetujui Syarat &amp;
          Ketentuan ini. Jika kamu tidak setuju, mohon untuk tidak menggunakan
          SALTO.
        </p>
      </section>

      <section id="layanan">
        <h2>Deskripsi Layanan</h2>
        <p>
          SALTO adalah platform diskusi mahasiswa dan alumni yang dibuat sebagai{" "}
          <strong>project tugas/edukasi</strong>. Fitur dapat berubah atau tidak
          tersedia sewaktu-waktu tanpa pemberitahuan.
        </p>
      </section>

      <section id="akun">
        <h2>Akun &amp; Keamanan</h2>
        <ul>
          <li>Kamu bertanggung jawab atas aktivitas pada akunmu.</li>
          <li>
            Jaga kerahasiaan kredensial login. Jangan membagikan password kepada
            siapa pun.
          </li>
          <li>
            Jika kamu merasa akunmu disalahgunakan, segera hubungi kami melalui
            email.
          </li>
        </ul>
      </section>

      <section id="konten">
        <h2>Konten Pengguna</h2>
        <p>
          Kamu tetap memiliki hak atas konten yang kamu unggah. Namun, dengan
          memposting konten di SALTO, kamu memberi kami izin non-eksklusif untuk
          menampilkan, menyimpan, dan memproses konten tersebut agar layanan
          berjalan (mis. menampilkan thread dan jawaban).
        </p>
        <p>
          Jangan unggah informasi sensitif atau rahasia. Konten yang kamu
          posting dapat terlihat oleh pengguna lain sesuai pengaturan platform.
        </p>
      </section>

      <section id="perilaku">
        <h2>Perilaku yang Dilarang</h2>
        <p>Kamu setuju untuk tidak:</p>
        <ul>
          <li>Memposting konten yang melanggar hukum Indonesia.</li>
          <li>Melakukan spam, phishing, penipuan, atau manipulasi.</li>
          <li>Mengunggah malware atau mencoba merusak sistem.</li>
          <li>
            Mengambil data pengguna lain secara masif (scraping) tanpa izin.
          </li>
          <li>
            Melanggar privasi pihak lain, termasuk membagikan data pribadi tanpa
            persetujuan.
          </li>
        </ul>
      </section>

      <section id="penangguhan">
        <h2>Penangguhan &amp; Penghapusan</h2>
        <p>
          Kami dapat menangguhkan atau menghapus akun/konten jika kami menilai
          terjadi pelanggaran syarat ini, penyalahgunaan, atau untuk menjaga
          keamanan layanan. Karena ini project tugas, kami juga dapat menutup
          layanan kapan pun.
        </p>
      </section>

      <section id="disclaimer">
        <h2>Disclaimer</h2>
        <p>
          SALTO disediakan apa adanya (<em>as is</em>) untuk keperluan edukasi.
          Kami tidak menjamin layanan akan selalu tersedia, bebas error, atau
          cocok untuk tujuan tertentu. Konten yang dibuat pengguna adalah
          tanggung jawab masing-masing pengguna.
        </p>
      </section>

      <section id="batasan">
        <h2>Batasan Tanggung Jawab</h2>
        <p>
          Sejauh diizinkan oleh hukum yang berlaku di Indonesia,{" "}
          <strong>Tim SALTO — UKM Softdev</strong> tidak bertanggung jawab atas
          kerugian tidak langsung, insidental, atau konsekuensial yang timbul
          dari penggunaan SALTO.
        </p>
      </section>

      <section id="perubahan">
        <h2>Perubahan Syarat</h2>
        <p>
          Kami dapat memperbarui syarat ini dari waktu ke waktu. Versi terbaru
          ditandai oleh tanggal “Terakhir diperbarui”.
        </p>
      </section>

      <section id="kontak">
        <h2>Kontak</h2>
        <p>
          Pertanyaan terkait penggunaan SALTO dapat dikirim ke{" "}
          <a className="text-(--color-like-blue) underline" href="mailto:surekind@protonmail.com">
            surekind@protonmail.com
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}

