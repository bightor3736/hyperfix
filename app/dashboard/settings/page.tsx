import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-8 pb-16" style={{ background: "#0A0A0A" }}>
      <div className="max-w-2xl mx-auto">
        <h1
          className="font-display font-bold mb-8"
          style={{
            color: "#F4F4F4",
            fontSize: "clamp(28px, 5vw, 42px)",
            letterSpacing: "-0.03em",
          }}
        >
          Settings
        </h1>

        <SettingsForm profile={profile} userEmail={user.email ?? ""} userId={user.id} />
      </div>
    </div>
  );
}
