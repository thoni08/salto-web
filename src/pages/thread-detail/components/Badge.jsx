import { Brain, CheckCircle2, Crown, Medal } from "lucide-react";
import { Icon } from "./Icon";

export function Badge({ type }) {
  if (type === "top") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-2 py-0.5 text-[12px] font-semibold leading-4 text-(--color-primary)">
        <Icon icon={Crown} className="h-3 w-3" strokeWidth={2} />
        Top Kontributor
      </span>
    );
  }

  if (type === "mentor") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[12px] font-semibold leading-4 text-[#2563eb]">
        <Icon icon={CheckCircle2} className="h-3 w-3" strokeWidth={2} />
        Mentor
      </span>
    );
  }

  if (type === "expert") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f3ff] px-2 py-0.5 text-[12px] font-semibold leading-4 text-[#7c3aed]">
        <Icon icon={Brain} className="h-3 w-3" strokeWidth={2} />
        Expert AI
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfeff] px-2 py-0.5 text-[12px] font-semibold leading-4 text-[#0891b2]">
      <Icon icon={Medal} className="h-3 w-3" strokeWidth={2} />
      PhD Candidate
    </span>
  );
}
