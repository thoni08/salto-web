import { Link } from "react-router-dom";

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-gray) p-6 font-sans">
      <section
        className="w-full max-w-lg rounded-3xl border border-(--color-light-blue) bg-white p-8 text-center shadow-[0_25px_50px_-35px_rgba(37,52,63,0.4)]"
        aria-label="Beranda">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-like-blue)">
          Berhasil Login
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-(--color-dark)">
          Home Page
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-(--color-secondary)">
          Kamu berhasil masuk ke halaman utama aplikasi.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/thread"
            className="rounded-full bg-(--color-dark) px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
            Jelajahi Thread
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-(--color-light-blue) px-4 py-2 text-sm font-semibold text-(--color-dark) transition hover:bg-(--color-gray)">
            Kembali ke Login
          </Link>
        </div>
      </section>
    </main>
  );
}

export default App;
