function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-6 font-sans">
      <section
        className="w-full max-w-lg rounded-3xl border border-slate-700/70 bg-slate-800/85 p-8 text-center shadow-[0_30px_60px_-35px_rgba(15,23,42,0.8)]"
        aria-label="Beranda">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
          Berhasil Login
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
          Home Page
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Kamu berhasil masuk ke halaman utama aplikasi.
        </p>
      </section>
    </main>
  );
}

export default App;
