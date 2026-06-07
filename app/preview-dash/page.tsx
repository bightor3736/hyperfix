"use client";
import { DashboardSidebarClient } from "../dashboard/DashboardSidebarClient";
import { DashboardHome } from "../dashboard/DashboardHome";
import { MobileNavBar } from "../dashboard/MobileNavBar";
import type { Quest } from "@/lib/quests/generate";

const Q: Quest[] = [
  { id:"1",kind:"fixation_checkin",title:"Check in on a fixation",description:"Still deep in it?",xp_reward:8,href:"/dashboard/fixations",completed_at:new Date().toISOString() } as unknown as Quest,
  { id:"2",kind:"deep_dive",title:"Do a deep dive",description:"Answer one prompt about a fixation",xp_reward:8,href:"/dashboard/fixations",completed_at:null } as unknown as Quest,
  { id:"3",kind:"focus_session",title:"One focus session",description:"Lock in on your fixation",xp_reward:15,href:"/dashboard/timer",completed_at:null } as unknown as Quest,
];

const S = {"--bg":"#FBF6EA","--bg-soft":"#F2EAD7","--bg-elevated":"#FFFFFF","--ink":"#0A0A0A","--ink-muted":"#2E2E2E","--ink-faint":"#6A6A6A","--line":"#0A0A0A","--line-strong":"#0A0A0A","--accent":"#2F4BFF","--accent-soft":"#DCE2FF","--accent-ink":"#FFFFFF","--energy":"#2F4BFF","--energy-soft":"#DCE2FF","--xp":"#8B5CF6","--xp-soft":"#ECE4FF","--flame":"#FF5C3A","--flame-soft":"#FFE0D7","--primary":"#2F4BFF","--primary-foreground":"#FFFFFF","--card":"#FFFFFF","--card-foreground":"#0A0A0A","--muted-foreground":"#2E2E2E","--border":"#0A0A0A","--invert-bg":"#0A0A0A","--invert-ink":"#FBF6EA","--reward-mint":"#16E08A","--reward-mint-soft":"#C9F9E5",background:"var(--bg)",fontFamily:"var(--font-grotesk),system-ui,sans-serif",color:"#0A0A0A"} as React.CSSProperties;

export default function Preview() {
  return (
    <div className="dash-landing min-h-screen flex" style={S}>
      <DashboardSidebarClient displayName="Viktor Vanlier" avatarUrl={null} userEmail="viktor@example.com" isPro={false} username="viktor" currentStreak={7} totalPoints={1240} streakFreezes={2} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <DashboardHome firstName="Viktor" greeting="good morning" username="viktor" levelName="Unwell" totalPoints={1240} currentStreak={7} streakFreezes={2} quests={Q} nextLevelPoints={1500} currentLevelPoints={1000} />
        <MobileNavBar username="viktor" />
      </div>
    </div>
  );
}
