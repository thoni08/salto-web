import { useMemo, useState } from "react";
import {
  AtSign,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CalendarDays,
  Eye,
  EyeOff,
  GraduationCap,
  IdCard,
  Landmark,
  LockKeyhole,
  Loader2,
  Mail,
  UserRound,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthField } from "../components/auth/AuthField.jsx";
import { AuthShell } from "../components/auth/AuthShell.jsx";
import { registerUser } from "../services/saltoApi.js";

const degreeOptions = ["D3", "D4", "S1", "S2", "S3"];
const angkatanOptions = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
const fromYearOptions = [
  2030, 2029, 2028, 2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020,
];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SelectShell({ icon, error, children }) {
  const Icon = icon;
  const controlClassName =
    "h-11 w-full appearance-none rounded-[13px] border-0 bg-transparent pl-11 pr-11 outline-none";

  return (
    <div
      className={`relative flex items-center rounded-[13px] border bg-(--color-gray) ${
        error
          ? "border-red-500"
          : "border-(--color-gray) focus-within:border-(--color-gray) focus-within:ring-2 focus-within:ring-(--color-light-blue)"
      }`}>
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--color-secondary)" />
      {typeof children === "function" ? children(controlClassName) : children}
      <svg
        className="pointer-events-none absolute right-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--color-secondary)"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function PasswordShell({ icon, error, showPassword, onToggle, children }) {
  const Icon = icon;
  const inputClassName =
    "h-11 w-full rounded-[13px] border-0 bg-transparent pl-11 pr-12 outline-none";

  return (
    <div
      className={`relative flex items-center rounded-[13px] border bg-(--color-gray) ${
        error
          ? "border-red-500"
          : "border-(--color-gray) focus-within:border-(--color-gray) focus-within:ring-2 focus-within:ring-(--color-light-blue)"
      }`}>
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--color-secondary)" />
      {typeof children === "function" ? children(inputClassName) : children}
      <button
        type="button"
        onClick={onToggle}
        aria-label={
          showPassword ? "Sembunyikan password" : "Tampilkan password"
        }
        className="absolute right-3 rounded-full p-2 text-(--color-secondary) transition hover:text-(--color-dark)">
        {showPassword ? (
          <EyeOff className="h-4.5 w-4.5" />
        ) : (
          <Eye className="h-4.5 w-4.5" />
        )}
      </button>
    </div>
  );
}

function RoleButton({ active, icon, title, description, onClick }) {
  const Icon = icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-[18px] border px-3 py-3 text-center transition ${
        active
          ? "border-(--color-dark) bg-(--color-light-blue)/25 text-(--color-dark) shadow-[0_16px_26px_-24px_rgba(37,52,63,.45)]"
          : "border-[#dde4fb] bg-white text-(--color-secondary) hover:-translate-y-0.5 hover:border-(--color-like-blue)/60"
      }`}>
      <Icon className="h-5.5 w-5.5" strokeWidth={1.9} />
      <strong className="text-[13px] font-bold">{title}</strong>
      <span className="text-[10px] leading-4">{description}</span>
    </button>
  );
}

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const initialRoleParam = String(searchParams.get("role") || "").toLowerCase();
  const initialRole = initialRoleParam === "alumni" ? "alumni" : "mahasiswa";
  const [role, setRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const [values, setValues] = useState({
    userName: "",
    nama: "",
    email: "",
    nim: "",
    campusName: "",
    degree: "",
    prodi: "",
    angkatan: "",
    password: "",
    confirm: "",
    // Alumni-specific fields
    workPlace: "",
    fromYear: "",
    isPhd: false,
    isMentor: false,
    terms: false,
  });


  const errors = useMemo(
    () => ({
      userName: !values.userName ? "Username wajib diisi." : "",
      nama: !values.nama ? "Nama lengkap wajib diisi." : "",
      email: !values.email
        ? "Email wajib diisi."
        : !emailRegex.test(values.email)
          ? "Masukkan email yang valid."
          : "",
      nim: !values.nim ? "NIM wajib diisi." : "",
      campusName: !values.campusName ? "Nama kampus wajib diisi." : "",
      prodi: !values.prodi ? "Program studi wajib diisi." : "",
      angkatan: !values.angkatan ? "Pilih angkatan." : "",
      password: !values.password
        ? "Password wajib diisi."
        : values.password.length < 8
          ? "Password minimal 8 karakter."
          : "",
      confirm: !values.confirm
        ? "Konfirmasi password wajib diisi."
        : values.confirm !== values.password
          ? "Password belum cocok."
          : "",
      workPlace:
        role === "alumni" && !values.workPlace
          ? "Tempat kerja wajib diisi."
          : "",
      fromYear:
        role === "alumni" && !values.fromYear
          ? "Pilih tahun mulai kerja."
          : "",
      terms: !values.terms ? "Kamu harus menyetujui syarat & ketentuan." : "",
    }),
    [role, values],
  );

  const hasError = (key) => submitted && Boolean(errors[key]);

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setSubmitted(false);
    setIsSuccess(false);
    setApiError("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (apiError) setApiError("");
  };

  const buildRequestBody = () => {
    const basePayload = {
      userName: values.userName.trim(),
      fullName: values.nama.trim(),
      Avatar: "",
      email: values.email.trim(),
      nim: values.nim.trim(),
      campusName: values.campusName.trim(),
      prodi: values.prodi.trim(),
      degree: values.degree || "D4",
      angkatan: values.angkatan,
      password: values.password,
      confirmPassword: values.confirm,
      role: role === "mahasiswa" ? "Student" : "Alumni",
    };

    if (role === "alumni") {
      return {
        ...basePayload,
        workPlace: values.workPlace.trim(),
        fromYear: Number(values.fromYear) || new Date().getFullYear(),
        isPhd: Boolean(values.isPhd),
        isMentor: Boolean(values.isMentor),
      };
    }

    return basePayload;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setApiError("");

    const isValid = Object.values(errors).every((message) => !message);
    if (!isValid) return;

    setIsLoading(true);

    registerUser(buildRequestBody())
      .then(() => {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      })
      .catch((error) => {
        setApiError(error.message || "Registrasi gagal. Silakan coba lagi.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AuthShell
      title="Buat Akun Baru"
      subtitle="Daftar sebagai mahasiswa atau alumni untuk mulai memakai SALTO."
      cardClassName="max-w-[44rem]"
      footer={
        <div className="border-t border-(--color-gray) pt-5 text-center text-sm text-(--color-secondary)">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-bold text-(--color-like-blue) transition hover:opacity-80">
            Masuk Sekarang
          </Link>
        </div>
      }>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-2.5">
          {/* ── Role selector ── */}
          <div className="grid gap-2.5" id="f-role">
            <label className="text-[12px] font-bold text-(--color-dark)">
              Daftar sebagai <span className="text-(--color-primary)">*</span>
            </label>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <RoleButton
                active={role === "mahasiswa"}
                icon={GraduationCap}
                title="Mahasiswa"
                description="Masih kuliah"
                onClick={() => handleRoleChange("mahasiswa")}
              />
              <RoleButton
                active={role === "alumni"}
                icon={BadgeCheck}
                title="Alumni"
                description="Sudah lulus"
                onClick={() => handleRoleChange("alumni")}
              />
            </div>
          </div>

          {/* ── Username + Nama Lengkap ── */}
          <div className="grid gap-2 sm:grid-cols-2">
            <AuthField
              compact
              id="userName"
              label="Username"
              error={hasError("userName") ? errors.userName : ""}>
              <div className="relative flex items-center">
                <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--color-secondary)" />
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  placeholder="Username unik"
                  value={values.userName}
                  onChange={handleChange}
                  aria-invalid={hasError("userName")}
                  aria-describedby={
                    hasError("userName") ? "userName-error" : undefined
                  }
                  className="h-11 w-full rounded-[13px] border border-(--color-gray) bg-(--color-gray) pl-11 pr-4 outline-none transition focus:border-(--color-gray) focus:ring-2 focus:ring-(--color-light-blue)"
                />
              </div>
            </AuthField>

            <AuthField
              compact
              id="nama"
              label="Nama Lengkap"
              error={hasError("nama") ? errors.nama : ""}>
              <div className="relative flex items-center">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--color-secondary)" />
                <input
                  id="nama"
                  name="nama"
                  type="text"
                  placeholder="Nama sesuai identitas"
                  value={values.nama}
                  onChange={handleChange}
                  aria-invalid={hasError("nama")}
                  aria-describedby={
                    hasError("nama") ? "nama-error" : undefined
                  }
                  className="h-11 w-full rounded-[13px] border border-(--color-gray) bg-(--color-gray) pl-11 pr-4 outline-none transition focus:border-(--color-gray) focus:ring-2 focus:ring-(--color-light-blue)"
                />
              </div>
            </AuthField>
          </div>

          {/* ── Email ── */}
          <AuthField
            compact
            id="email"
            label="Email"
            error={hasError("email") ? errors.email : ""}>
            <div className="relative flex items-center">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--color-secondary)" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="nama@kampus.ac.id"
                value={values.email}
                onChange={handleChange}
                aria-invalid={hasError("email")}
                aria-describedby={
                  hasError("email") ? "email-error" : undefined
                }
                className="h-11 w-full rounded-[13px] border border-(--color-gray) bg-(--color-gray) pl-11 pr-4 outline-none transition focus:border-(--color-gray) focus:ring-2 focus:ring-(--color-light-blue)"
              />
            </div>
          </AuthField>

          {/* ── Data Akademik (shared by both roles) ── */}
          <div className="grid gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[12px] font-bold text-(--color-dark)">
                Data Akademik
              </h2>
              <span className="text-[11px] text-(--color-secondary)">
                Isi data akademik kamu
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <AuthField
                compact
                id="nim"
                label="NIM"
                error={hasError("nim") ? errors.nim : ""}>
                <div className="relative flex items-center">
                  <IdCard className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--color-secondary)" />
                  <input
                    id="nim"
                    name="nim"
                    type="text"
                    inputMode="numeric"
                    placeholder="Nomor Induk Mahasiswa"
                    value={values.nim}
                    onChange={handleChange}
                    aria-invalid={hasError("nim")}
                    aria-describedby={
                      hasError("nim") ? "nim-error" : undefined
                    }
                    className="h-11 w-full rounded-[13px] border border-(--color-gray) bg-(--color-gray) pl-11 pr-4 outline-none transition focus:border-(--color-gray) focus:ring-2 focus:ring-(--color-light-blue)"
                  />
                </div>
              </AuthField>

              <AuthField
                compact
                id="angkatan"
                label="Angkatan"
                error={hasError("angkatan") ? errors.angkatan : ""}>
                <SelectShell
                  icon={CalendarDays}
                  error={hasError("angkatan")}>
                  {(baseClass) => (
                    <select
                      id="angkatan"
                      name="angkatan"
                      value={values.angkatan}
                      onChange={handleChange}
                      aria-invalid={hasError("angkatan")}
                      aria-describedby={
                        hasError("angkatan") ? "angkatan-error" : undefined
                      }
                      className={baseClass}>
                      <option value="">Pilih tahun</option>
                      {angkatanOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  )}
                </SelectShell>
              </AuthField>
            </div>

            <AuthField
              compact
              id="campusName"
              label="Nama Kampus"
              error={hasError("campusName") ? errors.campusName : ""}>
              <div className="relative flex items-center">
                <Landmark className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--color-secondary)" />
                <input
                  id="campusName"
                  name="campusName"
                  type="text"
                  placeholder="Contoh: Politeknik Elektronika Negeri Surabaya"
                  value={values.campusName}
                  onChange={handleChange}
                  aria-invalid={hasError("campusName")}
                  aria-describedby={
                    hasError("campusName") ? "campusName-error" : undefined
                  }
                  className="h-11 w-full rounded-[13px] border border-(--color-gray) bg-(--color-gray) pl-11 pr-4 outline-none transition focus:border-(--color-gray) focus:ring-2 focus:ring-(--color-light-blue)"
                />
              </div>
            </AuthField>

            <div className="grid gap-2 sm:grid-cols-2">
              <AuthField compact id="degree" label="Jenjang" error="">
                <SelectShell icon={GraduationCap} error={false}>
                  {(baseClass) => (
                    <select
                      id="degree"
                      name="degree"
                      value={values.degree}
                      onChange={handleChange}
                      className={baseClass}>
                      <option value="">Pilih jenjang</option>
                      {degreeOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  )}
                </SelectShell>
              </AuthField>

              <AuthField
                compact
                id="prodi"
                label="Program Studi"
                error={hasError("prodi") ? errors.prodi : ""}>
                <div className="relative flex items-center">
                  <BookOpen className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--color-secondary)" />
                  <input
                    id="prodi"
                    name="prodi"
                    type="text"
                    placeholder="Contoh: Teknik Informatika"
                    value={values.prodi}
                    onChange={handleChange}
                    aria-invalid={hasError("prodi")}
                    aria-describedby={
                      hasError("prodi") ? "prodi-error" : undefined
                    }
                    className="h-11 w-full rounded-[13px] border border-(--color-gray) bg-(--color-gray) pl-11 pr-4 outline-none transition focus:border-(--color-gray) focus:ring-2 focus:ring-(--color-light-blue)"
                  />
                </div>
              </AuthField>
            </div>
          </div>

          {/* ── Data Profesional (Alumni only) ── */}
          {role === "alumni" && (
            <div className="grid gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[12px] font-bold text-(--color-dark)">
                  Data Profesional
                </h2>
                <span className="text-[11px] text-(--color-secondary)">
                  Isi data profesional kamu
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <AuthField
                  compact
                  id="workPlace"
                  label="Tempat Kerja"
                  error={hasError("workPlace") ? errors.workPlace : ""}>
                  <div className="relative flex items-center">
                    <Briefcase className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-(--color-secondary)" />
                    <input
                      id="workPlace"
                      name="workPlace"
                      type="text"
                      placeholder="Contoh: Google Corp"
                      value={values.workPlace}
                      onChange={handleChange}
                      aria-invalid={hasError("workPlace")}
                      aria-describedby={
                        hasError("workPlace") ? "workPlace-error" : undefined
                      }
                      className="h-11 w-full rounded-[13px] border border-(--color-gray) bg-(--color-gray) pl-11 pr-4 outline-none transition focus:border-(--color-gray) focus:ring-2 focus:ring-(--color-light-blue)"
                    />
                  </div>
                </AuthField>

                <AuthField
                  compact
                  id="fromYear"
                  label="Tahun Mulai Kerja"
                  error={hasError("fromYear") ? errors.fromYear : ""}>
                  <SelectShell
                    icon={CalendarDays}
                    error={hasError("fromYear")}>
                    {(baseClass) => (
                      <select
                        id="fromYear"
                        name="fromYear"
                        value={values.fromYear}
                        onChange={handleChange}
                        aria-invalid={hasError("fromYear")}
                        aria-describedby={
                          hasError("fromYear") ? "fromYear-error" : undefined
                        }
                        className={baseClass}>
                        <option value="">Pilih tahun</option>
                        {fromYearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    )}
                  </SelectShell>
                </AuthField>
              </div>

              <div className="flex gap-6 py-1">
                <label className="inline-flex cursor-pointer items-center gap-2 text-[12px] font-medium text-(--color-dark)">
                  <input
                    type="checkbox"
                    name="isPhd"
                    checked={values.isPhd}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-[#dbe3f3] text-(--color-dark) focus:ring-(--color-like-blue)"
                  />
                  Sedang / sudah menempuh PhD
                </label>

                <label className="inline-flex cursor-pointer items-center gap-2 text-[12px] font-medium text-(--color-dark)">
                  <input
                    type="checkbox"
                    name="isMentor"
                    checked={values.isMentor}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-[#dbe3f3] text-(--color-dark) focus:ring-(--color-like-blue)"
                  />
                  Bersedia menjadi mentor
                </label>
              </div>
            </div>
          )}

          {/* ── Password ── */}
          <AuthField
            compact
            id="password"
            label="Password"
            error={hasError("password") ? errors.password : ""}>
            <PasswordShell
              icon={LockKeyhole}
              error={hasError("password")}
              showPassword={showPassword}
              onToggle={() => setShowPassword((previous) => !previous)}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                value={values.password}
                onChange={handleChange}
                aria-invalid={hasError("password")}
                aria-describedby={
                  hasError("password") ? "password-error" : undefined
                }
                className="h-11 w-full rounded-[13px] border-0 bg-transparent pl-11 pr-12 outline-none"
              />
            </PasswordShell>
          </AuthField>

          {/* ── Konfirmasi Password ── */}
          <AuthField
            compact
            id="confirm"
            label="Konfirmasi Password"
            error={hasError("confirm") ? errors.confirm : ""}>
            <PasswordShell
              icon={LockKeyhole}
              error={hasError("confirm")}
              showPassword={showConfirm}
              onToggle={() => setShowConfirm((previous) => !previous)}>
              <input
                id="confirm"
                name="confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Ulangi password"
                value={values.confirm}
                onChange={handleChange}
                aria-invalid={hasError("confirm")}
                aria-describedby={
                  hasError("confirm") ? "confirm-error" : undefined
                }
                className="h-11 w-full rounded-[13px] border-0 bg-transparent pl-11 pr-12 outline-none"
              />
            </PasswordShell>
          </AuthField>

          {/* ── Syarat & Ketentuan ── */}
          <div id="f-terms">
            <label className="flex items-start gap-3 py-3 text-[12px] leading-5.5 text-[#566174]">
              <input
                type="checkbox"
                name="terms"
                checked={values.terms}
                onChange={handleChange}
                className="h-4.5 w-4.5 text-center rounded border-[#dbe3f3] text-(--color-dark) focus:ring-(--color-like-blue)"
              />
              <span>
                Dengan mendaftar, kamu menyetujui{" "}
                <a className="font-bold text-(--color-like-blue)" href="#">
                  Syarat &amp; Ketentuan
                </a>{" "}
                dan{" "}
                <a className="font-bold text-(--color-like-blue)" href="#">
                  Kebijakan Privasi
                </a>{" "}
                SALTO.
              </span>
            </label>
            {hasError("terms") ? (
              <p
                id="terms-error"
                aria-live="polite"
                className="text-xs font-medium text-red-600">
                {errors.terms}
              </p>
            ) : null}
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-(--color-dark) text-[14px] font-bold text-white shadow-[0_18px_28px_-20px_rgba(37,52,63,.7)] transition hover:-translate-y-px hover:shadow-[0_24px_34px_-24px_rgba(37,52,63,.8)] disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:translate-y-0">
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Mendaftarkan...
              </>
            ) : isSuccess ? (
              "✓ Berhasil Daftar — Mengalihkan..."
            ) : (
              "Daftar"
            )}
          </button>

          {apiError ? (
            <p
              aria-live="assertive"
              className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs font-semibold text-red-600">
              {apiError}
            </p>
          ) : null}

          {submitted &&
          !isSuccess &&
          !apiError &&
          Object.values(errors).some(Boolean) ? (
            <p className="text-center text-xs font-semibold text-red-600">
              Periksa kembali data pendaftaran sebelum melanjutkan.
            </p>
          ) : null}
        </div>
      </form>
    </AuthShell>
  );
}
