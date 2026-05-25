import { Briefcase, GraduationCap, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { FooterSection } from "./thread-detail/components/FooterSection.jsx";
import { Icon } from "./thread-detail/components/index.js";
import { socialLinks } from "./thread-detail/data";
import { fetchUsersBySearchTerm } from "../services/saltoApi.js";
import { showToast } from "../utils/toast.js";
import { getAuthToken, getAuthUser } from "../services/authStorage.js";

function normalizeProfileData(rawData) {
  const source = rawData?.data || rawData?.user || rawData || {};
  const roleLabel = String(source.role || source.subtitle || "").toLowerCase();
  const isAlumni = roleLabel.includes("alumni") || Boolean(source.isAlumni);
  const isStudent = roleLabel.includes("student") || Boolean(source.isStudent);
  const schools = Array.isArray(source.schools)
    ? source.schools
    : source.school
      ? [source.school]
      : [];
  const works = Array.isArray(source.works)
    ? source.works
    : source.work
      ? [source.work]
      : [];
  const primarySchool = schools[0] || null;
  const primaryWork = works[0] || null;

  return {
    ...source,
    fullName:
      source.fullName || source.name || source.userName || source.username || "",
    userName: source.userName || source.username || "",
    role: source.role || source.subtitle || (isAlumni ? "Alumni" : "Student"),
    isAlumni,
    isStudent,
    avatar: source.avatar || source.Avatar || "",
    field: source.field || "",
    campusName: primarySchool?.campusName || source.campusName || "",
    degree: primarySchool?.degree || source.degree || "",
    major: primarySchool?.major || source.major || "",
    intakeDate: primarySchool?.intakeDate || source.intakeDate || "",
    graduateDate: primarySchool?.graduateDate || source.graduateDate || "",
    workPlace: primaryWork?.workPlace || source.workPlace || "",
    fromYear: primaryWork?.fromYear || source.fromYear || "",
    toYear: primaryWork?.toYear || source.toYear || "",
    isMentor: Boolean(primaryWork?.isMentor ?? source.isMentor),
    isPhd: Boolean(primaryWork?.isPhd ?? source.isPhd),
    schools,
    works,
  };
}

function buildPublicProfileUrl(userName) {
  const safeUserName = encodeURIComponent(String(userName || "").trim());
  return `${window.location.origin}/u/${safeUserName}`;
}

function formatDateId(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getFriendlyProfileErrorMessage(message, { isLoggedIn = false } = {}) {
  const normalizedMessage = String(message || "").toLowerCase();
  const looksLikeMissingTokenError =
    normalizedMessage.includes("akses ditolak") ||
    normalizedMessage.includes("token tidak ada") ||
    normalizedMessage.includes("unauthorized") ||
    normalizedMessage.includes("jwt") ||
    normalizedMessage.includes("forbidden");

  if (!looksLikeMissingTokenError) {
    return message;
  }

  if (isLoggedIn) {
    return "Profil alumni belum bisa dimuat saat ini. Coba refresh halaman atau masuk ulang ke akunmu.";
  }

  return "Profil alumni bisa kamu lihat setelah masuk. Silakan login dulu, ya.";
}

export default function PublicProfilePage() {
  const { userName } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const authToken = getAuthToken();
  const authUser = getAuthUser();
  const isLoggedIn = Boolean(authToken || authUser);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError("");

        const target = String(userName || "").trim();
        if (!target) {
          throw new Error("Username tidak valid.");
        }

        const response = await fetchUsersBySearchTerm(target, {
          page: 1,
          limit: 10,
        });
        const payload = response?.data || response?.users || response || {};
        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.users)
              ? payload.users
              : [];

        const exact =
          list.find(
            (entry) =>
              String(entry?.userName || entry?.username || "").toLowerCase() ===
              target.toLowerCase(),
          ) || list[0];

        if (!exact) {
          throw new Error("Profil tidak ditemukan.");
        }

        if (!cancelled) {
          setProfileData(normalizeProfileData(exact));
        }
      } catch (err) {
        if (!cancelled) {
          const rawMessage =
            err instanceof Error ? err.message : "Gagal memuat profil.";
          setError(
            getFriendlyProfileErrorMessage(rawMessage, {
              isLoggedIn,
            }),
          );
          setProfileData(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, userName]);

  const displayName = profileData?.fullName || "Profil";
  const displayRole = profileData?.role || "User";
  const avatarSrc = profileData?.avatar || "";
  const school = profileData?.schools?.[0];
  const work = profileData?.works?.[0];
  const createdAtLabel = profileData?.createdAt
    ? formatDateId(profileData.createdAt)
    : "";
  const updatedAtLabel = profileData?.updatedAt
    ? formatDateId(profileData.updatedAt)
    : "";

  const profileSummary = useMemo(
    () =>
      [
        profileData?.field && `Bidang: ${profileData.field}`,
        // Avoid duplication: school/work details are shown in the main cards.
        work?.isMentor ? "Mentor" : null,
        work?.isPhd ? "PhD" : null,
      ].filter(Boolean),
    [profileData, work],
  );

  const handleCopyLink = async () => {
    const url = buildPublicProfileUrl(profileData?.userName || userName);

    try {
      await navigator.clipboard.writeText(url);
      showToast("Link profil disalin", { type: "success" });
    } catch {
      showToast("Gagal menyalin link", { type: "error" });
    }
  };

  const handleShare = async () => {
    const url = buildPublicProfileUrl(profileData?.userName || userName);

    try {
      if (navigator.share) {
        await navigator.share({ title: `Profil ${displayName}`, url });
        return;
      }
    } catch {
      // fall through to copy
    }

    await handleCopyLink();
  };

  return (
    <div className="flex min-h-screen flex-col bg-(--color-gray) text-(--color-dark)">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-12 pt-10 xl:px-0">
        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-(--color-light-blue) bg-white px-5 py-3 text-[13px] text-(--color-secondary)">
            Memuat profil...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-[13px] text-amber-700">
            {error}
          </div>
        ) : !profileData ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-[13px] text-amber-700">
            Profil tidak ditemukan.
          </div>
        ) : (
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <aside className="w-full shrink-0 md:w-70 lg:w-74 space-y-5">
              <div className="rounded-3xl border border-(--color-gray) bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="h-28 w-28 rounded-full border border-[#dbe2f1] bg-white object-contain p-2"
                    />
                  ) : (
                    <div className="grid h-28 w-28 place-items-center rounded-full border border-[#dbe2f1] bg-white text-[34px] font-black text-(--color-secondary)">
                      {displayName
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}

                  <h1 className="mt-4 text-[18px] font-extrabold text-(--color-dark)">
                    {displayName}
                  </h1>
                  <p className="mt-1 text-[13px] text-(--color-secondary)">
                    @{profileData.userName || userName} · {displayRole}
                  </p>
                </div>

                {profileSummary.length > 0 && (
                  <div className="mt-5 flex flex-col gap-2 text-[13px] text-(--color-secondary)">
                    {profileSummary.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-(--color-light-blue) bg-white px-3 py-1.5 w-max">
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {!isLoggedIn ? (
                  <div className="mt-5 text-[13px] text-(--color-secondary)">
                    <Link
                      className="text-(--color-like-blue) underline"
                      to="/login">
                      Masuk
                    </Link>{" "}
                    untuk melihat profil kamu sendiri.
                  </div>
                ) : null}
              </div>
            </aside>

            <div className="min-w-0 flex-1 rounded-3xl bg-[linear-gradient(180deg,rgba(119,131,212,0.09),rgba(119,131,212,0)_35%)] p-2">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">
                <section className="space-y-6">
                  {school ? (
                    <article className="rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
                        <span className="h-5 w-1.5 rounded-full bg-(--color-like-blue)" />
                        <Icon
                          icon={GraduationCap}
                          className="h-6 w-6 text-(--color-like-blue)"
                        />
                        <h2 className="text-[18px] font-bold text-(--color-dark)">
                          Pendidikan
                        </h2>
                      </div>
                        <div className="mt-4">
                          <p className="text-[16px] font-bold text-(--color-dark)">
                            {school.degree} - {school.major}
                          </p>
                          <p className="mt-1 text-[14px] text-(--color-secondary)">
                            {school.campusName}
                          </p>
                          <p className="mt-2 text-[13px] text-(--color-secondary)">
                            Masuk:{" "}
                            {school.intakeDate
                              ? new Date(school.intakeDate).getFullYear()
                              : "-"}{" "}
                            · Lulus: {school.graduateDate ?? "-"}
                          </p>
                        </div>
                    </article>
                  ) : null}

                  {work ? (
                    <article className="rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
                        <span className="h-5 w-1.5 rounded-full bg-(--color-like-blue)" />
                        <Icon
                          icon={Briefcase}
                          className="h-6 w-6 text-(--color-like-blue)"
                        />
                        <h2 className="text-[18px] font-bold text-(--color-dark)">
                          Pengalaman Kerja
                        </h2>
                      </div>
                        <div className="mt-4">
                          <p className="text-[16px] font-bold text-(--color-dark)">
                            {work.workPlace}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <span className="text-[13px] text-(--color-secondary)">
                              {work.fromYear} - {work.toYear || "Sekarang"}
                            </span>
                            {work.isMentor ? (
                              <span className="inline-flex items-center rounded-full bg-[#dcfce7] px-2 py-0.5 text-[12px] font-semibold text-[#15803d]">
                                Mentor
                              </span>
                            ) : null}
                            {work.isPhd ? (
                              <span className="inline-flex items-center rounded-full bg-[#f3e8ff] px-2 py-0.5 text-[12px] font-semibold text-[#7e22ce]">
                                PhD
                              </span>
                            ) : null}
                          </div>
                        </div>
                    </article>
                  ) : null}
                </section>

                <aside className="space-y-6 lg:sticky lg:top-19.5">
                  {(profileData?.role ||
                    profileData?.field ||
                    profileData?.email ||
                    profileData?.createdAt ||
                    profileData?.updatedAt) && (
                    <section className="rounded-[14px] border border-[#f3f4f6] bg-white p-5.25 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
                      <h3 className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-[#101828]">
                        <span className="h-4 w-1.5 rounded-full bg-(--color-like-blue)" />
                        <span>Info</span>
                      </h3>

                      <div className="space-y-3 text-[13px] text-(--color-secondary)">
                        {profileData?.email ? (
                          <div>
                            <p className="font-semibold text-(--color-dark)">
                              Email
                            </p>
                            <a
                              className="break-all text-(--color-like-blue) underline"
                              href={`mailto:${profileData.email}`}>
                              {profileData.email}
                            </a>
                          </div>
                        ) : null}

                        {profileData?.createdAt ? (
                          <div>
                            <p className="font-semibold text-(--color-dark)">
                              Bergabung
                            </p>
                            <p>{createdAtLabel}</p>
                          </div>
                        ) : null}

                        {profileData?.updatedAt ? (
                          <div>
                            <p className="font-semibold text-(--color-dark)">
                              Terakhir diperbarui
                            </p>
                            <p>{updatedAtLabel}</p>
                          </div>
                        ) : null}
                      </div>
                    </section>
                  )}

                  <section className="rounded-[14px] border border-[#f3f4f6] bg-white p-5.25 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
                    <h3 className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-[#101828]">
                      <span className="h-4 w-1.5 rounded-full bg-(--color-like-blue)" />
                      <Icon icon={Share2} className="h-4 w-4" />
                      Bagikan
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={handleCopyLink}
                        className="w-full rounded-lg border border-(--color-gray) bg-white px-3 py-2 text-[13px] font-medium text-(--color-dark) transition hover:bg-(--color-gray)">
                        Copy Link
                      </button>
                      <button
                        onClick={handleShare}
                        className="w-full rounded-lg bg-(--color-dark) px-3 py-2 text-[13px] font-medium text-white transition hover:bg-[#1f2c35]">
                        Share
                      </button>
                    </div>
                  </section>
                </aside>
              </div>
            </div>
          </div>
        )}
      </main>

      <FooterSection socialLinks={socialLinks} />
    </div>
  );
}
