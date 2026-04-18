import { sanitizeAnswer } from "./dataGuards";

function formatNowToThreadTimestamp() {
  const now = new Date();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(now.getDate()).padStart(2, "0");
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} · ${hour}:${minute} WIB`;
}

function buildMockAnswer({ content, viewer }) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return sanitizeAnswer({
    id: `local-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    author: viewer.name,
    accent: false,
    subtitle: viewer.subtitle,
    createdAt: formatNowToThreadTimestamp(),
    badges: [],
    likes: 0,
    paragraphs: paragraphs.length > 0 ? paragraphs : [content.trim()],
    replies: [],
  });
}

function getBackendConfig() {
  const mode = (
    import.meta.env.VITE_THREAD_DETAIL_API_MODE || "mock"
  ).toLowerCase();
  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").trim();

  return {
    mode,
    apiBase: apiBase.replace(/\/$/, ""),
  };
}

async function readResponseBody(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function mapBackendAnswer(responseBody, fallbackViewer, fallbackContent) {
  const answerPayload = responseBody?.answer ?? responseBody;

  if (!answerPayload || typeof answerPayload !== "object") {
    return buildMockAnswer({
      content: fallbackContent,
      viewer: fallbackViewer,
    });
  }

  return sanitizeAnswer({
    id: answerPayload.id,
    author: answerPayload.author || fallbackViewer.name,
    accent: Boolean(answerPayload.accent),
    subtitle: answerPayload.subtitle || fallbackViewer.subtitle,
    createdAt: answerPayload.createdAt || formatNowToThreadTimestamp(),
    badges: Array.isArray(answerPayload.badges) ? answerPayload.badges : [],
    likes: Number.isFinite(answerPayload.likes) ? answerPayload.likes : 0,
    paragraphs: Array.isArray(answerPayload.paragraphs)
      ? answerPayload.paragraphs
      : [fallbackContent],
    replies: Array.isArray(answerPayload.replies) ? answerPayload.replies : [],
  });
}

/**
 * Submit answer using backend when available, otherwise fallback to local mock behavior.
 * Backend contract target:
 * POST {VITE_API_BASE_URL}/threads/:threadId/answers
 * body: { content: string }
 * response: { answer: {...} } or answer object directly.
 */
export async function submitThreadAnswer({ threadId, content, viewer }) {
  const trimmed = typeof content === "string" ? content.trim() : "";

  if (!trimmed) {
    return {
      ok: false,
      message: "Jawaban tidak boleh kosong.",
    };
  }

  const { mode, apiBase } = getBackendConfig();
  if (mode !== "live" || !apiBase) {
    return {
      ok: true,
      answer: buildMockAnswer({ content: trimmed, viewer }),
      message: "Jawaban berhasil ditambahkan.",
      source: "mock",
    };
  }

  try {
    const response = await fetch(`${apiBase}/threads/${threadId}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: trimmed }),
    });

    const responseBody = await readResponseBody(response);

    if (!response.ok) {
      return {
        ok: false,
        message:
          responseBody?.message ||
          "Gagal mengirim jawaban. Silakan coba beberapa saat lagi.",
      };
    }

    return {
      ok: true,
      answer: mapBackendAnswer(responseBody, viewer, trimmed),
      message: responseBody?.message || "Jawaban berhasil dikirim.",
      source: "live",
    };
  } catch {
    return {
      ok: false,
      message:
        "Tidak bisa terhubung ke server. Periksa backend atau konfigurasi API.",
    };
  }
}
