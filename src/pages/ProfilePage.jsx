import {
  Briefcase,
  GraduationCap,
  Link2,
  Share2,
  Users,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { getAuthToken, updateAuthUser } from "../services/authStorage.js";
import { showToast } from "../utils/toast.js";
import { updateUserProfile } from "../services/saltoApi.js";
import { FooterSection } from "./thread-detail/components/FooterSection.jsx";
import { Icon } from "./thread-detail/components/index.js";

function normalizeProfileData(rawData) {
  const source = rawData?.data || rawData?.user || rawData || {};
  const roleLabel = String(source.role || source.subtitle || "").toLowerCase();
  const isAlumni = roleLabel.includes("alumni") || Boolean(source.isAlumni);
  const isStudent = roleLabel.includes("student") || Boolean(source.isStudent);
  const schools = Array.isArray(source.schools) ? source.schools : [];
  const works = Array.isArray(source.works) ? source.works : [];
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
    schools,
    works,
  };
}

function createProfileFormState(profile) {
  return {
    fullName: profile?.fullName || "",
    userName: profile?.userName || "",
    avatar: profile?.avatar || "",
    field: profile?.field || "",
    degree: profile?.degree || "",
  };
}

function buildProfilePatchPayload(formState) {
  const payload = {
    fullName: formState.fullName.trim(),
    userName: formState.userName.trim(),
  };

  // optional fields: only include when present
  if (formState.avatar && formState.avatar.trim()) {
    payload.Avatar = formState.avatar.trim();
  }
  if (formState.field && formState.field.trim()) {
    payload.field = formState.field.trim();
  }
  if (formState.degree && formState.degree.trim()) {
    payload.degree = formState.degree.trim();
  }

  return payload;
}

export function ProfileEditModal({ profile, onClose, onSave }) {
  const [formState, setFormState] = useState(() => createProfileFormState(profile));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const fullNameRef = useRef(null);
  const userNameRef = useRef(null);

  // avatar preview state
  const [previewSrc, setPreviewSrc] = useState(formState.avatar || "");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const handleChange = (field, value) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "avatar") {
      setPreviewSrc(value || "");
      setPreviewError(false);
    }
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

  // load preview image when previewSrc changes
  useEffect(() => {
    if (!previewSrc) {
      setPreviewLoading(false);
      setPreviewError(false);
      return;
    }

    let mounted = true;
    setPreviewLoading(true);
    setPreviewError(false);

    const img = new Image();
    img.onload = () => {
      if (!mounted) return;
      setPreviewLoading(false);
      setPreviewError(false);
    };
    img.onerror = () => {
      if (!mounted) return;
      setPreviewLoading(false);
      setPreviewError(true);
    };
    img.src = previewSrc;

    return () => {
      mounted = false;
    };
  }, [previewSrc]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.5)]">
        <div className="flex items-start justify-between border-b border-[#eef1f6] px-6 py-5">
          <div>
            <h2 className="text-[22px] font-bold text-(--color-dark)">Edit Profil</h2>
            <p className="mt-1 text-[13px] text-(--color-secondary)">
              Perubahan akan dikirim ke backend melalui PATCH.
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

          {/* Preview area */}
          <div className="mb-4 flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-(--color-gray) flex items-center justify-center">
              {previewSrc && !previewLoading && !previewError ? (
                <img src={previewSrc} alt="avatar preview" className="h-20 w-20 object-contain" />
              ) : previewLoading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--color-dark)" />
              ) : (
                <span className="text-[14px] text-(--color-secondary)">No avatar</span>
              )}
            </div>
            <div className="text-[13px] text-(--color-secondary)">
              <div>Preview avatar (masukkan URL di field Avatar URL)</div>
              {previewError && <div className="text-[12px] text-red-600">Tidak bisa memuat avatar dari URL</div>}
            </div>
          </div>

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

            <label className="space-y-2 md:col-span-2">
              <span className="text-[13px] font-semibold text-(--color-dark)">Avatar URL</span>
              <input
                value={formState.avatar}
                onChange={(event) => handleChange("avatar", event.target.value)}
                className="w-full rounded-2xl border border-[#dbe2f1] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-(--color-like-blue)"
                placeholder="https://..."
              />
              <div className="mt-2 text-[12px] text-(--color-secondary)">
                Avatar disimpan sebagai URL pada field <code>Avatar</code> dari backend.
              </div>
            </label>
          </div>

          <div className="mt-6 rounded-[22px] border border-[#eef1f6] bg-[#fafbff] p-4">
            <p className="text-[13px] font-semibold text-(--color-dark)">Data Umum</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
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
          </div>

          <div className="mt-6 rounded-[22px] border border-[#eef1f6] bg-white p-4">
            <p className="text-[13px] font-semibold text-(--color-dark)">
              Info dari Backend (read-only)
            </p>
            <p className="mt-1 text-[12px] text-(--color-secondary)">
              Data pendidikan/pekerjaan saat ini berasal dari <code>schools</code> dan{" "}
              <code>works</code>. Jika backend menyediakan endpoint edit khusus, kita bisa aktifkan editnya.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#dbe2f1] bg-[#fafbff] p-4">
                <p className="text-[13px] font-semibold text-(--color-dark)">Pendidikan</p>
                {profile?.schools?.length ? (
                  <div className="mt-2 space-y-1 text-[13px] text-(--color-secondary)">
                    {profile.schools[0].nim ? <div>NIM: {profile.schools[0].nim}</div> : null}
                    {profile.schools[0].campusName ? <div>Kampus: {profile.schools[0].campusName}</div> : null}
                    {profile.schools[0].major ? <div>Prodi/Jurusan: {profile.schools[0].major}</div> : null}
                    {profile.schools[0].degree ? <div>Jenjang: {profile.schools[0].degree}</div> : null}
                    {profile.schools[0].intakeDate ? (
                      <div>Masuk: {new Date(profile.schools[0].intakeDate).getFullYear()}</div>
                    ) : null}
                    {profile.schools[0].graduateDate ? <div>Lulus: {profile.schools[0].graduateDate}</div> : null}
                  </div>
                ) : (
                  <p className="mt-2 text-[13px] text-(--color-secondary)">Belum ada data pendidikan.</p>
                )}
              </div>

              <div className="rounded-2xl border border-[#dbe2f1] bg-[#fafbff] p-4">
                <p className="text-[13px] font-semibold text-(--color-dark)">Pekerjaan</p>
                {profile?.works?.length ? (
                  <div className="mt-2 space-y-1 text-[13px] text-(--color-secondary)">
                    {profile.works[0].workPlace ? <div>Workplace: {profile.works[0].workPlace}</div> : null}
                    {profile.works[0].fromYear ? <div>Dari: {profile.works[0].fromYear}</div> : null}
                    {profile.works[0].toYear ? <div>Sampai: {profile.works[0].toYear}</div> : null}
                    {"isMentor" in profile.works[0] ? <div>Mentor: {profile.works[0].isMentor ? "Ya" : "Tidak"}</div> : null}
                    {"isPhd" in profile.works[0] ? <div>PhD: {profile.works[0].isPhd ? "Ya" : "Tidak"}</div> : null}
                  </div>
                ) : (
                  <p className="mt-2 text-[13px] text-(--color-secondary)">Belum ada data pekerjaan.</p>
                )}
              </div>
            </div>
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

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        if (!token) {
          throw new Error("Kamu perlu login terlebih dulu.");
        }
        const response = await fetch("https://salto-be.aauaah.tech/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Gagal memuat data profil");
        }
        const result = await response.json();
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

  const handleSaveProfile = async (patchPayload) => {
    const token = getAuthToken();
    if (!token) throw new Error("Tidak ada token. Silakan login ulang.");

    const response = await updateUserProfile(patchPayload);

    // API adapter returns updated user in response.data or response.user
    const updatedUser = response?.data || response?.user || response || {};

    const normalized = normalizeProfileData(updatedUser);
    setProfileData(normalized);
    updateAuthUser(updatedUser);
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

  const isStudentProfile = Boolean(profileData?.isStudent || displayRole === "Student");
  const isAlumniProfile = Boolean(profileData?.isAlumni || displayRole === "Alumni");

  const profileSummary = isStudentProfile
    ? [profileData?.field && `Bidang: ${profileData.field}`].filter(Boolean)
    : isAlumniProfile
      ? [
          profileData?.field && `Bidang: ${profileData.field}`,
          profileData?.campusName ? `Kampus: ${profileData.campusName}` : null,
          profileData?.workPlace ? `Tempat kerja: ${profileData.workPlace}` : null,
          profileData?.isMentor ? "Mentor" : null,
          profileData?.isPhd ? "PhD" : null,
        ].filter(Boolean)
      : [];

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

  return (
    <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-10 xl:px-0">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          {/* Sidebar Kiri (Header Info) */}
          <aside className="w-full shrink-0 md:w-70 lg:w-74 space-y-5">
            <div className="rounded-3xl border border-(--color-gray) bg-white p-6 shadow-sm">
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
                    className="cursor-pointer h-28 w-28 overflow-hidden rounded-full border border-[#dbe2f1] bg-white p-2 transition hover:shadow-[0_14px_34px_-26px_rgba(37,52,63,0.55)]">
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="h-full w-full object-contain"
                    />
                  </div>
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
                  @{profileData.userName} · {displayRole}
                </p>
              </div>

              <div className="mt-4 text-center text-[13px] text-(--color-secondary)">
                {profileData.email ? (
                  <div className="truncate">{profileData.email}</div>
                ) : null}
                <div className="mt-1">
                  {followerCount} pengikut · {followingCount} mengikuti
                </div>
              </div>

              {profileSummary.length > 0 ? (
                <div className="mt-5 flex flex-col gap-2 text-[13px] text-(--color-secondary)">
                  {profileSummary.map((item) => (
                    <span
                      key={item}
                      className="inline-flex w-max items-center gap-2 rounded-full border border-(--color-light-blue) bg-white px-3 py-1.5">
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handleOpenEdit}
                  className="rounded-full bg-[#25343f] px-5 py-2 text-[14px] font-semibold text-white transition hover:bg-[#1f2c35]">
                  Edit Profil
                </button>
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

                {/* Bagikan */}
                <section style={cardRevealStyle(5)} className="rounded-[14px] border border-[#f3f4f6] bg-white p-5.25 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] transition duration-200 hover:shadow-[0_14px_24px_-22px_rgba(37,52,63,0.5)]">
                  <h3 className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-[#101828]">
                    <span className="h-4 w-1.5 rounded-full bg-(--color-like-blue)" />
                    <Icon icon={Share2} className="h-4 w-4" />
                    Bagikan
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => void copyPublicProfileLink()}
                      className="w-full rounded-lg border border-(--color-gray) bg-white px-3 py-2 text-[13px] font-medium text-(--color-dark) transition hover:bg-(--color-gray)">
                      Copy Link
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          if (navigator.share) {
                            await navigator.share({
                              title: `Profil ${displayName}`,
                              url: publicProfileUrl,
                            });
                            return;
                          }
                        } catch {
                          // fallback copy
                        }
                        await copyPublicProfileLink();
                      }}
                      className="w-full rounded-lg bg-(--color-dark) px-3 py-2 text-[13px] font-medium text-white transition hover:bg-[#1f2c35]">
                      Share
                    </button>
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
