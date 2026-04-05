import { Mail, MapPin, Phone, Send } from "lucide-react";
import {
  buttonFx,
  darkButtonFx,
  linkFx,
  preventPlaceholderClick,
} from "../constants";
import { Icon } from "./Icon";

export function FooterSection({ socialLinks }) {
  return (
    <footer className="mt-10">
      <section className="bg-(--color-like-blue)">
        <div className="mx-auto flex w-full max-w-316 flex-wrap items-center justify-between gap-6 px-4 py-10 lg:px-0">
          <div>
            <h3 className="text-[20px] leading-7.5 font-bold text-white">
              Dapatkan Update Thread Terbaru
            </h3>
            <p className="text-[14px] leading-5.25 text-white/90">
              Subscribe newsletter kami dan jangan lewatkan diskusi penting dari
              para alumni.
            </p>
          </div>

          <form
            className="flex w-full max-w-md items-center gap-2"
            onSubmit={preventPlaceholderClick}>
            <input
              type="email"
              placeholder="Masukkan email kamu..."
              className="h-11 min-w-60 flex-1 rounded-full border border-white/25 bg-white/10 px-4.25 text-[14px] leading-5 text-white placeholder:text-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            />

            <button
              type="submit"
              className={`${buttonFx} inline-flex h-11 items-center gap-2 rounded-full bg-(--color-light-blue)/70 px-5 text-[14px] leading-5 font-semibold text-white focus-visible:ring-white/85`}>
              Subscribe
              <Icon icon={Send} className="h-4 w-4" strokeWidth={2} />
            </button>
          </form>
        </div>
      </section>

      <section className="bg-[#29326c] text-white">
        <div className="mx-auto grid w-full max-w-316 gap-8 px-4 py-9 lg:grid-cols-[467px_218px_218px_218px] lg:px-0">
          <article>
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

            <div className="mt-4 space-y-1.75 text-[13px] leading-[19.5px] text-white/90">
              <p className="inline-flex items-center gap-2">
                <Icon icon={Mail} className="h-4 w-4" />
                hello@salto.id
              </p>
              <p className="inline-flex items-center gap-2">
                <Icon icon={Phone} className="h-4 w-4" />
                +62 21 1234 5678
              </p>
              <p className="inline-flex items-center gap-2">
                <Icon icon={MapPin} className="h-4 w-4" />
                Jakarta, Indonesia
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.label}
                  className={`${darkButtonFx} inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10`}>
                  <Icon icon={item.icon} className="h-4 w-4" strokeWidth={2} />
                </button>
              ))}
            </div>
          </article>

          <article>
            <h4 className="text-[13px] leading-[19.5px] font-semibold">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-[13px] leading-[19.5px] text-white/85">
              <li>Jelajahi Thread</li>
              <li>Mentorship</li>
              <li>Direktori Alumni</li>
              <li>Leaderboard</li>
              <li>Live Session</li>
            </ul>
          </article>

          <article>
            <h4 className="text-[13px] leading-[19.5px] font-semibold">
              Komunitas
            </h4>
            <ul className="mt-4 space-y-2.5 text-[13px] leading-[19.5px] text-white/85">
              <li>Bergabung sebagai Alumni</li>
              <li>Verifikasi Akun</li>
              <li>Program Mentor</li>
              <li>Event & Webinar</li>
              <li>Blog</li>
            </ul>
          </article>

          <article>
            <h4 className="text-[13px] leading-[19.5px] font-semibold">
              Dukungan
            </h4>
            <ul className="mt-4 space-y-2.5 text-[13px] leading-[19.5px] text-white/85">
              <li>Pusat Bantuan</li>
              <li>Panduan Penggunaan</li>
              <li>Syarat & Ketentuan</li>
              <li>Laporkan Masalah</li>
              <li>Kebijakan Privasi</li>
            </ul>
          </article>
        </div>

        <div className="border-t border-white/20">
          <div className="mx-auto flex w-full max-w-316 flex-wrap items-center justify-between gap-3 px-4 py-4 text-[12px] leading-4.5 text-white/80 lg:px-0">
            <p>
              © 2026 SALTO - Student Alumni Link & Talk Online. Made with love
              in Indonesia.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                onClick={preventPlaceholderClick}
                className={`${linkFx} hover:text-white`}>
                Privasi
              </a>
              <a
                href="#"
                onClick={preventPlaceholderClick}
                className={`${linkFx} hover:text-white`}>
                Cookies
              </a>
              <a
                href="#"
                onClick={preventPlaceholderClick}
                className={`${linkFx} hover:text-white`}>
                Aksesibilitas
              </a>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
