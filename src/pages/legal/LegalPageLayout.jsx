import { Link } from "react-router-dom";
import { SiteHeader } from "../../components/SiteHeader.jsx";
import { getAuthUser } from "../../services/authStorage.js";
import { FooterSection } from "../thread-detail/components/FooterSection.jsx";
import { socialLinks } from "../thread-detail/data";

function formatLastUpdated(value) {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function TableOfContents({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <nav
      aria-label="Daftar isi"
      className="rounded-xl border border-[#dbe2f1] bg-white p-5 shadow-[0_16px_28px_-24px_rgba(37,52,63,.35)]">
      <p className="text-[14px] font-semibold text-(--color-dark)">Daftar isi</p>
      <ul className="mt-3 space-y-2 text-[13px] text-(--color-secondary)">
        {items.map((item) => (
          <li key={item.href}>
            <a className="hover:text-(--color-like-blue) hover:underline" href={item.href}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function LegalPageLayout({
  title,
  description,
  lastUpdated,
  tocItems,
  children,
}) {
  const authUser = getAuthUser();

  return (
    <div className="min-h-screen bg-white text-(--color-dark)">
      <SiteHeader
        activeHref="/"
        user={authUser}
        authActions={[
          { label: "Masuk", to: "/login", variant: "outline" },
          { label: "Daftar", to: "/signup", variant: "solid" },
        ]}
      />

      <main className="bg-[#f4f6fb]">
        <section className="mx-auto w-full max-w-316 px-4 py-10 lg:px-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-[240px]">
              <h1 className="text-[34px] leading-[1.15] font-extrabold tracking-[-0.02em] text-(--color-dark)">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 max-w-2xl text-[14px] leading-7 text-(--color-secondary)">
                  {description}
                </p>
              ) : null}
              <p className="mt-2 text-[12px] text-(--color-secondary)">
                Terakhir diperbarui: {formatLastUpdated(lastUpdated)}
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex h-10 items-center rounded-full border border-[#dbe2f1] bg-white px-5 text-[13px] font-semibold text-(--color-dark) shadow-[0_16px_28px_-24px_rgba(37,52,63,.35)] transition hover:bg-white/70">
              Kembali ke Beranda
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
            <article className="rounded-xl border border-[#dbe2f1] bg-white p-6 shadow-[0_16px_28px_-24px_rgba(37,52,63,.35)]">
              <div className="prose prose-sm max-w-none prose-headings:text-(--color-dark) prose-p:text-(--color-secondary) prose-li:text-(--color-secondary)">
                {children}
              </div>
            </article>

            <div className="space-y-6">
              <TableOfContents items={tocItems} />
              <div className="rounded-xl border border-[#dbe2f1] bg-white p-5 text-[13px] leading-6 text-(--color-secondary) shadow-[0_16px_28px_-24px_rgba(37,52,63,.35)]">
                <p className="font-semibold text-(--color-dark)">Kontak</p>
                <p className="mt-1">
                  Untuk pertanyaan terkait dokumen ini, hubungi{" "}
                  <a className="text-(--color-like-blue) underline" href="mailto:surekind@protonmail.com">
                    surekind@protonmail.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterSection socialLinks={socialLinks} />
    </div>
  );
}

