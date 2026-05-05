import { LogOut, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { clearAuthSession, getAuthToken } from "../services/authStorage.js";
import { fetchUsers } from "../services/saltoApi.js";

const PAGE_SIZE = 8;

function UserCard({ user }) {
  return (
    <article className="rounded-2xl border border-[#dbe2f1] bg-white p-4 shadow-[0_14px_26px_-24px_rgba(37,52,63,0.32)]">
      <div className="flex items-start gap-4">
        <img
          src={user.avatar}
          alt={user.fullName}
          className="h-14 w-14 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[16px] font-bold text-(--color-dark)">
              {user.fullName}
            </h3>
            <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[11px] font-semibold text-(--color-like-blue)">
              {user.role}
            </span>
          </div>
          <p className="mt-1 text-[13px] text-(--color-secondary)">
            @{user.userName} • {user.email}
          </p>
          <p className="mt-2 text-[13px] text-(--color-dark)">{user.field}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[12px] text-(--color-secondary)">
            {user.school?.campusName ? (
              <span className="rounded-full bg-[#f8fafc] px-2 py-1">
                {user.school.campusName}
              </span>
            ) : null}
            {user.school?.degree ? (
              <span className="rounded-full bg-[#f8fafc] px-2 py-1">
                {user.school.degree}
              </span>
            ) : null}
            {user.work?.workPlace ? (
              <span className="rounded-full bg-[#f8fafc] px-2 py-1">
                {user.work.workPlace}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function UsersPage() {
  const token = getAuthToken();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    let active = true;

    async function loadUsers() {
      setLoading(true);
      setError("");

      try {
        const response = await fetchUsers({
          token,
          page,
          limit: PAGE_SIZE,
          search,
        });

        if (!active) return;

        setUsers(response.data || []);
        setPagination(
          response.pagination || {
            page,
            limit: PAGE_SIZE,
            total: response.data?.length || 0,
            totalPages: 1,
          },
        );
      } catch (loadError) {
        if (!active) return;
        setError(loadError.message || "Gagal memuat data user.");
        setUsers([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      active = false;
    };
  }, [token, page, search]);

  const canGoBack = page > 1;
  const canGoNext = page < pagination.totalPages;

  const handleLogout = () => {
    clearAuthSession();
    window.location.href = "/login";
  };

  const pageSummary = useMemo(
    () => `${pagination.total} user terdaftar`,
    [pagination.total],
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
      <SiteHeader activeHref="/users" authActions={[]} />

      <main className="mx-auto w-full max-w-316 px-4 py-8 lg:px-0">
        <section className="rounded-3xl border border-(--color-light-blue) bg-white p-6 shadow-[0_18px_30px_-28px_rgba(37,52,63,0.45)] lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eef1f6] pb-5">
            <div>
              <p className="text-[13px] text-(--color-like-blue)">API Test</p>
              <h1 className="mt-1 text-[30px] font-bold text-(--color-dark)">
                List Semua User
              </h1>
              <p className="mt-1 text-[14px] text-(--color-secondary)">
                {pageSummary}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe2f1] px-4 py-2 text-[14px] font-semibold text-(--color-dark) transition hover:bg-[#f8fafc]">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex h-11 items-center rounded-2xl border border-[#dbe2f1] bg-white px-4 shadow-[0_10px_30px_-26px_rgba(37,52,63,0.28)] sm:max-w-md sm:flex-1">
              <Search className="h-5 w-5 text-(--color-secondary)" />
              <input
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Cari nama, username, email, atau bidang..."
                className="ml-3 w-full bg-transparent text-[14px] outline-none placeholder:text-(--color-secondary)"
              />
            </label>

            <div className="text-[13px] text-(--color-secondary)">
              Endpoint: <span className="font-semibold">GET /api/users</span>
            </div>
          </div>

          {error ? (
            <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
              {error}
            </p>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {loading ? (
              <div className="col-span-full rounded-2xl border border-dashed border-(--color-light-blue) bg-[#f8fafc] px-6 py-10 text-center text-[14px] text-(--color-secondary)">
                Memuat data user...
              </div>
            ) : users.length > 0 ? (
              users.map((user) => <UserCard key={user.id} user={user} />)
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-(--color-light-blue) bg-[#f8fafc] px-6 py-10 text-center text-[14px] text-(--color-secondary)">
                Tidak ada user yang cocok dengan pencarian ini.
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eef1f6] pt-5">
            <p className="text-[13px] text-(--color-secondary)">
              Halaman {pagination.page} dari {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={!canGoBack}
                className="rounded-full border border-[#dbe2f1] px-4 py-2 text-[14px] font-semibold text-(--color-dark) transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50">
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={!canGoNext}
                className="rounded-full bg-(--color-dark) px-4 py-2 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                Berikutnya
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
