import {
  Bookmark,
  Briefcase,
  Eye,
  GraduationCap,
  Link2,
  MessageCircle,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { getAuthToken, updateAuthUser } from "../services/authStorage.js";
import { showToast } from "../utils/toast.js";
import {
  deleteThread,
  fetchCurrentUser,
  mapApiThreadListItem,
  updateUserProfile,
} from "../services/saltoApi.js";
import { FooterSection } from "./thread-detail/components/FooterSection.jsx";
import { Icon } from "./thread-detail/components/index.js";

function toArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function uniqueBy(list, getKey) {
  const seen = new Set();
  return toArray(list).filter((item, index) => {
    const key = String(getKey(item, index) || "").trim();
    if (!key) return false;
    const normalizedKey = key.toLowerCase();
    if (seen.has(normalizedKey)) return false;
    seen.add(normalizedKey);
    return true;
  });
}

function formatDateId(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(name) {
  return String(name || "U")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function normalizeCompactUser(user, index = 0) {
  const source = user || {};
  return {
    id: String(source.id || source.userId || `user-${index + 1}`),
    avatar: source.Avatar || source.avatar || "",
    userName: source.userName || source.username || "",
    fullName:
      source.fullName || source.name || source.userName || source.username || "Pengguna",
    role: source.role || "User",
    field: source.field || "",
    createdAt: source.createdAt || "",
  };
}

function normalizeProfileThread(thread, index = 0) {
  const mapped = mapApiThreadListItem(thread, index);
  const stats = thread?.stats || {};

  return {
    ...mapped,
    views: Number(stats.totalViews ?? stats.views ?? stats.viewCount ?? 0) || 0,
  };
}

function getTagLabel(tag) {
  if (typeof tag === "string") return tag;
  return String(tag?.label || tag?.name || "").trim();
}

function getTagTone(tag) {
  if (tag && typeof tag === "object" && tag.tone) return tag.tone;
  return "bg-[#f3f7ff] text-[#2563eb]";
}

function normalizeProfileData(rawData) {
  const source = rawData?.data || rawData?.user || rawData || {};
  const roleLabel = String(source.role || source.subtitle || "").toLowerCase();
  const isAlumni = roleLabel.includes("alumni") || Boolean(source.isAlumni);
  const isStudent = roleLabel.includes("student") || Boolean(source.isStudent);
  const schools = uniqueBy(
    toArray(source.schools || (source.school ? [source.school] : [])),
    (school, index) => school?.id || `${school?.campusName || ""}-${school?.nim || index}`,
  );
  const works = uniqueBy(
    toArray(source.works || (source.work ? [source.work] : [])),
    (work, index) => work?.id || `${work?.workPlace || ""}-${work?.fromYear || index}`,
  );
  const followers = uniqueBy(toArray(source.followers), (user, index) =>
    user?.id || user?.userName || index,
  ).map(normalizeCompactUser);
  const following = uniqueBy(toArray(source.following), (user, index) =>
    user?.id || user?.userName || index,
  ).map(normalizeCompactUser);
  const threads = uniqueBy(toArray(source.threads), (thread, index) =>
    thread?.id || thread?.title || index,
  ).map(normalizeProfileThread);
  const savedThreads = uniqueBy(toArray(source.savedThreads), (thread, index) =>
    thread?.id || thread?.title || index,
  ).map(normalizeProfileThread);
  const primarySchool = schools[0] || null;
  const primaryWork = works[0] || null;

  return {
    ...source,
    fullName:
      source.fullName || source.name || source.userName || source.username || "",
    role: source.role || source.subtitle || (isAlumni ? "Alumni" : "Student"),
    isAlumni,
    isStudent,
    avatar:
      source.avatar ||
      source.Avatar ||
      source.photoUrl ||
      source.profileImage ||
      source.image ||
      "",
    field: source.field || source.nim_field || "",
    nim: primarySchool?.nim || source.nim || "",
    campusName: primarySchool?.campusName || source.campusName || "",
    major: primarySchool?.major || source.major || "",
    degree: primarySchool?.degree || source.degree || "",
    intakeDate: primarySchool?.intakeDate || source.intakeDate || "",
    graduateDate: primarySchool?.graduateDate || source.graduateDate || "",
    workPlace: primaryWork?.workPlace || source.workPlace || "",
    fromYear: primaryWork?.fromYear || source.fromYear || "",
    toYear: primaryWork?.toYear || source.toYear || "",
    isMentor: Boolean(primaryWork?.isMentor ?? source.isMentor),
    isPhd: Boolean(primaryWork?.isPhd ?? source.isPhd),
    followersCount: Number(source.followersCount ?? followers.length) || 0,
    followingCount: Number(source.followingCount ?? following.length) || 0,
    followers,
    following,
    threads,
    savedThreads,
    schools,
    works,
  };
}

function CompactAvatar({ src, name, sizeClass = "h-10 w-10" }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full border border-[#dbe2f1] bg-white text-[12px] font-black text-(--color-secondary) ${sizeClass}`}>
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}

function ProfileThreadCard({
  canDelete = false,
  onRequestDelete,
  saved = false,
  thread,
}) {
  return (
    <article className="rounded-2xl border border-[#edf1f7] bg-white p-4 transition hover:-translate-y-0.5 hover:border-(--color-like-blue)/35 hover:shadow-[0_18px_34px_-28px_rgba(37,52,63,0.55)]">
      <div className="flex items-start gap-3">
        <CompactAvatar src={thread.authorAvatar} name={thread.author} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-(--color-secondary)">
            <span>{thread.author}</span>
            {saved ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef2ff] px-2 py-0.5 text-[#4f46e5]">
                <Icon icon={Bookmark} className="h-3 w-3" />
                Tersimpan
              </span>
            ) : null}
          </div>
          <RouterLink to={`/thread/${encodeURIComponent(thread.id)}`}>
            <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-5 text-(--color-dark) transition hover:text-(--color-like-blue)">
              {thread.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-(--color-secondary)">
              {thread.excerpt}
            </p>
          </RouterLink>
        </div>
        {canDelete ? (
          <button
            type="button"
            onClick={() => onRequestDelete?.(thread)}
            title="Hapus thread"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100"
            aria-label={`Hapus thread ${thread.title}`}>
            <Icon icon={Trash2} className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-[#f3f4f6] pt-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {thread.tags.slice(0, 3).map((tag, index) => {
            const label = getTagLabel(tag);
            if (!label) return null;

            return (
              <span
                key={`${thread.id}-${label}-${index}`}
                className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getTagTone(tag)}`}>
                {label}
              </span>
            );
          })}
        </div>
        <div className="flex shrink-0 items-center gap-3 text-[12px] text-(--color-secondary)">
          <span className="inline-flex items-center gap-1">
            <Icon icon={Eye} className="h-3.5 w-3.5" />
            {thread.views}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon icon={MessageCircle} className="h-3.5 w-3.5" />
            {thread.stats.comments}
          </span>
        </div>
      </div>
    </article>
  );
}

function UserPreviewCard({ user }) {
  const href = user.userName ? `/u/${encodeURIComponent(user.userName)}` : "";
  const content = (
    <div className="flex items-center gap-3 rounded-2xl border border-[#edf1f7] bg-white p-3 transition hover:border-(--color-like-blue)/35 hover:bg-[#f8fbff]">
      <CompactAvatar src={user.avatar} name={user.fullName} />
      <div className="min-w-0">
        <p className="truncate text-[13px] font-bold text-(--color-dark)">
          {user.fullName}
        </p>
        <p className="truncate text-[12px] text-(--color-secondary)">
          @{user.userName || "-"} · {user.role}
        </p>
        {user.field ? (
          <p className="truncate text-[11px] text-[#9ca3af]">{user.field}</p>
        ) : null}
      </div>
    </div>
  );

  return href ? (
    <RouterLink to={href} className="block">
      {content}
    </RouterLink>
  ) : (
    content
  );
}

function createProfileFormState(profile) {
  return {
    fullName: profile?.fullName || "",
    userName: profile?.userName || "",
    field: profile?.field || "",
    degree: profile?.degree || "",
  };
}

function buildProfilePatchPayload(formState) {
  const payload = {
    fullName: formState.fullName.trim(),
    userName: formState.userName.trim(),
  };

  if (formState.field && formState.field.trim()) {
    payload.field = formState.field.trim();
  }
  if (formState.degree && formState.degree.trim()) {
    payload.degree = formState.degree.trim();
  }

  return payload;
}

export function ProfileEditModal({
  onClose,
  onSave,
  profile,
  variant = "modal",
}) {
  const [formState, setFormState] = useState(() => createProfileFormState(profile));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const fullNameRef = useRef(null);
  const userNameRef = useRef(null);

  const handleChange = (field, value) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError("");

    // simple client-side validation
    const errors = {};
    if (!formState.fullName || !formState.fullName.trim()) {
      errors.fullName = "Nama lengkap wajib diisi";
    }
    if (!formState.userName || !/^[a-zA-Z0-9_.-]{3,30}$/.test(formState.userName)) {
      errors.userName = "Username harus 3-30 karakter (huruf, angka, _, -, .)";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSaving(false);
      const firstKey = Object.keys(errors)[0];
      if (firstKey === "fullName" && fullNameRef.current) fullNameRef.current.focus();
      else if (firstKey === "userName" && userNameRef.current) userNameRef.current.focus();
      return;
    }
    setValidationErrors({});

    try {
      const res = await onSave(buildProfilePatchPayload(formState));
      showToast("Profil berhasil diperbarui", { type: "success" });
      return res;
    } catch (submitError) {
      setSaveError(
        submitError instanceof Error ? submitError.message : "Gagal menyimpan profil.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isInline = variant === "inline";

  return (
    <div
      className={
        isInline
          ? "w-full"
          : "fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      }>
      <div
        className={`w-full max-w-2xl overflow-hidden rounded-[28px] bg-white ${
          isInline
            ? "border border-[#dbe2f1] shadow-sm"
            : "shadow-[0_30px_80px_-30px_rgba(15,23,42,0.5)]"
        }`}>
        <div className="flex items-start justify-between border-b border-[#eef1f6] px-6 py-5">
          <div>
            <h2 className="text-[22px] font-bold text-(--color-dark)">Edit Profil</h2>
            <p className="mt-1 text-[13px] text-(--color-secondary)">
              Perbarui identitas yang terlihat di profil dan diskusi.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#dbe2f1] px-3 py-2 text-[13px] font-semibold text-(--color-dark) transition hover:bg-[#f8fafc]"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-6 py-5">
          {saveError ? (
            <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {saveError}
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[13px] font-semibold text-(--color-dark)">Nama Lengkap</span>
              <input
                ref={fullNameRef}
                value={formState.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                className="w-full rounded-2xl border border-[#dbe2f1] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-(--color-like-blue)"
                placeholder="Nama lengkap"
              />
              {validationErrors.fullName && (
                <p className="mt-1 text-[12px] text-red-600">{validationErrors.fullName}</p>
              )}
            </label>

            <label className="space-y-2">
              <span className="text-[13px] font-semibold text-(--color-dark)">Username</span>
              <input
                ref={userNameRef}
                value={formState.userName}
                onChange={(event) => handleChange("userName", event.target.value)}
                className="w-full rounded-2xl border border-[#dbe2f1] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-(--color-like-blue)"
                placeholder="username"
              />
              {validationErrors.userName && (
                <p className="mt-1 text-[12px] text-red-600">{validationErrors.userName}</p>
              )}
            </label>

            <label className="space-y-2">
              <span className="text-[13px] font-semibold text-(--color-dark)">Bidang</span>
              <input
                value={formState.field}
                onChange={(event) => handleChange("field", event.target.value)}
                className="w-full rounded-2xl border border-[#dbe2f1] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-(--color-like-blue)"
                placeholder="Bidang"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[13px] font-semibold text-(--color-dark)">Jenjang</span>
              <input
                value={formState.degree}
                onChange={(event) => handleChange("degree", event.target.value)}
                className="w-full rounded-2xl border border-[#dbe2f1] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-(--color-like-blue)"
                placeholder="D3 / D4 / S1 / S2 / S3"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#eef1f6] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#dbe2f1] px-5 py-2.5 text-[14px] font-semibold text-(--color-dark) transition hover:bg-[#f8fafc]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-3 rounded-full bg-(--color-dark) px-5 py-2.5 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState(null);
  const [isDeletingThread, setIsDeletingThread] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        if (!token) {
          throw new Error("Kamu perlu login terlebih dulu.");
        }
        const response = await fetchCurrentUser();
        const result = response?.data || response;
        setProfileData(normalizeProfileData(result));
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        setProfileData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  const handleOpenEdit = () => setIsEditing(true);

  const handleCloseEdit = () => setIsEditing(false);

  const handleRequestDeleteThread = (thread) => {
    setThreadToDelete(thread);
  };

  const handleCancelDeleteThread = () => {
    if (isDeletingThread) return;
    setThreadToDelete(null);
  };

  const handleConfirmDeleteThread = async () => {
    if (!threadToDelete?.id) return;

    try {
      setIsDeletingThread(true);
      await deleteThread(threadToDelete.id);
      setProfileData((current) => {
        if (!current) return current;

        const targetId = String(threadToDelete.id);
        return {
          ...current,
          threads: (current.threads || []).filter(
            (thread) => String(thread.id) !== targetId,
          ),
        };
      });
      showToast("Thread berhasil dihapus.", { type: "success" });
      setThreadToDelete(null);
    } catch (deleteError) {
      showToast(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus thread.",
        { type: "error" },
      );
    } finally {
      setIsDeletingThread(false);
    }
  };

  const handleSaveProfile = async (patchPayload) => {
    const token = getAuthToken();
    if (!token) throw new Error("Tidak ada token. Silakan login ulang.");

    const response = await updateUserProfile(patchPayload);

    const updatedPayload = response?.data || response?.user || response || {};
    const updatedUser = updatedPayload?.data || updatedPayload?.user || updatedPayload;
    const normalized = normalizeProfileData({
      ...profileData,
      ...updatedUser,
    });
    setProfileData(normalized);
    updateAuthUser(normalized);
    setIsEditing(false);
    return updatedUser;
  };

  const socialLinks = [
    { id: "soc-1", icon: Users, label: "Community" },
    { id: "soc-2", icon: Share2, label: "Share" },
    { id: "soc-3", icon: Link2, label: "Link" },
  ];

  const displayName = profileData?.fullName || "Profil";

  const displayRole = profileData?.role || "Student";

  const avatarSrc = profileData?.avatar || "";
  const publicProfileUrl = profileData?.userName
    ? `${window.location.origin}/u/${encodeURIComponent(profileData.userName)}`
    : window.location.href;

  const copyPublicProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(publicProfileUrl);
      showToast("Link profil disalin", { type: "success" });
    } catch {
      showToast("Gagal menyalin link", { type: "error" });
    }
  };

  // avatar viewer modal
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [viewAvatarSrc, setViewAvatarSrc] = useState(avatarSrc || "");
  const openAvatar = (src) => {
    if (!src) return;
    setViewAvatarSrc(src);
    setIsAvatarOpen(true);
  };
  const closeAvatar = () => setIsAvatarOpen(false);

  const roleKey = String(displayRole || "").toLowerCase();
  const isStudentProfile = Boolean(
    profileData?.isStudent || roleKey.includes("student"),
  );
  const isAlumniProfile = Boolean(
    profileData?.isAlumni || roleKey.includes("alumni"),
  );

  const followerCount = profileData?.followersCount ?? (profileData?.followers?.length ?? 0);
  const followingCount = profileData?.followingCount ?? (profileData?.following?.length ?? 0);
  const joinDateLabel = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  const cardRevealStyle = (index) => ({
    animation: "profileCardReveal 520ms cubic-bezier(0.22,1,0.36,1) both",
    animationDelay: `${90 + index * 70}ms`,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
        <SiteHeader />
        <main className="mx-auto w-full max-w-316 px-4 py-10 lg:px-0">
          <div className="rounded-2xl border border-dashed border-(--color-light-blue) bg-white px-5 py-3 text-[13px] text-(--color-secondary)">
            Memuat data profil...
          </div>
        </main>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
        <SiteHeader />
        <main className="mx-auto w-full max-w-316 px-4 py-10 lg:px-0">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-[13px] text-amber-700">
            {error || "Data profil tidak ditemukan"}
          </div>
        </main>
      </div>
    );
  }

  const school = profileData.schools?.[0];
  const work = profileData.works?.[0];
  const profileThreads = profileData.threads || [];
  const savedThreads = profileData.savedThreads || [];
  const followers = profileData.followers || [];
  const following = profileData.following || [];
  const canShowOwnThreads = isStudentProfile;

  return (
    <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-10 xl:px-0">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          {/* Sidebar Kiri (Header Info) */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[28px] border border-[#dbe2f1] bg-white shadow-[0_18px_50px_-38px_rgba(37,52,63,0.65)]">
              <div className="h-16 bg-[radial-gradient(circle_at_20%_10%,rgba(126,141,232,0.30),transparent_34%),linear-gradient(135deg,rgba(221,225,255,0.95),rgba(246,248,255,0.85))]" />
              <div className="flex flex-col items-center text-center">
                {avatarSrc ? (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openAvatar(avatarSrc)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        openAvatar(avatarSrc);
                      }
                    }}
                    className="-mt-12 h-28 w-28 cursor-pointer overflow-hidden rounded-full border-4 border-white bg-white p-1 shadow-[0_16px_34px_-25px_rgba(37,52,63,0.7)] transition hover:shadow-[0_18px_42px_-24px_rgba(37,52,63,0.75)]">
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="-mt-12 grid h-28 w-28 place-items-center rounded-full border-4 border-white bg-white text-[34px] font-black text-(--color-secondary) shadow-[0_16px_34px_-25px_rgba(37,52,63,0.7)]">
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
                  @{profileData.userName}
                </p>
                <span className="mt-3 rounded-full bg-[#eef2ff] px-3 py-1 text-[12px] font-bold text-[#4f46e5]">
                  {displayRole}
                </span>
              </div>

              <div className="px-6 pb-6">
                <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#eef1f6] bg-[#f8fbff] text-center">
                  <div className="px-3 py-3">
                    <p className="text-[18px] font-black text-[#0a2647]">
                      {followerCount}
                    </p>
                    <p className="text-[11px] font-semibold text-(--color-secondary)">
                      Pengikut
                    </p>
                  </div>
                  <div className="border-l border-[#e5e9f2] px-3 py-3">
                    <p className="text-[18px] font-black text-[#0a2647]">
                      {followingCount}
                    </p>
                    <p className="text-[11px] font-semibold text-(--color-secondary)">
                      Mengikuti
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-center text-[13px] text-(--color-secondary)">
                  {profileData.email ? (
                    <div className="truncate">{profileData.email}</div>
                  ) : null}
                  {profileData.field ? (
                    <div className="truncate">{profileData.field}</div>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-2">
                  <button
                    onClick={handleOpenEdit}
                    className="rounded-full bg-[#25343f] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#1f2c35]">
                    Edit Profil
                  </button>
                  <button
                    onClick={() => void copyPublicProfileLink()}
                    className="rounded-full border border-[#dbe2f1] bg-white px-5 py-2.5 text-[13px] font-semibold text-(--color-dark) transition hover:bg-[#f8fafc]">
                    Copy Link Publik
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Konten Utama Kanan */}
          <div className="min-w-0 flex-1 rounded-3xl bg-[linear-gradient(180deg,rgba(119,131,212,0.09),rgba(119,131,212,0)_35%)] p-2">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">
              <section className="space-y-6">
                {/* Pendidikan */}
                {school && (
                  <article style={cardRevealStyle(0)} className="rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)] transition duration-200 hover:shadow-[0_16px_28px_-24px_rgba(37,52,63,0.5)]">
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

                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-[16px] font-bold text-(--color-dark)">
                          {school.degree} - {school.major}
                        </p>
                        <p className="mt-1 text-[14px] text-(--color-secondary)">
                          {school.campusName}
                        </p>
                        <p className="mt-2 text-[13px] text-(--color-secondary)">
                          Masuk: {new Date(school.intakeDate).getFullYear()} ·
                          Lulus: {school.graduateDate}
                        </p>
                      </div>
                    </div>
                  </article>
                )}

                {/* Pekerjaan */}
                {work && (
                  <article style={cardRevealStyle(1)} className="rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)] transition duration-200 hover:shadow-[0_16px_28px_-24px_rgba(37,52,63,0.5)]">
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

                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-[16px] font-bold text-(--color-dark)">
                          {work.workPlace}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span className="text-[13px] text-(--color-secondary)">
                            {work.fromYear} - {work.toYear || "Sekarang"}
                          </span>
                          {work.isMentor && (
                            <span className="inline-flex items-center rounded-full bg-[#dcfce7] px-2 py-0.5 text-[12px] font-semibold text-[#15803d]">
                              Mentor
                            </span>
                          )}
                          {work.isPhd && (
                            <span className="inline-flex items-center rounded-full bg-[#f3e8ff] px-2 py-0.5 text-[12px] font-semibold text-[#7e22ce]">
                              PhD
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                )}

                {/* `campuses` / `workplaces` legacy UI removed (backend now returns `schools` + `works`). */}

                {isStudentProfile ? (
                  <article style={cardRevealStyle(2)} className="rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3f4f6] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#eef2ff] text-[#4f46e5]">
                          <Icon icon={MessageCircle} className="h-5 w-5" />
                        </span>
                        <div>
                          <h2 className="text-[18px] font-bold text-(--color-dark)">
                            Aktivitas Diskusi
                          </h2>
                          <p className="text-[12px] text-(--color-secondary)">
                            Ringkasan kontribusi thread dari akun ini.
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-[12px] font-semibold text-(--color-secondary)">
                        {profileThreads.length} thread · {savedThreads.length} tersimpan
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-[#f8fbff] p-4">
                        <p className="text-[22px] font-black text-[#0a2647]">
                          {profileThreads.length}
                        </p>
                        <p className="text-[12px] font-semibold text-(--color-secondary)">
                          Thread dibuat
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#f8fbff] p-4">
                        <p className="text-[22px] font-black text-[#0a2647]">
                          {savedThreads.length}
                        </p>
                        <p className="text-[12px] font-semibold text-(--color-secondary)">
                          Thread disimpan
                        </p>
                      </div>
                    </div>
                  </article>
                ) : null}

                {canShowOwnThreads ? (
                  <article style={cardRevealStyle(3)} className="rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3f4f6] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#eef2ff] text-[#4f46e5]">
                          <Icon icon={MessageCircle} className="h-5 w-5" />
                        </span>
                        <h2 className="text-[18px] font-bold text-(--color-dark)">
                          Thread Saya
                        </h2>
                      </div>
                      <span className="text-[12px] font-semibold text-(--color-secondary)">
                        {profileThreads.length} item
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {profileThreads.length ? (
                        profileThreads.map((thread) => (
                          <ProfileThreadCard
                            key={`thread-${thread.id}`}
                            thread={thread}
                            canDelete={canShowOwnThreads}
                            onRequestDelete={handleRequestDeleteThread}
                          />
                        ))
                      ) : (
                        <p className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] text-(--color-secondary)">
                          Belum ada thread yang dibuat.
                        </p>
                      )}
                    </div>
                  </article>
                ) : null}

                <article style={cardRevealStyle(4)} className="rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3f4f6] pb-4">
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-1.5 rounded-full bg-(--color-like-blue)" />
                      <Icon
                        icon={Bookmark}
                        className="h-6 w-6 text-(--color-like-blue)"
                      />
                      <h2 className="text-[18px] font-bold text-(--color-dark)">
                        Thread Tersimpan
                      </h2>
                    </div>
                    <span className="text-[12px] font-semibold text-(--color-secondary)">
                      {savedThreads.length} item
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {savedThreads.length ? (
                      savedThreads.map((thread) => (
                        <ProfileThreadCard
                          key={`saved-thread-${thread.id}`}
                          thread={thread}
                          saved
                        />
                      ))
                    ) : (
                      <p className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] text-(--color-secondary)">
                        Belum ada thread yang disimpan.
                      </p>
                    )}
                  </div>
                </article>
              </section>

              {/* Sidebar Info/Bagikan Kanan */}
              <aside className="space-y-6 lg:sticky lg:top-19.5">
                {/* Tentang Profil */}
                <section style={cardRevealStyle(4)} className="rounded-[14px] border border-[#f3f4f6] bg-white p-5.25 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] transition duration-200 hover:shadow-[0_14px_24px_-22px_rgba(37,52,63,0.5)]">
                  <h3 className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-[#101828]">
                    <span className="h-4 w-1.5 rounded-full bg-(--color-like-blue)" />
                    <Icon icon={Users} className="h-4 w-4" />
                    Info Profil
                  </h3>
                  <div className="space-y-3 text-[13px] text-(--color-secondary)">
                    <div>
                      <p className="font-semibold text-(--color-dark)">Bergabung</p>
                      <p>{joinDateLabel}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-(--color-dark)">
                        ID Pengguna
                      </p>
                      <p className="truncate font-mono text-[12px]">
                        {profileData.id || "-"}
                      </p>
                    </div>
                  </div>
                </section>

                <section style={cardRevealStyle(5)} className="rounded-[14px] border border-[#f3f4f6] bg-white p-5.25 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] transition duration-200 hover:shadow-[0_14px_24px_-22px_rgba(37,52,63,0.5)]">
                  <h3 className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-[#101828]">
                    <span className="h-4 w-1.5 rounded-full bg-(--color-like-blue)" />
                    <Icon icon={Users} className="h-4 w-4" />
                    Pengikut
                  </h3>
                  <div className="space-y-2">
                    {followers.slice(0, 4).map((user) => (
                      <UserPreviewCard key={`follower-${user.id}`} user={user} />
                    ))}
                    {!followers.length ? (
                      <p className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] text-(--color-secondary)">
                        Belum ada pengikut.
                      </p>
                    ) : null}
                  </div>
                </section>

                <section style={cardRevealStyle(6)} className="rounded-[14px] border border-[#f3f4f6] bg-white p-5.25 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] transition duration-200 hover:shadow-[0_14px_24px_-22px_rgba(37,52,63,0.5)]">
                  <h3 className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-[#101828]">
                    <span className="h-4 w-1.5 rounded-full bg-(--color-like-blue)" />
                    <Icon icon={Users} className="h-4 w-4" />
                    Mengikuti
                  </h3>
                  <div className="space-y-2">
                    {following.slice(0, 4).map((user) => (
                      <UserPreviewCard key={`following-${user.id}`} user={user} />
                    ))}
                    {!following.length ? (
                      <p className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-[13px] text-(--color-secondary)">
                        Belum mengikuti user lain.
                      </p>
                    ) : null}
                  </div>
                </section>

              </aside>
            </div>
          </div>
        </div>
      </main>

      {isEditing && (
        <ProfileEditModal
          profile={profileData}
          onClose={handleCloseEdit}
          onSave={handleSaveProfile}
        />
      )}

      {threadToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.55)]">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-700">
                <Icon icon={Trash2} className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-[18px] font-bold text-(--color-dark)">
                  Hapus thread ini?
                </h2>
                <p className="mt-2 text-[13px] leading-5 text-(--color-secondary)">
                  Thread “{threadToDelete.title}” akan dihapus dari diskusi. Aksi
                  ini tidak bisa dibatalkan.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelDeleteThread}
                disabled={isDeletingThread}
                className="rounded-full border border-[#dbe2f1] px-5 py-2.5 text-[14px] font-semibold text-(--color-dark) transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60">
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteThread}
                disabled={isDeletingThread}
                className="rounded-full bg-red-600 px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                {isDeletingThread ? "Menghapus..." : "Hapus Thread"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Avatar viewer modal */}
      {isAvatarOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-white p-4">
            <button
              onClick={closeAvatar}
              className="absolute right-3 top-3 rounded-full bg-[#f3f4f6] p-2 text-(--color-dark)"
            >
              ✕
            </button>
            <div className="flex items-center justify-center">
              <img src={viewAvatarSrc} alt={displayName} className="max-h-[80vh] max-w-[80vw] object-contain" />
            </div>
            <div className="mt-3 text-center text-[13px] text-(--color-secondary)">{displayName}</div>
          </div>
        </div>
      )}

      <FooterSection socialLinks={socialLinks} />
    </div>
  );
}
