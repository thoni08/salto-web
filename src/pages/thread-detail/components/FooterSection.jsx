import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { LIVE_FEATURE_ENABLED } from "../../../config/features";
import { buttonFx, darkButtonFx, linkFx } from "../constants";
import { Icon } from "./Icon";

export function FooterSection({ socialLinks }) {
  const comingSoonLabel = "Coming soon";
  const comingSoonClassName =
    "text-white/55 cursor-help select-none";
  const availableLinkClassName = `${linkFx} hover:text-white`;

  return (
    <footer className="mt-10">
      <section className="bg-(--color-like-blue)">
        <div className="mx-auto flex w-full max-w-316 flex-col gap-5 px-4 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-0">
          <div className="max-w-140">
            <h3 className="text-[20px] leading-7.5 font-bold text-white">
              Newsletter Segera Hadir
            </h3>
            <p className="text-[14px] leading-5.25 text-white/90">
              Fitur subscribe newsletter belum tersedia. Nantikan update
              berikutnya.
            </p>
          </div>

          <form className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="email"
              placeholder="Masukkan email kamu..."
              disabled
              aria-disabled="true"
              className="h-11 w-full min-w-0 flex-1 cursor-not-allowed rounded-full border border-white/25 bg-white/10 px-4.25 text-[14px] leading-5 text-white placeholder:text-white/75 opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            />

            <button
              type="submit"
              disabled
              aria-disabled="true"
              className={`${buttonFx} inline-flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-(--color-light-blue)/70 px-5 text-[14px] leading-5 font-semibold text-white opacity-70 focus-visible:ring-white/85 sm:w-auto`}
              title="Fitur newsletter belum tersedia">
              Subscribe
              <Icon icon={Send} className="h-4 w-4" strokeWidth={2} />
            </button>
          </form>
        </div>
      </section>

      <section className="bg-[#29326c] text-white">
        <div className="mx-auto grid w-full max-w-316 gap-8 px-4 py-9 md:grid-cols-2 lg:grid-cols-[467px_218px_218px_218px] lg:px-0">
          <article className="min-w-0">
            <p className="text-[20px] tracking-[2px] font-black">
              <span className="text-(--color-primary)">S</span>
              ALTO
            </p>
            <p className="text-[10px] leading-2.5 tracking-[0.1px] text-white/90">
              Let&apos;s Connect, Growth Together
            </p>

            <p className="mt-3.75 text-[13px] leading-[21.13px] text-white/90">
              Jembatan antara mahasiswa dan alumni Indonesia. Berbagi ilmu,
              pengalaman, dan membuka peluang tanpa batas untuk generasi penerus
              bangsa.
            </p>

            <div className="mt-4 flex flex-col gap-2 text-[13px] leading-[19.5px] text-white/90">
              <p className="flex items-center gap-2">
                <Icon icon={Mail} className="h-4 w-4" />
                <a
                  className="underline decoration-white/30 underline-offset-2 hover:decoration-white/60"
                  href="mailto:surekind@protonmail.com">
                  surekind@protonmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Icon icon={Phone} className="h-4 w-4" />
                +62 21 1234 5678
              </p>
              <p className="flex items-center gap-2">
                <Icon icon={MapPin} className="h-4 w-4" />
                Jakarta, Indonesia
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <p className="text-[12px] leading-5 text-white/80">
                Sosial media segera hadir.
              </p>
              <div className="flex items-center gap-2 opacity-45">
                {socialLinks.map((item) => (
                  <span
                    key={item.id}
                    aria-hidden="true"
                    className={`${darkButtonFx} inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10`}>
                    <Icon
                      icon={item.icon}
                      className="h-4 w-4"
                      strokeWidth={2}
                    />
                  </span>
                ))}
              </div>
            </div>
          </article>

          <article className="min-w-0">
            <h4 className="text-[13px] leading-[19.5px] font-semibold">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-[13px] leading-[19.5px] text-white/85">
              <li>
                <Link to="/thread" className={availableLinkClassName}>
                  Jelajahi Thread
                </Link>
              </li>
              <li>
                <span
                  className={comingSoonClassName}
                  title={comingSoonLabel}
                  aria-label={comingSoonLabel}>
                  Mentorship
                </span>
              </li>
              <li>
                <span
                  className={comingSoonClassName}
                  title={comingSoonLabel}
                  aria-label={comingSoonLabel}>
                  Direktori Alumni
                </span>
              </li>
              <li>
                <span
                  className={comingSoonClassName}
                  title={comingSoonLabel}
                  aria-label={comingSoonLabel}>
                  Leaderboard
                </span>
              </li>
              <li>
                {LIVE_FEATURE_ENABLED ? (
                  <Link to="/live-diskusi" className={availableLinkClassName}>
                    Live Session
                  </Link>
                ) : (
                  <span
                    className={comingSoonClassName}
                    title={comingSoonLabel}
                    aria-label={comingSoonLabel}>
                    Live Session
                  </span>
                )}
              </li>
            </ul>
          </article>

          <article className="min-w-0">
            <h4 className="text-[13px] leading-[19.5px] font-semibold">
              Komunitas
            </h4>
            <ul className="mt-4 space-y-2.5 text-[13px] leading-[19.5px] text-white/85">
              <li>
                <Link
                  to="/signup?role=alumni"
                  className={availableLinkClassName}>
                  Bergabung sebagai Alumni
                </Link>
              </li>
              {["Verifikasi Akun", "Program Mentor", "Event & Webinar", "Blog"].map(
                (label) => (
                  <li key={label}>
                    <span
                      className={comingSoonClassName}
                      title={comingSoonLabel}
                      aria-label={comingSoonLabel}>
                      {label}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </article>

          <article className="min-w-0">
            <h4 className="text-[13px] leading-[19.5px] font-semibold">
              Dukungan
            </h4>
            <ul className="mt-4 space-y-2.5 text-[13px] leading-[19.5px] text-white/85">
              <li>
                <span
                  className={comingSoonClassName}
                  title={comingSoonLabel}
                  aria-label={comingSoonLabel}>
                  Pusat Bantuan
                </span>
              </li>
              <li>
                <span
                  className={comingSoonClassName}
                  title={comingSoonLabel}
                  aria-label={comingSoonLabel}>
                  Panduan Penggunaan
                </span>
              </li>
              <li>
                <Link to="/terms" className={availableLinkClassName}>
                  Syarat &amp; Ketentuan
                </Link>
              </li>
              <li>
                <a
                  className={availableLinkClassName}
                  href="mailto:surekind@protonmail.com?subject=Laporan%20Masalah%20SALTO">
                  Laporkan Masalah
                </a>
              </li>
              <li>
                <Link to="/privacy" className={availableLinkClassName}>
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </article>
        </div>

        <div className="border-t border-white/20">
          <div className="mx-auto flex w-full max-w-316 flex-col gap-3 px-4 py-4 text-[12px] leading-4.5 text-white/80 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:px-0">
            <p>
              © 2026 SALTO - Student Alumni Link & Talk Online. Made with love
              in Indonesia.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/privacy" className={`${linkFx} hover:text-white`}>
                Privasi
              </Link>
              <Link to="/cookies" className={`${linkFx} hover:text-white`}>
                Cookies
              </Link>
              <Link
                to="/accessibility"
                className={`${linkFx} hover:text-white`}>
                Aksesibilitas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
