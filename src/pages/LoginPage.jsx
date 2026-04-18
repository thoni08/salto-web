import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    if (name === "email" || name === "password") {
      setTouched((prev) => ({ ...prev, [name]: true }));
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-(--color-gray) px-4 py-12 font-sans">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at top, var(--color-light-blue), transparent 42%), radial-gradient(circle at bottom, var(--color-light-blue), transparent 36%)",
        }}
      />

      <section
        className="relative w-full max-w-120 rounded-3xl border border-(--color-gray) bg-white p-7 backdrop-blur-sm"
        aria-label="Form login">
        <header className="mb-6 text-center">
          <h1 className="text-[2rem] font-extrabold tracking-tight text-(--color-dark)">
            Selamat Datang
          </h1>
          <p className="text-sm leading-relaxed text-(--color-secondary)">
            Masuk untuk melanjutkan diskusimu bersama alumni
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-(--color-dark)">
              Email<span className="ml-0.5 text-red-600">*</span>
            </label>

            <div
              className={`mt-1.5 group flex items-center rounded-2xl border bg-(--color-gray) px-3 transition ${
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

            <p
              id="email-error"
              aria-live="polite"
              className={`min-h-5 text-xs font-medium ${
                emailHasError ? "text-red-600" : "text-transparent"
              }`}>
              {emailHasError ? errors.email : ""}
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-(--color-dark)">
              Password
              <span className="ml-0.5 text-red-600">*</span>
            </label>

            <div
              className={`mt-1.5 group flex items-center rounded-2xl border bg-(--color-gray) px-3 transition ${
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
                onClick={() => setShowPassword((prev) => !prev)}
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

            <p
              id="password-error"
              aria-live="polite"
              className={`min-h-5 text-xs font-medium ${
                passwordHasError ? "text-red-600" : "text-transparent"
              }`}>
              {passwordHasError ? errors.password : ""}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-(--color-secondary)    ">
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
            className="mt-6 h-12 w-full rounded-2xl bg-(--color-dark) text-base font-bold text-white shadow-[0_14px_24px_-16px_rgba(37,52,63,0.9)] transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-light-blue) active:translate-y-px active:opacity-90">
            Masuk
          </button>

          {submitted && !formIsValid ? (
            <p className="text-center text-xs font-semibold text-red-600">
              Periksa kembali email dan password sebelum masuk.
            </p>
          ) : null}
        </form>

        <footer className="border-t border-(--color-gray) pt-5 text-center text-sm text-(--color-secondary)">
          Belum punya akun?{" "}
          <Link
            href="/signup"
            onClick={handlePlaceholderClick}
            className="font-semibold text-(--color-like-blue) transition hover:opacity-80">
            Daftar Sekarang
          </Link>
        </footer>
      </section>
    </main>
  );
}

export default LoginPage;
