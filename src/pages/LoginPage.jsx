import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthField } from "../components/auth/AuthField.jsx";
import { AuthShell } from "../components/auth/AuthShell.jsx";

function LoginPage() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const errors = {
    email: !formValues.email
      ? "Email wajib diisi."
      : !emailRegex.test(formValues.email)
        ? "Format email belum valid."
        : "",
    password: !formValues.password
      ? "Password wajib diisi."
      : formValues.password.length < 8
        ? "Password minimal 8 karakter."
        : "",
  };

  const emailHasError = (touched.email || submitted) && Boolean(errors.email);
  const passwordHasError =
    (touched.password || submitted) && Boolean(errors.password);
  const formIsValid = !errors.email && !errors.password;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    if (name === "email" || name === "password") {
      setTouched((previous) => ({ ...previous, [name]: true }));
    }
  };

  const handlePlaceholderClick = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!formIsValid) {
      return;
    }

    localStorage.setItem("authToken", "dummy-token-123");
    navigate("/");
  };

  return (
    <AuthShell
      title="Selamat Datang"
      subtitle="Masuk untuk melanjutkan diskusimu bersama alumni"
      footer={
        <footer className="border-t border-(--color-gray) pt-5 text-center text-sm text-(--color-secondary)">
          Belum punya akun?{" "}
          <Link
            to="/signup"
            className="font-semibold text-(--color-like-blue) transition hover:opacity-80">
            Daftar Sekarang
          </Link>
        </footer>
      }>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5">
          <AuthField
            id="email"
            label="Email"
            error={emailHasError ? errors.email : ""}>
            <div
              className={`group flex items-center rounded-2xl border bg-(--color-gray) px-3 transition ${
                emailHasError
                  ? "border-red-600 focus-within:border-red-600"
                  : "border-(--color-gray) focus-within:border-(--color-gray) focus-within:ring-2 focus-within:ring-(--color-light-blue)"
              }`}>
              <span
                className="mr-2 text-(--color-secondary)"
                aria-hidden="true">
                <Mail className="h-5 w-5" strokeWidth={1.75} />
              </span>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                autoComplete="email"
                value={formValues.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={emailHasError}
                aria-describedby={emailHasError ? "email-error" : undefined}
                className="h-11 w-full bg-transparent text-sm text-(--color-dark) outline-none placeholder:text-(--color-secondary)"
              />
            </div>
          </AuthField>

          <AuthField
            id="password"
            label="Password"
            error={passwordHasError ? errors.password : ""}>
            <div
              className={`group flex items-center rounded-2xl border bg-(--color-gray) px-3 transition ${
                passwordHasError
                  ? "border-red-600 focus-within:border-red-600"
                  : "border-(--color-gray) focus-within:border-(--color-gray) focus-within:ring-2 focus-within:ring-(--color-light-blue)"
              }`}>
              <span
                className="mr-2 text-(--color-secondary)"
                aria-hidden="true">
                <LockKeyhole className="h-5 w-5" strokeWidth={1.75} />
              </span>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                autoComplete="current-password"
                value={formValues.password}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={passwordHasError}
                aria-describedby={
                  passwordHasError ? "password-error" : undefined
                }
                className="h-11 w-full bg-transparent text-sm text-(--color-dark) outline-none placeholder:text-(--color-secondary)"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                className="ml-2 rounded-full p-1.5 text-(--color-secondary) transition hover:bg-(--color-light-blue) hover:text-(--color-dark) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-like-blue)">
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" strokeWidth={1.9} />
                ) : (
                  <Eye className="h-4.5 w-4.5" strokeWidth={1.9} />
                )}
              </button>
            </div>
          </AuthField>

          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-(--color-secondary)">
              <input
                name="rememberMe"
                type="checkbox"
                checked={formValues.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-(--color-gray) text-(--color-like-blue) focus:ring-(--color-like-blue)"
              />
              Ingat saya
            </label>

            <a
              href="#"
              onClick={handlePlaceholderClick}
              className="text-xs font-semibold text-(--color-like-blue) transition hover:opacity-80">
              Lupa Password?
            </a>
          </div>

          <button
            type="submit"
            className="mt-1 h-12 w-full rounded-2xl bg-(--color-dark) text-base font-bold text-white shadow-[0_14px_24px_-16px_rgba(37,52,63,0.9)] transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-light-blue) active:translate-y-px active:opacity-90">
            Masuk
          </button>

          {submitted && !formIsValid ? (
            <p className="text-center text-xs font-semibold text-red-600">
              Periksa kembali email dan password sebelum masuk.
            </p>
          ) : null}
        </div>
      </form>
    </AuthShell>
  );
}

export default LoginPage;
