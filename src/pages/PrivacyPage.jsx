import { LegalPageLayout } from "./legal/LegalPageLayout.jsx";

const tocItems = [
  { href: "#ringkasan", label: "Ringkasan" },
  { href: "#data", label: "Data yang Kami Kumpulkan" },
  { href: "#penggunaan", label: "Cara Kami Menggunakan Data" },
  { href: "#penyimpanan", label: "Penyimpanan & Keamanan" },
  { href: "#berbagi", label: "Berbagi Data" },
  { href: "#hak", label: "Hak Kamu" },
  { href: "#perubahan", label: "Perubahan Kebijakan" },
  { href: "#kontak", label: "Kontak" },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Kebijakan Privasi"
      description="Dokumen ini menjelaskan cara SALTO (project tugas) mengumpulkan, menggunakan, dan melindungi data ketika kamu memakai platform."
      lastUpdated="2026-05-24"
      tocItems={tocItems}>
      <section id="ringkasan">
        <h2>Ringkasan</h2>
        <p>
          SALTO adalah project tugas/demonstrasi yang dikelola oleh{" "}
          <strong>Tim SALTO — UKM Softdev</strong> di Indonesia. Dengan memakai
          SALTO, kamu memahami bahwa fitur dan data pada platform ini dapat
          berubah selama masa pengembangan.
        </p>
        <ul>
          <li>
            Kami mengumpulkan data akun, profil, dan konten diskusi yang kamu
            buat.
          </li>
          <li>
            Login menggunakan token yang disimpan di{" "}
            <em>localStorage</em> atau <em>sessionStorage</em> (bukan cookie).
          </li>
          <li>
            Saat ini kami tidak memasang analitik/tracking pihak ketiga (mis.
            Google Analytics, Meta Pixel, Hotjar).
          </li>
        </ul>
      </section>

      <section id="data">
        <h2>Data yang Kami Kumpulkan</h2>
        <p>Jenis data yang mungkin diproses saat kamu menggunakan SALTO:</p>
        <ul>
          <li>
            <strong>Data akun</strong>: email, username/nama tampilan, kredensial
            login (password untuk proses otentikasi).
          </li>
          <li>
            <strong>Data profil</strong>: foto profil, bio, dan informasi profil
            lain yang kamu isi (mis. kampus/jurusan/angkatan bila tersedia).
          </li>
          <li>
            <strong>Konten & aktivitas</strong>: thread, jawaban/komentar,
            interaksi (mis. like/upvote), serta metadata terkait konten.
          </li>
          <li>
            <strong>Data teknis minimum</strong>: data yang lazim tercatat di
            server untuk menjaga layanan tetap berjalan (mis. waktu akses, jenis
            perangkat/browser secara umum, dan log error).
          </li>
        </ul>
        <p>
          Kami tidak meminta data sensitif (mis. data kesehatan, biometrik, atau
          data finansial). Tolong jangan unggah informasi sensitif ke dalam
          thread atau profil.
        </p>
      </section>

      <section id="penggunaan">
        <h2>Cara Kami Menggunakan Data</h2>
        <p>Kami menggunakan data untuk:</p>
        <ul>
          <li>Menyediakan fitur inti: pendaftaran, login, dan akun pengguna.</li>
          <li>Mengoperasikan forum: membuat dan menampilkan thread/jawaban.</li>
          <li>
            Menjaga keamanan: pencegahan spam, penyalahgunaan, dan troubleshooting.
          </li>
          <li>
            Pengembangan: memperbaiki bug, meningkatkan pengalaman pengguna, dan
            menguji perubahan fitur selama masa tugas.
          </li>
        </ul>
      </section>

      <section id="penyimpanan">
        <h2>Penyimpanan &amp; Keamanan</h2>
        <p>
          Data SALTO disediakan melalui API yang berjalan di server (VPS). Kami
          berupaya menerapkan langkah keamanan yang wajar untuk melindungi data,
          termasuk pembatasan akses dan praktik keamanan dasar pada aplikasi.
        </p>
        <p>
          Namun, tidak ada sistem yang 100% aman. Jangan gunakan password yang
          sama dengan akun penting lain, dan segera hubungi kami jika kamu
          menduga ada akses tidak sah.
        </p>
        <p>
          Untuk sesi login, aplikasi web menyimpan token autentikasi di{" "}
          <em>localStorage</em> atau <em>sessionStorage</em> pada browser kamu.
          Kamu bisa keluar (logout) untuk menghapus token tersebut.
        </p>
      </section>

      <section id="berbagi">
        <h2>Berbagi Data</h2>
        <p>
          Secara umum, kami tidak menjual data pribadi. Kami dapat membagikan
          data pada kondisi berikut:
        </p>
        <ul>
          <li>
            <strong>Kepada penyedia infrastruktur</strong> (mis. hosting/server)
            sejauh diperlukan untuk menjalankan layanan.
          </li>
          <li>
            <strong>Untuk kepatuhan hukum</strong> jika diwajibkan oleh
            peraturan yang berlaku di Indonesia.
          </li>
          <li>
            <strong>Dengan persetujuan kamu</strong> jika ada kebutuhan khusus.
          </li>
        </ul>
      </section>

      <section id="hak">
        <h2>Hak Kamu</h2>
        <p>
          Kamu dapat meminta bantuan untuk hal-hal berikut (sepanjang dapat kami
          lakukan secara teknis selama masa project):
        </p>
        <ul>
          <li>Memperbarui data profil.</li>
          <li>Meminta penghapusan akun dan/atau konten tertentu.</li>
          <li>Menanyakan data apa yang kami simpan tentang akunmu.</li>
        </ul>
      </section>

      <section id="perubahan">
        <h2>Perubahan Kebijakan</h2>
        <p>
          Kami dapat memperbarui kebijakan ini sewaktu-waktu. Tanggal “Terakhir
          diperbarui” di atas menunjukkan versi terbaru. Perubahan signifikan
          dapat diinformasikan melalui halaman ini.
        </p>
      </section>

      <section id="kontak">
        <h2>Kontak</h2>
        <p>
          Jika kamu punya pertanyaan, permintaan, atau laporan terkait privasi,
          silakan email{" "}
          <a className="text-(--color-like-blue) underline" href="mailto:surekind@protonmail.com">
            surekind@protonmail.com
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}

