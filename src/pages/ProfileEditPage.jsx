import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { getAuthToken, updateAuthUser } from "../services/authStorage.js";
import { fetchCurrentUser, updateUserProfile } from "../services/saltoApi.js";
import { ProfileEditModal } from "./ProfilePage.jsx";

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
    // School/work info typically live under `schools[]` and `works[]`.
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

export default function ProfileEditPage() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        if (!token) throw new Error("Kamu perlu login terlebih dulu.");

        const response = await fetchCurrentUser();
        const json = response?.data || response;
        setProfileData(normalizeProfileData(json));
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const _handleSave = async (patchPayload) => {
    const token = getAuthToken();
    if (!token) throw new Error("Tidak ada token. Silakan login ulang.");

    const response = await updateUserProfile(patchPayload, profileData?.id || "");
    const updatedUser = response?.data || response?.user || response || {};
    const normalized = normalizeProfileData(updatedUser);
    setProfileData(normalized);
    updateAuthUser(updatedUser);
    navigate("/profile");
  };

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

  return (
    <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 pb-12 pt-10">
        <ProfileEditModal
          profile={profileData}
          variant="inline"
          onClose={() => navigate(-1)}
          onSave={async (payload) => {
            await _handleSave(payload);
          }}
        />
      </main>
    </div>
  );
}
