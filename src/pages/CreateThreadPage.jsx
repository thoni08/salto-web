import {
  ArrowLeft,
  CheckCircle2,
  PenSquare,
  SendHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { getAuthUser } from "../services/authStorage.js";
import { FooterSection } from "./thread-detail/components/FooterSection.jsx";
import {
  socialLinks,
  threadCreateAudienceOptions,
  threadCreateCategoryOptions,
  threadListItems,
} from "./thread-detail/data";

const MAX_CATEGORY_SELECTION = 3;

function sanitizeTags(tags) {
  return tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, MAX_CATEGORY_SELECTION);
}

function buildSuggestedTitles() {
  return threadListItems.slice(0, 3).map((item) => item.title);
}

export default function CreateThreadPage() {
  const navigate = useNavigate();
  const authUser = useMemo(() => getAuthUser(), []);
  const isStudent = useMemo(() => {
    if (!authUser) return false;
    if (authUser.isAlumni) return false;
    const role = String(authUser.role || authUser.subtitle || "").toLowerCase();
    if (role.includes("alumni")) return false;
    return true;
  }, [authUser]);
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState(
    threadCreateAudienceOptions[0] || "Mahasiswa",
  );
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isErrorFeedback, setIsErrorFeedback] = useState(false);

  const suggestedTitles = useMemo(() => buildSuggestedTitles(), []);

  const canSubmit = selectedCategories.length > 0;

  const toggleCategory = (category) => {
    if (!isStudent) return; // only students can modify categories
    setSelectedCategories((previous) => {
      if (previous.includes(category)) {
        return previous.filter((item) => item !== category);
      }

      if (previous.length >= MAX_CATEGORY_SELECTION) {
        setFeedback(
          `Maksimal ${MAX_CATEGORY_SELECTION} kategori untuk satu thread.`,
        );
        setIsErrorFeedback(true);
        return previous;
      }

      setFeedback("");
      setIsErrorFeedback(false);
      return [...previous, category];
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isStudent) {
      setFeedback("Hanya mahasiswa (student) yang dapat membuat thread.");
      setIsErrorFeedback(true);
      return;
    }

    const sanitizedTitle = title.trim();
    const sanitizedContent = content.trim();
    const sanitizedCategories = sanitizeTags(selectedCategories);

    if (sanitizedCategories.length === 0) {
      setFeedback("Pilih minimal satu kategori.");
      setIsErrorFeedback(true);
      return;
    }

    setFeedback(
      "Thread baru berhasil dibuat (mode demo). Mengarahkan ke daftar diskusi...",
    );
    setIsErrorFeedback(false);
    navigate("/thread", {
      replace: false,
      state: {
        draftThread: {
          title: sanitizedTitle,
          audience,
          categories: sanitizedCategories,
          content: sanitizedContent,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
      <SiteHeader
        activeHref="/thread"
        user={authUser}
        authActions={[
          { label: "Masuk", to: "/login", variant: "outline" },
          { label: "Daftar", to: "/signup", variant: "solid" },
        ]}
      />

      <main className="mx-auto w-full max-w-316 px-4 pb-12 pt-6 lg:px-0">
        <section className="rounded-2xl border border-(--color-light-blue) bg-white p-6 shadow-[0_18px_30px_-28px_rgba(37,52,63,0.5)] lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef1f6] pb-4">
            <div>
              <p className="text-[13px] text-(--color-like-blue)">
                Forum Diskusi
              </p>
              <h1 className="mt-1 text-[30px] leading-[1.2] font-bold text-(--color-dark)">
                Buat Thread Baru
              </h1>
            </div>

            <Link
              to="/thread"
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe2f1] px-4 py-2 text-[14px] font-medium text-(--color-dark) transition hover:bg-[#f8fafc]">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Diskusi
            </Link>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="thread-title"
                className="text-[14px] font-semibold text-(--color-dark)">
                Judul Thread
              </label>
              <input
                id="thread-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={!isStudent}
                placeholder="Contoh: Strategi belajar DSA efektif untuk interview intern"
                className="h-12 w-full rounded-xl border border-[#dbe2f1] bg-white px-4 text-[14px] text-(--color-dark) outline-none placeholder:text-(--color-secondary) focus-visible:ring-2 focus-visible:ring-(--color-like-blue)/60"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="thread-audience"
                  className="text-[14px] font-semibold text-(--color-dark)">
                  Ditujukan Untuk
                </label>
                <select
                  id="thread-audience"
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  disabled={!isStudent}
                  className="h-12 w-full rounded-xl border border-[#dbe2f1] bg-white px-4 text-[14px] text-(--color-dark) outline-none focus-visible:ring-2 focus-visible:ring-(--color-like-blue)/60">
                  {threadCreateAudienceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <p className="text-[14px] font-semibold text-(--color-dark)">
                  Kategori
                </p>
                <div className="flex flex-wrap gap-2">
                  {threadCreateCategoryOptions.map((category) => {
                    const active = selectedCategories.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        disabled={!isStudent}
                        className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                          active
                            ? "bg-(--color-dark) text-white"
                            : "bg-[#f1f5f9] text-[#334155] hover:bg-[#e2e8f0]"
                        }`}>
                        {category}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[12px] text-(--color-secondary)">
                  Pilih 1-{MAX_CATEGORY_SELECTION} kategori.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="thread-content"
                className="text-[14px] font-semibold text-(--color-dark)">
                Isi Thread
              </label>
              <textarea
                id="thread-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                disabled={!isStudent}
                placeholder="Jelaskan konteks pertanyaanmu, langkah yang sudah kamu coba, dan insight yang kamu butuhkan dari alumni atau member lain."
                className="h-52 w-full resize-none rounded-xl border border-[#dbe2f1] bg-white p-4 text-[14px] leading-6 text-(--color-dark) outline-none placeholder:text-(--color-secondary) focus-visible:ring-2 focus-visible:ring-(--color-like-blue)/60"
              />
              <p className="text-[12px] text-(--color-secondary)">
                {content.trim().length} karakter.
              </p>
            </div>

            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-(--color-dark)">
                <PenSquare className="h-4 w-4" />
                Inspirasi Judul dari Data Thread
              </div>
              <ul className="mt-2 space-y-1 text-[13px] text-(--color-secondary)">
                {suggestedTitles.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>

            {feedback ? (
              <p
                role={isErrorFeedback ? "alert" : "status"}
                className={`text-[13px] ${
                  isErrorFeedback ? "text-[#b91c1c]" : "text-[#15803d]"
                }`}>
                {isErrorFeedback ? null : (
                  <CheckCircle2 className="mr-1 inline h-4 w-4" />
                )}
                {feedback}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eef1f6] pt-4">
              <p className="text-[12px] text-(--color-secondary)">
                Thread akan direview sebelum dipublikasikan ke semua pengguna.
              </p>
              <button
                type="submit"
                disabled={!canSubmit || !isStudent}
                className="inline-flex items-center gap-2 rounded-full bg-[#25343f] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#1f2c35] disabled:cursor-not-allowed disabled:opacity-55">
                <SendHorizontal className="h-4 w-4" />
                Publikasikan Thread
              </button>
            </div>
          </form>
        </section>
      </main>

      <FooterSection socialLinks={socialLinks} />
    </div>
  );
}
