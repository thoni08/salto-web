import {
  Briefcase,
  GraduationCap,
  Link2,
  Mail,
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
    major: source.major || "",
    intakeDate: source.intakeDate || "",
    campusName: source.campusName || "",
    degree: source.degree || "",
    campuses: Array.isArray(source.campuses) ? source.campuses : [],
    workplaces: Array.isArray(source.workplaces) ? source.workplaces : [],
  };
}

function formatDateForInput(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const text = String(value);
    return text.length >= 10 ? text.slice(0, 10) : text;
  }

  return date.toISOString().slice(0, 10);
}

function listToText(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return "";
  }

  return value.join("\n");
}

function textToList(value) {
  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function createProfileFormState(profile) {
  return {
    fullName: profile?.fullName || "",
    userName: profile?.userName || "",
    avatar: profile?.avatar || "",
    field: profile?.field || "",
    degree: profile?.degree || "",
    major: profile?.major || "",
    campusName: profile?.campusName || "",
    intakeDate: formatDateForInput(profile?.intakeDate),
    campuses: listToText(profile?.campuses),
    workplaces: listToText(profile?.workplaces),
    isMentor: Boolean(profile?.isMentor),
    isPhd: Boolean(profile?.isPhd),
  };
}

function buildProfilePatchPayload(formState) {
  const payload = {
    fullName: formState.fullName.trim(),
    userName: formState.userName.trim(),
  };

  // optional fields: only include when present
  if (formState.avatar && formState.avatar.trim()) payload.avatar = formState.avatar.trim();
  if (formState.field && formState.field.trim()) {
    payload.field = formState.field.trim();
    payload.nim_field = formState.field.trim();
  }
  if (formState.degree && formState.degree.trim()) payload.degree = formState.degree.trim();
  if (formState.major && formState.major.trim()) payload.major = formState.major.trim();
  if (formState.campusName && formState.campusName.trim()) payload.campusName = formState.campusName.trim();
  if (formState.intakeDate) payload.intakeDate = formState.intakeDate;
  const campuses = textToList(formState.campuses);
  if (campuses.length > 0) payload.campuses = campuses;
  const workplaces = textToList(formState.workplaces);
  if (workplaces.length > 0) payload.workplaces = workplaces;
  if (formState.isMentor) payload.isMentor = true;
  if (formState.isPhd) payload.isPhd = true;

  return payload;
}

export function ProfileEditModal({ profile, onClose, onSave }) {
  const [formState, setFormState] = useState(() => createProfileFormState(profile));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const fullNameRef = useRef(null);
  const userNameRef = useRef(null);
  const intakeDateRef = useRef(null);

  // avatar preview state
  const [previewSrc, setPreviewSrc] = useState(formState.avatar || "");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedObjectUrl, setSelectedObjectUrl] = useState(null);

  const isAlumniProfile = Boolean(profile?.isAlumni || String(profile?.role || "").toLowerCase().includes("alumni"));
  const isStudentProfile = Boolean(profile?.isStudent || String(profile?.role || "").toLowerCase().includes("student") || !isAlumniProfile);

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

  const handleFileChange = (file) => {
    if (!file) {
      setSelectedFile(null);
      if (selectedObjectUrl) {
        URL.revokeObjectURL(selectedObjectUrl);
        setSelectedObjectUrl(null);
      }
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
    setSelectedObjectUrl(url);
    setPreviewError(false);
  };

  useEffect(() => {
    return () => {
      if (selectedObjectUrl) {
        URL.revokeObjectURL(selectedObjectUrl);
      }
    };
  }, [selectedObjectUrl]);

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
    if (formState.intakeDate && !/^\d{4}-\d{2}-\d{2}$/.test(formState.intakeDate)) {
      errors.intakeDate = "Tanggal tidak valid";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSaving(false);
      const firstKey = Object.keys(errors)[0];
      if (firstKey === "fullName" && fullNameRef.current) fullNameRef.current.focus();
      else if (firstKey === "userName" && userNameRef.current) userNameRef.current.focus();
      else if (firstKey === "intakeDate" && intakeDateRef.current) intakeDateRef.current.focus();
      return;
    }
    setValidationErrors({});

    try {
      if (selectedFile) {
        const fd = new FormData();
        fd.append("avatar", selectedFile);
        const payloadObj = buildProfilePatchPayload(formState);
        Object.keys(payloadObj).forEach((k) => {
          const v = payloadObj[k];
          if (v !== undefined && v !== null) fd.append(k, v);
        });
        const res = await onSave(fd);
        // show success
        showToast("Profil berhasil diperbarui", { type: "success" });
        return res;
      }

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
                <img src={previewSrc} alt="avatar preview" className="h-20 w-20 object-cover" />
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
              <div className="mt-2 text-[13px] text-(--color-secondary)">atau upload file avatar</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                className="mt-2"
              />
              {selectedFile && (
                <div className="mt-2 text-[12px] text-(--color-secondary)">{selectedFile.name}</div>
              )}
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
                <span className="text-[13px] font-semibold text-(--color-dark)">Tanggal Masuk</span>
                <input
                  ref={intakeDateRef}
                  type="date"
                  value={formState.intakeDate}
                  onChange={(event) => handleChange("intakeDate", event.target.value)}
                  className="w-full rounded-2xl border border-[#dbe2f1] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-(--color-like-blue)"
                />
                {validationErrors.intakeDate && (
                  <p className="mt-1 text-[12px] text-red-600">{validationErrors.intakeDate}</p>
                )}
              </label>
            </div>
          </div>

          {isStudentProfile ? (
            <div className="mt-6 rounded-[22px] border border-[#eef1f6] bg-white p-4">
              <p className="text-[13px] font-semibold text-(--color-dark)">Data Mahasiswa</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-[13px] font-semibold text-(--color-dark)">Jenjang</span>
                  <input
                    value={formState.degree}
                    onChange={(event) => handleChange("degree", event.target.value)}
                    className="w-full rounded-2xl border border-[#dbe2f1] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-(--color-like-blue)"
                    placeholder="S1 / D3 / ..."
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-[13px] font-semibold text-(--color-dark)">Jurusan</span>
                  <input
                    value={formState.major}
                    onChange={(event) => handleChange("major", event.target.value)}
                    className="w-full rounded-2xl border border-[#dbe2f1] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-(--color-like-blue)"
                    placeholder="Teknik Informatika"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-[13px] font-semibold text-(--color-dark)">Nama Kampus</span>
                  <input
                    value={formState.campusName}
                    onChange={(event) => handleChange("campusName", event.target.value)}
                    className="w-full rounded-2xl border border-[#dbe2f1] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-(--color-like-blue)"
                    placeholder="Nama kampus"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {isAlumniProfile ? (
            <div className="mt-6 rounded-[22px] border border-[#eef1f6] bg-white p-4">
              <p className="text-[13px] font-semibold text-(--color-dark)">Data Alumni</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-[13px] font-semibold text-(--color-dark)">Kampus (satu baris per item)</span>
                  <textarea
                    rows={3}
                    value={formState.campuses}
                    onChange={(event) => handleChange("campuses", event.target.value)}
                    className="w-full rounded-2xl border border-[#dbe2f1] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-(--color-like-blue)"
                    placeholder="Kampus A\nKampus B"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-[13px] font-semibold text-(--color-dark)">Tempat Kerja (satu baris per item)</span>
                  <textarea
                    rows={3}
                    value={formState.workplaces}
                    onChange={(event) => handleChange("workplaces", event.target.value)}
                    className="w-full rounded-2xl border border-[#dbe2f1] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-(--color-like-blue)"
                    placeholder="Perusahaan A\nPerusahaan B"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-[#dbe2f1] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={formState.isMentor}
                    onChange={(event) => handleChange("isMentor", event.target.checked)}
                    className="h-4 w-4 rounded border-[#cbd5e1]"
                  />
                  <span className="text-[13px] font-semibold text-(--color-dark)">Mentor</span>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-[#dbe2f1] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={formState.isPhd}
                    onChange={(event) => handleChange("isPhd", event.target.checked)}
                    className="h-4 w-4 rounded border-[#cbd5e1]"
                  />
                  <span className="text-[13px] font-semibold text-(--color-dark)">PhD</span>
                </label>
              </div>
            </div>
          ) : null}

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

  const isStudentProfile = Boolean(profileData?.isStudent || displayRole === "Student");
  const isAlumniProfile = Boolean(profileData?.isAlumni || displayRole === "Alumni");

  const profileSummary = isStudentProfile
    ? [
        profileData?.degree && `Jenjang: ${profileData.degree}`,
        profileData?.major && `Jurusan: ${profileData.major}`,
        profileData?.campusName && `Kampus: ${profileData.campusName}`,
        profileData?.intakeDate &&
          `Masuk: ${new Date(profileData.intakeDate).getFullYear()}`,
        profileData?.field && `Bidang: ${profileData.field}`,
      ].filter(Boolean)
    : isAlumniProfile
      ? [
          profileData?.field && `Bidang: ${profileData.field}`,
          profileData?.campuses?.length
            ? `Kampus: ${profileData.campuses.join(", ")}`
            : null,
          profileData?.workplaces?.length
            ? `Tempat kerja: ${profileData.workplaces.join(", ")}`
            : null,
          profileData?.isMentor ? "Mentor" : null,
          profileData?.isPhd ? "PhD" : null,
        ].filter(Boolean)
      : [];

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

      <main className="mx-auto w-full max-w-316 px-4 pb-12 pt-6 lg:px-0">
        {/* Header dengan Avatar dan Info Dasar */}
        <section className="px-8 py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full text-[36px] font-black text-(--color-dark)">
                  {displayName
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>

            {/* Info Dasar */}
            <div className="flex-1">
              <h1 className="text-[32px] leading-10 font-extrabold text-(--color-dark)">
                {displayName}
              </h1>
              <p className="mt-1 text-[16px] text-(--color-secondary)">
                @{profileData.userName}
              </p>

              <div className="mt-4 text-[13px] font-semibold text-(--color-secondary)">
                {displayRole}
              </div>

              {profileSummary.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 text-[13px] text-(--color-secondary)">
                  {profileSummary.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-(--color-light-blue) bg-white px-3 py-1">
                      {item}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={handleOpenEdit} className="rounded-full bg-[#25343f] px-6 py-2 text-[14px] font-semibold text-white transition hover:bg-[#1f2c35]">
                  Edit Profil
                </button>
                <button className="rounded-full border border-(--color-gray) px-6 py-2 text-[14px] font-semibold text-(--color-dark) transition hover:bg-(--color-gray)" onClick={() => {
                  try {
                    navigator.clipboard.writeText(window.location.href);
                  } catch { /* ignore */ }
                }}>
                  Salin Link Profil
                </button>
              </div>
            </div>
          </div>
        </section>

        {isEditing && (
          <ProfileEditModal
            profile={profileData}
            onClose={handleCloseEdit}
            onSave={handleSaveProfile}
          />
        )}

        {/* Grid Konten */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-6">
            {/* Pendidikan */}
            {school && (
              <article className="rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
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
              <article className="rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
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

            {profileData.campuses?.length > 0 && isAlumniProfile && (
              <article className="rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
                  <Icon icon={GraduationCap} className="h-6 w-6 text-(--color-like-blue)" />
                  <h2 className="text-[18px] font-bold text-(--color-dark)">
                    Kampus
                  </h2>
                </div>

                <div className="mt-4 space-y-2 text-[14px] text-(--color-secondary)">
                  {profileData.campuses.map((campus) => (
                    <p key={campus}>{campus}</p>
                  ))}
                </div>
              </article>
            )}

            {profileData.workplaces?.length > 0 && isAlumniProfile && (
              <article className="rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
                  <Icon icon={Briefcase} className="h-6 w-6 text-(--color-like-blue)" />
                  <h2 className="text-[18px] font-bold text-(--color-dark)">
                    Tempat Kerja
                  </h2>
                </div>

                <div className="mt-4 space-y-2 text-[14px] text-(--color-secondary)">
                  {profileData.workplaces.map((workplace) => (
                    <p key={workplace}>{workplace}</p>
                  ))}
                </div>
              </article>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-19.5">
            {/* Tentang Profil */}
            <section className="rounded-[14px] border border-[#f3f4f6] bg-white p-5.25 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
              <h3 className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-[#101828]">
                <Icon icon={Users} className="h-4 w-4" />
                Info Profil
              </h3>
              <div className="space-y-3 text-[13px] text-(--color-secondary)">
                <div>
                  <p className="font-semibold text-(--color-dark)">Bergabung</p>
                  <p>
                    {profileData.createdAt
                      ? new Date(profileData.createdAt).toLocaleDateString("id-ID")
                      : "-"}
                  </p>
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
            <section className="rounded-[14px] border border-[#f3f4f6] bg-white p-5.25 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
              <h3 className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-[#101828]">
                <Icon icon={Share2} className="h-4 w-4" />
                Bagikan
              </h3>
              <div className="space-y-2">
                <button className="w-full rounded-lg border border-(--color-gray) bg-white px-3 py-2 text-[13px] font-medium text-(--color-dark) transition hover:bg-(--color-gray)">
                  Copy Link
                </button>
                <button className="w-full rounded-lg bg-(--color-dark) px-3 py-2 text-[13px] font-medium text-white transition hover:bg-[#1f2c35]">
                  Share
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <FooterSection socialLinks={socialLinks} />
    </div>
  );
}
