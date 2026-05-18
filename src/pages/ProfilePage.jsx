import {
  Briefcase,
  GraduationCap,
  Link2,
  Mail,
  Share2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { getAuthToken } from "../services/authStorage.js";
import { FooterSection } from "./thread-detail/components/FooterSection.jsx";
import { Icon } from "./thread-detail/components/index.js";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
        setProfileData(result.data);
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

  const socialLinks = [
    { id: "soc-1", icon: Users, label: "Community" },
    { id: "soc-2", icon: Share2, label: "Share" },
    { id: "soc-3", icon: Link2, label: "Link" },
  ];

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
        <section className="rounded-2xl border border-(--color-light-blue) bg-white px-8 py-6 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={profileData.Avatar}
                alt={profileData.fullName}
                className="h-32 w-32 rounded-full border-4 border-(--color-light-blue) object-cover"
              />
            </div>

            {/* Info Dasar */}
            <div className="flex-1">
              <h1 className="text-[32px] leading-[40px] font-extrabold text-(--color-dark)">
                {profileData.fullName}
              </h1>
              <p className="mt-1 text-[16px] text-(--color-secondary)">
                @{profileData.userName}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-[#dbeafe] px-3 py-1 text-[13px] font-semibold text-[#1e40af]">
                  {profileData.role}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[14px] text-(--color-secondary)">
                <Icon icon={Mail} className="h-4 w-4" />
                {profileData.email}
              </div>

              {/* Follow Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[20px] font-bold text-(--color-dark)">
                    {profileData.followersCount}
                  </span>
                  <span className="text-[12px] text-(--color-secondary)">
                    Pengikut
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[20px] font-bold text-(--color-dark)">
                    {profileData.followingCount}
                  </span>
                  <span className="text-[12px] text-(--color-secondary)">
                    Mengikuti
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-full bg-[#25343f] px-6 py-2 text-[14px] font-semibold text-white transition hover:bg-[#1f2c35]">
                  Ikuti
                </button>
                <button className="rounded-full border border-(--color-gray) px-6 py-2 text-[14px] font-semibold text-(--color-dark) transition hover:bg-(--color-gray)">
                  Pesan
                </button>
              </div>
            </div>
          </div>
        </section>

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
                    {new Date(profileData.createdAt).toLocaleDateString(
                      "id-ID",
                    )}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-(--color-dark)">
                    ID Pengguna
                  </p>
                  <p className="truncate font-mono text-[12px]">
                    {profileData.id}
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
