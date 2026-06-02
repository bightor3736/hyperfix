import { redirect } from "next/navigation";

// Legacy / shortcut entry point for "log your first fixation". Lives at a
// stable URL referenced from onboarding, emails, and CTAs — forwards into the
// fixations page with the create form auto-opened.
export default async function NewFixRedirect({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { welcome } = await searchParams;
  redirect(`/dashboard/fixations?new=1${welcome ? "&welcome=1" : ""}`);
}
