import { fireEvent, render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnswerComposerCard } from "../AnswerComposerCard";

const profile = {
  name: "Rizky Mahendra",
  role: "Mahasiswa",
  subtitle: "Mahasiswa IF'27 · Universitas Indonesia",
};

describe("AnswerComposerCard", () => {
  it("shows alumni-only restriction when user cannot answer", () => {
    render(
      <AnswerComposerCard
        profile={profile}
        canAnswer={false}
        restrictionMessage="Hanya alumni yang bisa menjawab thread ini."
      />,
    );

    expect(
      screen.getByText("Hanya alumni yang bisa menjawab thread ini."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Daftar sebagai Alumni" }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Tulis jawaban")).not.toBeInTheDocument();
  });

  it("requires non-empty content and calls submit handler", async () => {
    const submitHandler = vi.fn(() => ({ ok: true }));

    render(
      <AnswerComposerCard
        profile={profile}
        canAnswer={true}
        onSubmit={submitHandler}
      />,
    );

    const textarea = screen.getByLabelText("Tulis jawaban");
    const submitButton = screen.getByRole("button", { name: "Kirim Jawaban" });

    expect(submitButton).toBeDisabled();
    expect(submitHandler).not.toHaveBeenCalled();

    fireEvent.change(textarea, { target: { value: "Jawaban pendek" } });

    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitHandler).toHaveBeenCalledTimes(1);
    });
    expect(submitHandler).toHaveBeenCalledWith("Jawaban pendek");
    expect(screen.getByText("Jawaban berhasil dikirim.")).toBeInTheDocument();
  });
});
