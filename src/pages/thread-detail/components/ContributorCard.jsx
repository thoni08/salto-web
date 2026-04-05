import { Share2 } from "lucide-react";
import { buttonFx } from "../constants";
import { sanitizeContributor } from "../dataGuards";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Icon } from "./Icon";

export function ContributorCard({ contributor }) {
  const safeContributor = sanitizeContributor(contributor);

  return (
    <article className="space-y-3.5">
      <div className="flex items-start gap-3">
        <Avatar alt={safeContributor.name} size="lg" />

        <div className="min-w-0">
          <p className="text-[14px] leading-5 font-bold text-[#101828]">
            {safeContributor.name}
          </p>
          <p className="text-[12px] leading-4 text-[#6b7280]">
            {safeContributor.role}
          </p>
          <p className="mt-0.5 text-[12px] leading-4 text-[#9ca3af]">
            {safeContributor.org}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {safeContributor.badges.map((badge) => (
          <Badge key={`${safeContributor.id}-${badge}`} type={badge} />
        ))}
      </div>

      <div className="overflow-hidden rounded-[14px] bg-[#f9fafb]">
        <div className="grid grid-cols-3 border border-transparent text-center">
          <div className="py-2">
            <p className="text-[13px] leading-[19.5px] font-bold text-[#101828]">
              {safeContributor.stats.answer}
            </p>
            <p className="text-[10px] leading-3.75 text-[#9ca3af]">Jawaban</p>
          </div>
          <div className="border-x border-[rgba(0,0,0,0.28)] py-2">
            <p className="text-[13px] leading-[19.5px] font-bold text-[#101828]">
              {safeContributor.stats.approved}
            </p>
            <p className="text-[10px] leading-3.75 text-[#9ca3af]">Diterima</p>
          </div>
          <div className="py-2">
            <p className="text-[13px] leading-[19.5px] font-bold text-[#101828]">
              {safeContributor.stats.joined}
            </p>
            <p className="text-[10px] leading-3.75 text-[#9ca3af]">Bergabung</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className={`${buttonFx} flex-1 rounded-full bg-[#0a2647] px-4 py-2 text-[12px] leading-4 font-semibold text-white`}>
          Ikuti
        </button>
        <button
          type="button"
          className={`${buttonFx} inline-flex rounded-full border border-[#e5e7eb] px-3.25 py-2.25 text-[#6b7280] hover:bg-[#f9fafb]`}>
          <Icon icon={Share2} className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </article>
  );
}
