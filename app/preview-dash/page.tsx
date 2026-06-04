"use client";
import { DashboardSidebarClient } from "../dashboard/DashboardSidebarClient";
import { DashboardHome } from "../dashboard/DashboardHome";
import { MobileNavBar } from "../dashboard/MobileNavBar";
import type { Quest } from "@/lib/quests/generate";

const Q: Quest[] = [
  { id:"1",kind:"check_in",title:"Check in for the day",description:"Open the app",xp_reward:5,href:"/dashboard",completed_at:new Date().toISOString() } as unknown as Quest,
  { id:"2",kind:"brain_dump",title:"Brain-dump one thing",description:"Get it out of your head",xp_reward:10,href:"/dashboard",completed_at:null } as unknown as Quest,
  { id:"3",kind:"focus_session",title:"One 10-minute focus sprint",description:"Tiny timer, tiny win",xp_reward:15,href:"/dashboard",completed_at:null } as unknown as Quest,
];

const S = {"--bg":"#f5f5ff","--bg-soft":"#eeeeff","--bg-elevated":"#ffffff","--ink":"#0b0b12","--ink-muted":"#6b6b78","--ink-faint":"#a2a2af","--line":"rgba(15,15,40,0.09)","--line-strong":"rgba(15,15,40,0.18)","--accent":"#4f46e5","--accent-soft":"#eeecff","--accent-ink":"#ffffff","--energy":"#4f46e5","--energy-soft":"#eeecff","--xp":"#7c3aed","--xp-soft":"#f1eafe","--flame":"#f97316","--flame-soft":"#fff0e3","--primary":"#4f46e5","--primary-foreground":"#ffffff","--card":"#ffffff","--card-foreground":"#0b0b12","--muted-foreground":"#6b6b78","--border":"rgba(15,15,40,0.09)","--invert-bg":"#16161d","--invert-ink":"#ffffff","--reward-mint":"#059669","--reward-mint-soft":"#d1fae5",background:"var(--bg)",fontFamily:"var(--font-landing-sans),Inter,system-ui,sans-serif",color:"#0b0b12"} as React.CSSProperties;

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
