import { Info, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { buttonFx } from "../constants";
import { Icon } from "./Icon";

export function AnswerComposerCard({
  profile,
  tipText = "",
  canAnswer = false,
  minCharacters = 100,
  restrictionMessage = "",
  onSubmit,
  onSaveDraft,
  onRequestAlumniAccess,
}) {
  const [answerText, setAnswerText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isErrorFeedback, setIsErrorFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const characterCount = answerText.length;
  const canSubmit =
    canAnswer && characterCount >= minCharacters && !isSubmitting;

  const applyFeedback = (message, isError) => {
    setFeedback(message);
    setIsErrorFeedback(isError);
  };

  const handleSubmit = async () => {
    if (!canAnswer) {
      applyFeedback(
        restrictionMessage ||
          "Akun kamu belum alumni. Daftar sebagai alumni untuk menjawab.",
        true,
      );
      return;
    }

    const trimmed = answerText.trim();

    if (trimmed.length < minCharacters) {
      applyFeedback(
        `Jawaban minimal ${minCharacters} karakter sebelum bisa dikirim.`,
        true,
      );
      return;
    }

    setIsSubmitting(true);
    const submitResult = await Promise.resolve(onSubmit?.(trimmed));
    setIsSubmitting(false);

    if (submitResult?.ok === false) {
      applyFeedback(
        submitResult.message || "Jawaban belum berhasil dikirim.",
        true,
      );
      return;
    }

    setAnswerText("");
    applyFeedback(submitResult?.message || "Jawaban berhasil dikirim.", false);
  };

  const handleSaveDraft = () => {
    onSaveDraft?.(answerText);
    applyFeedback("Draft jawaban disimpan.", false);
  };

  if (!canAnswer) {
    return (
      <section className="rounded-[14px] border border-[rgba(206,208,249,0.5)] bg-white p-5.25 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4.5">
            <div className="rounded-full bg-white p-2.5 text-[#7e22ce]">
              <Icon icon={Info} className="h-4.5 w-4.5" strokeWidth={2} />
            </div>

            <div className="min-w-0 max-w-127.5">
              <p className="text-[14px] leading-5 font-semibold text-(--color-dark)">
                Hanya alumni yang bisa menjawab thread ini
              </p>
              <p className="mt-0.5 text-[12px] leading-4 text-(--color-secondary)">
                {restrictionMessage ||
                  "Platform ini mengutamakan jawaban dari alumni berpengalaman. Kamu bisa bertanya atau menambahkan pertanyaan lewat kolom balasan."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRequestAlumniAccess}
            className={`${buttonFx} rounded-full bg-(--color-dark) px-5 py-2 text-[14px] leading-5 font-semibold text-white`}>
            Daftar sebagai Alumni
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[14px] border border-[rgba(206,208,249,0.5)] bg-white p-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] leading-5 font-bold text-[#101828]">
              {profile?.name ?? "Pengguna"}
            </p>
            <span className="inline-flex items-center rounded-full bg-[#dbeafe] px-2 py-0.5 text-[10px] leading-3.75 font-semibold text-[#1e40af]">
              {profile?.role ?? "Mahasiswa"}
            </span>
          </div>

          <p className="text-[12px] leading-4 text-[#6b7280]">
            {profile?.subtitle ?? "Mahasiswa · Universitas"}
          </p>
        </div>
      </div>

      <p className="mt-5 text-[14px] leading-5.25 font-bold text-(--color-dark)">
        Tulis Jawabanmu
      </p>

      <label className="mt-4 block" htmlFor="answer-composer">
        <span className="sr-only">Tulis jawaban</span>
        <textarea
          id="answer-composer"
          className="h-61.75 w-full resize-none rounded-[14px] border border-[rgba(206,208,249,0.5)] bg-(--color-gray) p-4.5 text-[12px] leading-4 text-(--color-dark) placeholder:text-(--color-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-like-blue)/60 disabled:cursor-not-allowed disabled:opacity-80"
          placeholder="Tulis jawabanmu di sini bagikan pengalaman, tips, dan referensi yang berguna..."
          value={answerText}
          onChange={(event) => setAnswerText(event.target.value)}
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p
          className={`text-[12px] leading-4 ${
            canAnswer && characterCount < minCharacters
              ? "text-[#b45309]"
              : "text-(--color-secondary)"
          }`}>
          {characterCount} karakter - Minimal {minCharacters} karakter
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className={`${buttonFx} rounded-full border border-[rgba(206,208,249,0.5)] bg-white px-5 py-2.5 text-[12px] leading-4 font-bold text-(--color-secondary)`}>
            Simpan Draft
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={`${buttonFx} inline-flex items-center gap-2 rounded-full border border-[rgba(206,208,249,0.5)] bg-(--color-like-blue) px-5 py-2.5 text-[12px] leading-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-55`}>
            <Icon icon={SendHorizontal} className="h-4 w-4" strokeWidth={2} />
            {isSubmitting ? "Mengirim..." : "Kirim Jawaban"}
          </button>
        </div>
      </div>

      {feedback ? (
        <p
          role={isErrorFeedback ? "alert" : "status"}
          className={`mt-3 text-[12px] leading-4 ${
            isErrorFeedback ? "text-[#b91c1c]" : "text-[#15803d]"
          }`}>
          {feedback}
        </p>
      ) : null}

      <div className="mt-5 rounded-[14px] bg-[#f0f9ff] p-4 text-[12px] leading-4 text-(--color-like-blue)">
        <span className="font-bold">Tips: </span>
        <span>{tipText}</span>
      </div>
    </section>
  );
}
