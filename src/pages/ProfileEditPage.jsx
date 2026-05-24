import { Briefcase, GraduationCap, Link2, Mail, Share2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { getAuthToken, updateAuthUser } from "../services/authStorage.js";
import { updateUserProfile } from "../services/saltoApi.js";
import { Icon } from "./thread-detail/components/index.js";
import { ProfileEditModal } from "./ProfilePage.jsx";
import { useNavigate } from "react-router-dom";

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

        const res = await fetch("https://salto-be.aauaah.tech/api/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Gagal memuat data profil");

        const json = await res.json();
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
      <main className="mx-auto w-full max-w-316 px-4 pb-12 pt-6 lg:px-0">
        <section className="px-8 py-6">
          <h1 className="text-[24px] font-bold">Edit Profil</h1>
          <p className="mt-2 text-[13px] text-(--color-secondary)">Perbarui data profil Anda di halaman ini.</p>
        </section>

        <section className="mt-6">
          <div className="rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5">
            <ProfileEditModal
              profile={profileData}
              onClose={() => navigate(-1)}
              onSave={async (payload) => {
                await _handleSave(payload);
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
