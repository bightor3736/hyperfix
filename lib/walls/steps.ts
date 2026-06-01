// ─────────────────────────────────────────────────────────────
// Beat the Wall: shrink a dreaded task into a 2-minute first step.
// Rule-based (no AI dependency) — matches keywords in the task and
// returns a concrete, tiny, physical first action. The whole trick is
// that starting is the wall; once you start, momentum does the rest.
// ─────────────────────────────────────────────────────────────

type Rule = { match: RegExp; step: (task: string) => string };

const RULES: Rule[] = [
  { match: /\b(email|inbox|reply|respond|message back)\b/i, step: () => "Open the email and just read it once. Don't reply yet." },
  { match: /\b(call|phone|ring|appointment|book|schedule)\b/i, step: () => "Find the number and write it on a note. That's it." },
  { match: /\b(dishes|kitchen|wash up|sink)\b/i, step: () => "Wash exactly one item. Put it in the rack. Stop if you want." },
  { match: /\b(laundry|washing|clothes)\b/i, step: () => "Pick up 5 pieces of clothing and put them in one pile." },
  { match: /\b(clean|tidy|mess|room|declutter)\b/i, step: () => "Clear one single surface. Just one. Set a 2-minute timer." },
  { match: /\b(essay|write|report|paper|assignment|thesis)\b/i, step: () => "Open the doc and write one ugly sentence. It can be terrible." },
  { match: /\b(study|revise|exam|homework|read)\b/i, step: () => "Open the material and read the first paragraph out loud." },
  { match: /\b(gym|workout|exercise|run|walk)\b/i, step: () => "Put on your shoes. Only the shoes. You can stop after." },
  { match: /\b(form|paperwork|tax|admin|application|document)\b/i, step: () => "Open the form and fill in only your name. Nothing else." },
  { match: /\b(code|bug|pull request|pr|refactor|ticket)\b/i, step: () => "Open the file and read the function you're avoiding. Don't fix it yet." },
  { match: /\b(pack|move|suitcase|box)\b/i, step: () => "Put one thing in the bag. The most obvious one." },
  { match: /\b(text|dm)\b/i, step: () => "Open the chat and type just 'hey'. Don't send yet if you don't want." },
  { match: /\b(pay|bill|invoice|money|bank)\b/i, step: () => "Open the app and just look at the amount. Don't pay yet." },
];

const GENERIC: ((task: string) => string)[] = [
  () => "Set a 2-minute timer and do the smallest visible piece. Stop when it rings.",
  () => "Do the very first physical action — open it, pick it up, sit down with it. Nothing more.",
  () => "Name out loud the one thing you'd touch first, then touch it.",
];

export function firstStepFor(task: string): string {
  const t = task.trim();
  for (const rule of RULES) {
    if (rule.match.test(t)) return rule.step(t);
  }
  // Deterministic generic fallback based on length so it feels intentional.
  return GENERIC[t.length % GENERIC.length](t);
}

export const WALL_XP = 20;
