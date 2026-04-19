import { Component } from "react";

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-[#f6f8ff] px-6 text-[#1f2937]">
          <section className="w-full max-w-lg rounded-2xl border border-[#dbe2f1] bg-white p-8 text-center shadow-[0_20px_40px_-30px_rgba(37,52,63,.55)]">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#4f67ff]">
              Terjadi Error
            </p>
            <h1 className="mt-2 text-2xl font-bold">Halaman gagal dimuat</h1>
            <p className="mt-3 text-sm text-[#5b6470]">
              Coba muat ulang halaman. Jika masalah berlanjut, hubungi tim
              pengembang.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-[#25343f] px-6 text-sm font-semibold text-white transition hover:opacity-90">
              Muat Ulang
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
