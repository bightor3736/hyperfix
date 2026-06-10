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

const S = {"--bg":"#FAF6F0","--bg-soft":"#F3EDE4","--bg-elevated":"#FFFFFF","--ink":"#2B2440","--ink-muted":"#564E70","--ink-faint":"#8B84A3","--line":"#E9E2D8","--line-strong":"#D9D1C5","--accent":"#6957E8","--accent-soft":"#E9E5FC","--accent-ink":"#FFFFFF","--energy":"#6957E8","--energy-soft":"#E9E5FC","--xp":"#9B8AFB","--xp-soft":"#EFEBFF","--flame":"#F97E6D","--flame-soft":"#FEE9E5","--primary":"#6957E8","--primary-foreground":"#FFFFFF","--card":"#FFFFFF","--card-foreground":"#2B2440","--muted-foreground":"#564E70","--border":"#E9E2D8","--invert-bg":"#2B2440","--invert-ink":"#FAF6F0","--reward-mint":"#3ECF9B","--reward-mint-soft":"#E0F8EF",background:"var(--bg)",fontFamily:"var(--font-grotesk),system-ui,sans-serif",color:"#2B2440"} as React.CSSProperties;

export default function Preview() {
  return (
    <div className="dash-landing min-h-screen flex" style={S}>
      <DashboardSidebarClient displayName="Viktor Vanlier" avatarUrl={null} userEmail="viktor@example.com" isPro={false} username="viktor" currentStreak={7} totalPoints={1240} streakFreezes={2} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <DashboardHome firstName="Viktor" greeting="good morning" username="viktor" levelName="Unwell" levelNum={5} totalPoints={1240} currentStreak={7} streakFreezes={2} quests={Q} nextLevelPoints={1500} currentLevelPoints={1000} />
        <MobileNavBar username="viktor" />
      </div>
    </div>
  );
}
