import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bookmark,
  BookmarkCheck,
  Clock3,
  Eye,
  Flame,
  GraduationCap,
  Link2,
  MessageCircle,
  PenSquare,
  Share2,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { useScrollDirection } from "../hooks/useScrollDirection";
import {
  getAuthToken,
  getAuthUser,
  updateAuthUser,
} from "../services/authStorage.js";
import {
  deleteComment,
  fetchCurrentUser,
  fetchIsFollowing,
  fetchRelatedThreads,
  fetchThreadComments,
  fetchThreadById,
  followUser,
  likeComment,
  mapApiThreadDetail,
  postThreadComment,
  saveThread,
  setBestAnswer,
  unlikeComment,
  unfollowUser,
  unsaveThread,
} from "../services/saltoApi.js";
import { stripInlineMarkdown } from "../utils/formatText.js";
import { showToast } from "../utils/toast.js";
import {
  AnswerCard,
  AnswerComposerCard,
  Avatar,
  ContributorCard,
  FooterSection,
  Icon,
} from "./thread-detail/components";
import {
  buttonFx,
  linkFx,
  preventPlaceholderClick,
} from "./thread-detail/constants";
import {
  answerComposerMinCharacters,
  answerComposerRestrictionMessage,
  answerComposerTip,
  currentViewer,
  getThreadDetailData,
  socialLinks,
} from "./thread-detail/data";
import { submitThreadAnswer } from "./thread-detail/threadDetailApi";

const MONTH_INDEX_BY_NAME = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const BREADCRUMB_HREF_BY_LABEL = {
  Beranda: "/",
  Diskusi: "/thread",
};

function roleIndicatesAlumni(role) {
  const normalized = String(role || "").toLowerCase();
  return normalized === "alumni" || normalized.includes("alumni");
}

function buildDraftStorageKey({ threadId, authUser }) {
  const userKey = String(authUser?.id || authUser?.userName || "guest").trim();
  return `draft:thread:${threadId}:user:${userKey || "guest"}`;
}

function normalizeAuthUser(rawUser) {
  const source =
    rawUser?.data || rawUser?.user || rawUser?.profile || rawUser || {};

  if (!source || typeof source !== "object") return null;

  return {
    ...source,
    fullName:
      source.fullName ||
      source.fullname ||
      source.name ||
      source.userName ||
      source.username ||
      "",
    userName: source.userName || source.username || "",
    role: source.role || "",
    field: source.field || "",
    email: source.email || "",
  };
}

function parseThreadTimestamp(createdAt) {
  const match = createdAt.match(
    /(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+·\s+(\d{2}):(\d{2})/,
  );

  if (!match) return 0;

  const day = Number(match[1]);
  const month = MONTH_INDEX_BY_NAME[match[2]] ?? 0;
  const year = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);

  return new Date(year, month, day, hour, minute).getTime();
}

function sortAnswerList(answerList, sortMode) {
  const sorted = [...answerList];

  sorted.sort((left, right) => {
    if (sortMode === "latest") {
      const latestDiff =
        parseThreadTimestamp(right.createdAt) -
        parseThreadTimestamp(left.createdAt);
      if (latestDiff !== 0) return latestDiff;
      return right.likes - left.likes;
    }

    const popularDiff = right.likes - left.likes;
    if (popularDiff !== 0) return popularDiff;
    return (
      parseThreadTimestamp(right.createdAt) -
      parseThreadTimestamp(left.createdAt)
    );
  });

  return sorted;
}

export default function ThreadDetailPage() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [sortModeByThread, setSortModeByThread] = useState({});
  const [submittedAnswersByThread, setSubmittedAnswersByThread] = useState({});
  const [apiThreadSnapshot, setApiThreadSnapshot] = useState(null);
  const [isThreadLoading, setIsThreadLoading] = useState(true);
  const [threadLoadError, setThreadLoadError] = useState("");
  const [relatedThreadsList, setRelatedThreadsList] = useState([]);
  const [followStatusByUserId, setFollowStatusByUserId] = useState({});
  const followStatusRef = useRef(followStatusByUserId);
  const [answerDraft, setAnswerDraft] = useState("");
  const [threadComments, setThreadComments] = useState(null);
  const [isThreadSaved, setIsThreadSaved] = useState(false);
  const [isSavingThread, setIsSavingThread] = useState(false);
  const scrollDirection = useScrollDirection();
  const isAuthenticated = Boolean(getAuthToken());
  const [authUser, setAuthUser] = useState(() =>
    normalizeAuthUser(getAuthUser()),
  );
  const [didHydrateAuthUser, setDidHydrateAuthUser] = useState(false);

  useEffect(() => {
    followStatusRef.current = followStatusByUserId;
  }, [followStatusByUserId]);

  useEffect(() => {
    const handleStorage = () => setAuthUser(normalizeAuthUser(getAuthUser()));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    let active = true;

    async function hydrateAuthUser() {
      if (!isAuthenticated) return;
      if (didHydrateAuthUser) return;

      try {
        const response = await fetchCurrentUser();
        const payload = response?.data || response;
        const user = normalizeAuthUser(
          payload?.data || payload?.user || payload,
        );

        if (!active) return;
        if (user && typeof user === "object") {
          updateAuthUser(user);
          setAuthUser(user);
        }
      } catch {
        // ignore: authUser stays as-is; UI falls back to mock viewer
      } finally {
        if (active) setDidHydrateAuthUser(true);
      }
    }

    hydrateAuthUser();

    return () => {
      active = false;
    };
  }, [didHydrateAuthUser, isAuthenticated]);

  const fallbackThreadData = useMemo(
    () => getThreadDetailData(threadId),
    [threadId],
  );

  useEffect(() => {
    let active = true;

    async function loadThreadDetail() {
      setIsThreadLoading(true);
      setThreadLoadError("");

      try {
        const response = await fetchThreadById(threadId);
        if (active) {
          setApiThreadSnapshot(response?.data || null);
        }
      } catch (error) {
        if (active) {
          setApiThreadSnapshot(null);
          setThreadLoadError(
            error instanceof Error
              ? error.message
              : "Gagal memuat detail thread dari API.",
          );
        }
      } finally {
        if (active) {
          setIsThreadLoading(false);
        }
      }
    }

    loadThreadDetail();

    return () => {
      active = false;
    };
  }, [threadId]);

  useEffect(() => {
    let active = true;

    async function loadRelatedThreads() {
      try {
        const response = await fetchRelatedThreads(threadId);
        if (active) {
          const relatedData = Array.isArray(response?.data)
            ? response.data
            : [];
          const mapped = relatedData.slice(0, 4).map((thread) => ({
            id: String(thread.id),
            title: String(thread.title || "Tanpa Judul"),
          }));
          setRelatedThreadsList(mapped);
        }
      } catch {
        if (active) {
          setRelatedThreadsList([]);
        }
      }
    }

    loadRelatedThreads();

    return () => {
      active = false;
    };
  }, [threadId]);

  const threadData = useMemo(
    () => mapApiThreadDetail(apiThreadSnapshot, fallbackThreadData),
    [apiThreadSnapshot, fallbackThreadData],
  );

  const {
    threadHeader,
    threadBreadcrumbs,
    threadCategoryChips,
    threadIntroParagraphs,
    answers: initialAnswers,
    contributors,
    statRows,
    relatedThreads: fallbackRelatedThreads,
  } = threadData;

  useEffect(() => {
    setIsThreadSaved(Boolean(threadData?.currentUserSaved));
  }, [threadData?.currentUserSaved]);

  function formatCommentCreatedAt(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .format(date)
      .replace(",", " ·");
  }

  const mapApiReplyToUi = useCallback((reply) => {
    const author = reply?.author || {};
    const role = String(author?.role || "");

    return {
      id: String(reply?.id || `reply-${Date.now()}`),
      author: String(author?.fullName || author?.userName || "Pengguna"),
      role: role || "Member",
      text: stripInlineMarkdown(reply?.content || reply?.text),
      createdAt: reply?.createdAt
        ? formatCommentCreatedAt(reply.createdAt)
        : "-",
      likes: Number(reply?.stats?.likes ?? reply?.likes ?? 0) || 0,
    };
  }, []);

  const mapApiCommentToUi = useCallback(
    (comment) => {
      const author = comment?.author || {};
      const role = String(author?.role || "");
      const replies = Array.isArray(comment?.replies)
        ? comment.replies.map(mapApiReplyToUi)
        : [];

      return {
        id: String(comment?.id || `comment-${Date.now()}`),
        authorId: String(comment?.authorId || author?.id || ""),
        author: String(author?.fullName || author?.userName || "Anonim"),
        authorRole: role,
        accent: Boolean(comment?.isBestAnswer),
        isBestAnswer: Boolean(comment?.isBestAnswer),
        subtitle: String(author?.field || ""),
        createdAt: comment?.createdAt
          ? formatCommentCreatedAt(comment.createdAt)
          : "-",
        badges: [],
        likes: Number(comment?.stats?.likes ?? 0) || 0,
        currentUserLiked: Boolean(comment?.currentUserLiked),
        paragraphs: [stripInlineMarkdown(comment?.content)].filter(Boolean),
        replies,
      };
    },
    [mapApiReplyToUi],
  );

  useEffect(() => {
    let active = true;

    async function loadComments() {
      try {
        const response = await fetchThreadComments(threadId);
        const payload = response?.data || response;
        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        const mapped = list.map(mapApiCommentToUi);

        if (active) setThreadComments(mapped);
      } catch {
        if (active) setThreadComments(null);
      }
    }

    loadComments();

    return () => {
      active = false;
    };
  }, [mapApiCommentToUi, threadId]);

  useEffect(() => {
    let active = true;

    async function loadFollowStatus() {
      if (!isAuthenticated) return;
      if (!Array.isArray(contributors) || contributors.length === 0) return;

      const targets = contributors
        .map((contributor) => String(contributor?.id || "").trim())
        .filter(Boolean);

      if (targets.length === 0) return;

      const uniqueTargets = [...new Set(targets)];
      const missingTargets = uniqueTargets.filter((userId) => {
        const entry = followStatusRef.current[userId];
        return entry == null;
      });

      if (missingTargets.length === 0) return;

      setFollowStatusByUserId((current) => {
        const next = { ...current };
        missingTargets.forEach((userId) => {
          next[userId] = { isFollowing: false, loading: true };
        });
        return next;
      });

      await Promise.all(
        missingTargets.map(async (userId) => {
          try {
            const res = await fetchIsFollowing(userId);
            const payload = res?.data || res;
            const isFollowing = Boolean(
              payload?.isFollowing ?? payload?.data?.isFollowing,
            );

            if (active) {
              setFollowStatusByUserId((current) => ({
                ...current,
                [userId]: { isFollowing, loading: false },
              }));
            }
          } catch (error) {
            if (active) {
              setFollowStatusByUserId((current) => ({
                ...current,
                [userId]: {
                  isFollowing: false,
                  loading: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Gagal memuat status mengikuti.",
                },
              }));
            }
          }
        }),
      );
    }

    loadFollowStatus();

    return () => {
      active = false;
    };
  }, [contributors, isAuthenticated]);

  const handleToggleFollow = async (userId, currentlyFollowing) => {
    if (!isAuthenticated) {
      showToast("Silakan login untuk mengikuti user.", { type: "warning" });
      return;
    }

    const targetId = String(userId || "").trim();
    if (!targetId) return;

    setFollowStatusByUserId((current) => ({
      ...current,
      [targetId]: { isFollowing: !currentlyFollowing, loading: true },
    }));

    try {
      if (currentlyFollowing) {
        await unfollowUser(targetId);
        showToast("Berhasil unfollow user.", { type: "info" });
      } else {
        await followUser(targetId);
        showToast("Berhasil follow user.", { type: "info" });
      }

      setFollowStatusByUserId((current) => ({
        ...current,
        [targetId]: { isFollowing: !currentlyFollowing, loading: false },
      }));
    } catch (error) {
      setFollowStatusByUserId((current) => ({
        ...current,
        [targetId]: { isFollowing: currentlyFollowing, loading: false },
      }));
      showToast(error instanceof Error ? error.message : "Request gagal.", {
        type: "error",
      });
    }
  };

  const currentThreadId = threadHeader.id;
  const sortMode = sortModeByThread[currentThreadId] || "popular";
  const submittedAnswers = useMemo(
    () => submittedAnswersByThread[currentThreadId] || [],
    [currentThreadId, submittedAnswersByThread],
  );

  const displayedRelatedThreads = useMemo(
    () =>
      relatedThreadsList.length > 0
        ? relatedThreadsList
        : fallbackRelatedThreads,
    [relatedThreadsList, fallbackRelatedThreads],
  );

  const viewerIsAlumni = useMemo(
    () => roleIndicatesAlumni(authUser?.role),
    [authUser?.role],
  );

  const viewerProfile = useMemo(
    () => ({
      name: authUser?.fullName || authUser?.userName || currentViewer.name,
      role: authUser?.role || currentViewer.role,
      subtitle: authUser?.field || authUser?.email || currentViewer.subtitle,
    }),
    [authUser],
  );

  const draftStorageKey = useMemo(
    () =>
      buildDraftStorageKey({
        threadId: threadHeader?.id || threadId,
        authUser,
      }),
    [authUser, threadHeader?.id, threadId],
  );

  useEffect(() => {
    try {
      setAnswerDraft(localStorage.getItem(draftStorageKey) || "");
    } catch {
      setAnswerDraft("");
    }
  }, [draftStorageKey]);

  const visibleAnswers = useMemo(() => {
    const baseAnswers =
      Array.isArray(threadComments) && threadComments.length > 0
        ? threadComments
        : initialAnswers;
    return sortAnswerList([...baseAnswers, ...submittedAnswers], sortMode);
  }, [initialAnswers, sortMode, submittedAnswers, threadComments]);

  const answerCountLabel = `${visibleAnswers.length} Jawaban`;
  const bestAnswerCount = visibleAnswers.filter(
    (answer) => answer.accent,
  ).length;

  const handleSubmitAnswer = async (content) => {
    if (!viewerIsAlumni) {
      return {
        ok: false,
        message: answerComposerRestrictionMessage,
      };
    }

    let submitResult = null;

    try {
      const response = await postThreadComment(threadHeader.id, { content });
      const payload = response?.data || response;
      const comment = payload?.data || payload?.comment || payload;
      const author = comment?.author || {};

      submitResult = {
        ok: true,
        answer: {
          id: String(comment?.id || `local-${Date.now()}`),
          author: author?.fullName || author?.userName || viewerProfile.name,
          authorRole: author?.role || viewerProfile.role,
          accent: false,
          subtitle: author?.field || viewerProfile.subtitle,
          createdAt: comment?.createdAt || new Date().toISOString(),
          badges: [],
          likes: 0,
          paragraphs: [stripInlineMarkdown(comment?.content || content)],
          replies: [],
        },
        message: payload?.message || "Jawaban berhasil dikirim.",
        source: "live",
      };
    } catch {
      submitResult = await submitThreadAnswer({
        threadId: threadHeader.id,
        content,
        viewer: viewerProfile,
      });
    }

    if (!submitResult.ok || !submitResult.answer) {
      return {
        ok: false,
        message:
          submitResult.message || "Gagal mengirim jawaban. Silakan coba lagi.",
      };
    }

    setSubmittedAnswersByThread((previous) => {
      const currentItems = previous[currentThreadId] || [];
      return {
        ...previous,
        [currentThreadId]: [...currentItems, submitResult.answer],
      };
    });
    setSortModeByThread((previous) => ({
      ...previous,
      [currentThreadId]: "latest",
    }));

    try {
      localStorage.removeItem(draftStorageKey);
      setAnswerDraft("");
    } catch {
      // ignore storage errors
    }

    return {
      ok: true,
      message: submitResult.message || "Jawaban berhasil dikirim.",
    };
  };

  const normalizeApiReply = (replyPayload, fallbackText) => {
    const source =
      replyPayload?.data || replyPayload?.reply || replyPayload || {};
    const author = source?.author || {};

    return {
      id: String(source?.id || `reply-${Date.now()}`),
      author: String(
        author?.fullName || author?.userName || viewerProfile.name || "Kamu",
      ),
      role: String(author?.role || viewerProfile.role || "Member"),
      text: stripInlineMarkdown(source?.content || source?.text || fallbackText),
      createdAt: String(source?.createdAt || "").trim() || "-",
      likes: 0,
    };
  };

  const handleReplySubmit = async ({ answerId, text }) => {
    try {
      const response = await postThreadComment(threadHeader.id, {
        content: text,
        parentId: answerId,
      });
      return { ok: true, reply: normalizeApiReply(response, text) };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error ? error.message : "Gagal mengirim balasan.",
      };
    }
  };

  const handleToggleThreadSave = async () => {
    if (!isAuthenticated) {
      showToast("Silakan login untuk menyimpan thread.", { type: "warning" });
      navigate("/login");
      return;
    }

    if (isSavingThread) return;

    const nextSaved = !isThreadSaved;
    setIsThreadSaved(nextSaved);
    setIsSavingThread(true);

    try {
      if (nextSaved) {
        await saveThread(threadHeader.id);
      } else {
        await unsaveThread(threadHeader.id);
      }
    } catch (error) {
      setIsThreadSaved(!nextSaved);
      showToast(error instanceof Error ? error.message : "Request gagal.", {
        type: "error",
      });
    } finally {
      setIsSavingThread(false);
    }
  };

  const handleLikeToggle = async ({ answerId, liked }) => {
    if (!isAuthenticated) {
      showToast("Silakan login untuk memberi like.", { type: "warning" });
      navigate("/login");
      return;
    }

    try {
      if (liked) {
        await likeComment(answerId);
      } else {
        await unlikeComment(answerId);
      }

      setThreadComments((current) => {
        if (!Array.isArray(current)) return current;
        return current.map((item) => {
          if (String(item.id) !== String(answerId)) return item;
          const previousLikes = Number(item.likes || 0);
          const nextLikes = liked
            ? previousLikes + 1
            : Math.max(0, previousLikes - 1);
          return { ...item, likes: nextLikes, currentUserLiked: liked };
        });
      });
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Request gagal.", {
        type: "error",
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) {
      showToast("Silakan login terlebih dulu.", { type: "warning" });
      navigate("/login");
      return;
    }

    try {
      await deleteComment(commentId);
      setThreadComments((current) => {
        if (!Array.isArray(current)) return current;
        return current.filter((item) => String(item.id) !== String(commentId));
      });
      showToast("Komentar dihapus.", { type: "info" });
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Gagal menghapus.", {
        type: "error",
      });
    }
  };

  const handleMarkBestAnswer = async (commentId) => {
    if (!isAuthenticated) {
      showToast("Silakan login terlebih dulu.", { type: "warning" });
      navigate("/login");
      return;
    }

    try {
      await setBestAnswer(commentId);
      setThreadComments((current) => {
        if (!Array.isArray(current)) return current;
        return current.map((item) => {
          const isBest = String(item.id) === String(commentId);
          return { ...item, accent: isBest, isBestAnswer: isBest };
        });
      });
      showToast("Best answer diperbarui.", { type: "info" });
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Request gagal.", {
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
      <SiteHeader
        activeHref="/thread"
        user={authUser}
        className={`transition-all duration-300 ${
          scrollDirection === "down" ? "-top-25" : "top-0"
        }`}
        authActions={
          isAuthenticated
            ? [{ label: "Profil", to: "#", variant: "outline" }]
            : [
                { label: "Masuk", to: "/login", variant: "outline" },
                { label: "Daftar", to: "/signup", variant: "solid" },
              ]
        }
      />

      <main className="mx-auto w-full max-w-316 px-4 pb-12 pt-5 lg:px-0">
        {isThreadLoading ? (
          <div className="mb-3 rounded-2xl border border-dashed border-(--color-light-blue) bg-white px-5 py-3 text-[13px] text-(--color-secondary)">
            Memuat detail thread dari API...
          </div>
        ) : null}

        {!isThreadLoading && threadLoadError ? (
          <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-[13px] text-amber-700">
            {threadLoadError}
          </div>
        ) : null}

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,912px)_320px]">
          <section className="min-w-0 space-y-4">
            <nav className="flex flex-nowrap items-center gap-1.5 overflow-hidden px-1 text-[13px] md:text-[14px] leading-5 text-(--color-secondary)">
              {threadBreadcrumbs.map((item, index) => (
                <div
                  key={item}
                  className={`flex items-center gap-1.5 ${
                    index === threadBreadcrumbs.length - 1
                      ? "min-w-0 shrink"
                      : "shrink-0"
                  }`}>
                  {index < threadBreadcrumbs.length - 1 &&
                  BREADCRUMB_HREF_BY_LABEL[item] ? (
                    <Link
                      to={BREADCRUMB_HREF_BY_LABEL[item]}
                      className={`${linkFx} truncate hover:text-(--color-dark)`}>
                      {item}
                    </Link>
                  ) : (
                    <span
                      className={`truncate ${
                        index === threadBreadcrumbs.length - 1
                          ? "text-(--color-dark)"
                          : ""
                      }`}>
                      {item}
                    </span>
                  )}
                  {index < threadBreadcrumbs.length - 1 ? (
                    <span className="shrink-0 text-[10px] md:text-[12px]">
                      /
                    </span>
                  ) : null}
                </div>
              ))}
            </nav>

            <article className="rounded-[14px] border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] md:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3f4f6] pb-4">
                <div className="flex flex-wrap items-center gap-2 text-[14px] leading-5 text-[#6b7280]">
                  <Link
                    to="/thread"
                    className={`${buttonFx} inline-flex items-center gap-2 rounded-full text-[14px] font-medium text-[#6b7280] hover:text-(--color-dark)`}>
                    <Icon icon={ArrowLeft} className="h-4 w-4" />
                    Kembali ke Diskusi
                  </Link>
                </div>
                <div className="flex items-center gap-1 text-[14px] leading-5 text-[#6b7280]">
                  <button
                    type="button"
                    className={`${buttonFx} inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-medium text-(--color-secondary) hover:bg-(--color-gray) hover:text-(--color-dark)`}>
                    <Icon icon={Share2} className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {threadCategoryChips.map((chip) => (
                  <span
                    key={chip.id}
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] leading-4 font-semibold ${chip.tone}`}>
                    {chip.label}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1 rounded-full bg-[#fef2f2] px-2 py-0.5 text-[12px] leading-4 font-semibold text-[#fb2c36]">
                  <Icon icon={Flame} className="h-3 w-3" />
                  Trending
                </span>
              </div>

              <h1 className="mt-4 max-w-190 text-[28px] leading-9 font-extrabold text-[#0a2647] md:text-[32px] md:leading-10">
                {threadHeader.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Avatar alt={threadHeader.author} />
                <div>
                  <p className="text-[14px] leading-5 font-bold text-(--color-dark)">
                    {threadHeader.author}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#dbeafe] px-2 py-0.5 text-[10px] leading-3.75 font-semibold text-[#1e40af]">
                      <Icon icon={GraduationCap} className="h-3 w-3" />
                      {threadHeader.role}
                    </span>
                    <p className="inline-flex items-center gap-1 text-[12px] leading-4 text-[#9ca3af]">
                      <Icon icon={Clock3} className="h-4 w-4" />
                      {threadHeader.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 max-w-205 space-y-3 text-[14px] leading-[22.75px] text-[#374151]">
                {threadIntroParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f3f4f6] pt-4 text-[12px] leading-4 text-[#9ca3af]">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1">
                    <Icon icon={Eye} className="h-4 w-4" />
                    {threadHeader.views}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Icon icon={MessageCircle} className="h-4 w-4" />
                    {answerCountLabel}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleThreadSave}
                  disabled={isSavingThread}
                  className={`${buttonFx} inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-medium ${
                    isThreadSaved
                      ? "text-(--color-like-blue)"
                      : "text-(--color-secondary)"
                  } hover:bg-(--color-gray) hover:text-(--color-dark) disabled:opacity-60`}>
                  <Icon
                    icon={isThreadSaved ? BookmarkCheck : Bookmark}
                    className="h-4 w-4"
                  />
                  {isThreadSaved ? "Tersimpan" : "Simpan"}
                </button>
              </div>
            </article>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--color-light-blue) pb-2 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[16px] leading-6 font-bold text-[#101828]">
                  {answerCountLabel}
                </h2>
                {bestAnswerCount > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-[#eff6ff] px-2 py-0.5 text-[12px] leading-4 font-medium text-[#2563eb]">
                    {bestAnswerCount} terbaik
                  </span>
                ) : null}
              </div>

              <div className="inline-flex items-center rounded-full border border-(--color-gray) bg-white p-1 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.04)]">
                <button
                  type="button"
                  onClick={() =>
                    setSortModeByThread((previous) => ({
                      ...previous,
                      [currentThreadId]: "popular",
                    }))
                  }
                  className={`${buttonFx} rounded-full px-4 py-1 text-[12px] leading-4 font-medium ${
                    sortMode === "popular"
                      ? "bg-(--color-dark) text-white"
                      : "text-(--color-secondary) hover:text-(--color-dark)"
                  }`}>
                  Terpopuler
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSortModeByThread((previous) => ({
                      ...previous,
                      [currentThreadId]: "latest",
                    }))
                  }
                  className={`${buttonFx} rounded-full px-4 py-1 text-[12px] leading-4 font-medium ${
                    sortMode === "latest"
                      ? "bg-(--color-dark) text-white"
                      : "text-(--color-secondary) hover:text-(--color-dark)"
                  }`}>
                  Terbaru
                </button>
              </div>
            </div>

            {visibleAnswers.map((answer) => {
              const answerAuthorIsAlumni = roleIndicatesAlumni(
                answer?.authorRole,
              );
              const canReply = viewerIsAlumni || answerAuthorIsAlumni;

              return (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  canReply={canReply}
                  replyDisabledReason="Kamu hanya bisa membalas jawaban dari alumni."
                  canDelete={
                    Boolean(authUser?.id) &&
                    String(answer?.authorId || "") ===
                      String(authUser?.id || "")
                  }
                  canMarkBestAnswer={viewerIsAlumni}
                  onDelete={handleDeleteComment}
                  onMarkBestAnswer={handleMarkBestAnswer}
                  onLikeToggle={handleLikeToggle}
                  onReplySubmit={handleReplySubmit}
                />
              );
            })}

            <div className="flex items-center gap-2 px-3 pt-1">
              <Icon icon={PenSquare} className="h-6 w-6" />
              <p className="text-[16px] leading-6 font-bold text-[#101828]">
                Tambahkan Jawabanmu
              </p>
            </div>

            <AnswerComposerCard
              profile={viewerProfile}
              tipText={answerComposerTip}
              canAnswer={viewerIsAlumni}
              minCharacters={answerComposerMinCharacters}
              restrictionMessage={answerComposerRestrictionMessage}
              onSubmit={handleSubmitAnswer}
              initialValue={answerDraft}
              onSaveDraft={(value) => {
                try {
                  localStorage.setItem(draftStorageKey, String(value || ""));
                  setAnswerDraft(String(value || ""));
                } catch {
                  // ignore storage errors
                }
              }}
              onRequestAlumniAccess={() => {
                if (!isAuthenticated) {
                  showToast("Silakan daftar sebagai alumni untuk lanjut.", {
                    type: "info",
                  });
                } else {
                  showToast("Lanjutkan pendaftaran alumni.", {
                    type: "info",
                  });
                }

                navigate("/signup?role=alumni");
              }}
            />
          </section>

          <aside className="space-y-5 lg:sticky lg:top-19.5">
            {contributors && contributors.length > 0 && (
              <section className="rounded-[14px] border border-[#f3f4f6] bg-white p-4.5 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
                <div className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-[#101828]">
                  <Icon icon={Users} className="h-4 w-4" />
                  Alumni yang Menjawab
                </div>

                <div className="space-y-3">
                  {contributors.map((contributor, idx) => (
                    <div key={contributor.id}>
                      <ContributorCard
                        contributor={contributor}
                        isFollowing={Boolean(
                          followStatusByUserId?.[String(contributor.id)]
                            ?.isFollowing,
                        )}
                        isFollowLoading={Boolean(
                          followStatusByUserId?.[String(contributor.id)]
                            ?.loading,
                        )}
                        onToggleFollow={handleToggleFollow}
                      />
                      {idx < contributors.length - 1 ? (
                        <div className="mt-3 border-t border-[#e5e7eb]" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-[14px] border border-[rgba(206,208,249,0.5)] bg-white p-4.5 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
              <div className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-(--color-dark)">
                <Icon icon={BarChart3} className="h-4.5 w-4.5" />
                Statistik Thread
              </div>

              <div className="space-y-2">
                {statRows.map((item) => {
                  const StatIcon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-3">
                        <span
                          className={`inline-flex rounded-[10px] p-1.75 ${item.tone}`}>
                          <Icon icon={StatIcon} className="h-4 w-4" />
                        </span>
                        <span className="text-[12px] leading-4 text-(--color-secondary)">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[12px] leading-4 font-bold text-(--color-dark)">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[14px] border border-[rgba(206,208,249,0.5)] bg-white p-4.5 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
              <div className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-(--color-dark)">
                <Icon icon={Link2} className="h-4.5 w-4.5" />
                Thread Terkait
              </div>

              <ul className="space-y-2">
                {displayedRelatedThreads.map((thread) => {
                  const threadKey =
                    typeof thread === "string"
                      ? thread
                      : thread?.id || thread?.title || thread;
                  const threadTitle =
                    typeof thread === "string"
                      ? thread
                      : thread?.title || "Thread Terkait";
                  const threadHref =
                    typeof thread === "string"
                      ? "#"
                      : `/thread/${thread?.id || ""}`;
                  const isExternalLink =
                    typeof thread !== "string" && thread?.id;

                  return (
                    <li key={threadKey}>
                      {isExternalLink ? (
                        <Link
                          to={threadHref}
                          className={`${linkFx} inline-flex items-start gap-2 text-[12px] leading-4.5 text-(--color-dark) hover:text-(--color-like-blue)`}>
                          <Icon
                            icon={ArrowUpRight}
                            className="mt-0.5 h-4 w-4"
                          />
                          <span className="line-clamp-2">{threadTitle}</span>
                        </Link>
                      ) : (
                        <a
                          href={threadHref}
                          onClick={preventPlaceholderClick}
                          className={`${linkFx} inline-flex items-start gap-2 text-[12px] leading-4.5 text-(--color-dark) hover:text-(--color-like-blue)`}>
                          <Icon
                            icon={ArrowUpRight}
                            className="mt-0.5 h-4 w-4"
                          />
                          <span className="line-clamp-2">{threadTitle}</span>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>
        </div>
      </main>

      <FooterSection socialLinks={socialLinks} />
    </div>
  );
}
