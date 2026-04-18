import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { answers } from "../../data";
import { AnswerCard } from "../AnswerCard";

describe("AnswerCard", () => {
  it("renders main answer content and reply summary", () => {
    const answer = answers[0];

    render(<AnswerCard answer={answer} />);

    expect(screen.getByText(answer.author)).toBeInTheDocument();
    expect(screen.getByText(answer.subtitle)).toBeInTheDocument();
    expect(screen.getByText(String(answer.likes))).toBeInTheDocument();
    expect(
      screen.getByText(`Sembunyikan ${answer.replies.length} balasan`),
    ).toBeInTheDocument();
  });

  it("toggles like state and count", () => {
    const answer = answers[0];

    render(<AnswerCard answer={answer} />);

    const likeButton = screen.getByRole("button", {
      name: String(answer.likes),
    });

    expect(likeButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(likeButton);
    expect(likeButton).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: String(answer.likes + 1) }),
    ).toBeInTheDocument();

    fireEvent.click(likeButton);
    expect(likeButton).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("button", { name: String(answer.likes) }),
    ).toBeInTheDocument();
  });

  it("toggles reply visibility and supports quick reply", async () => {
    const answer = answers[0];

    render(<AnswerCard answer={answer} />);

    const replyToggleButton = screen.getByRole("button", {
      name: `Sembunyikan ${answer.replies.length} balasan`,
    });

    fireEvent.click(replyToggleButton);
    expect(
      screen.getByRole("button", {
        name: `Lihat ${answer.replies.length} balasan`,
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Balas jawaban" }));

    fireEvent.change(screen.getByLabelText("Tulis balasan"), {
      target: {
        value:
          "Terima kasih kak, insight-nya sangat membantu untuk persiapan interview.",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Kirim balasan" }));

    await waitFor(() => {
      expect(screen.getByText("Balasan ditambahkan.")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", {
        name: `Sembunyikan ${answer.replies.length + 1} balasan`,
      }),
    ).toBeInTheDocument();
  });
});
