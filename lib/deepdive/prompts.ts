// Deep Dive — bite-sized reflection prompts you answer about a hyperfixation.
// Answering one earns XP. They're deliberately open-ended journaling prompts
// (not AI-generated "facts" that could be wrong) so every answer is true by
// definition and builds a real record of your obsession over time.

export type DeepDivePrompt = {
  key: string;
  // The question shown on the card.
  question: string;
  // A lighter sub-line / example to lower the friction of answering.
  hint: string;
  // Short placeholder shown in the textarea.
  placeholder: string;
};

// Ordered roughly from easiest ("just landed in it") to deepest. The deck
// surfaces the next unanswered prompt first, so the experience deepens over
// time instead of asking everything at once.
export const DEEP_DIVE_PROMPTS: DeepDivePrompt[] = [
  {
    key: "origin",
    question: "What pulled you in?",
    hint: "Be honest — was it a video, a person, a random 2am thought?",
    placeholder: "It started when…",
  },
  {
    key: "surprise",
    question: "What's one thing that genuinely surprised you?",
    hint: "The fact that made you go “wait, what?”",
    placeholder: "I had no idea that…",
  },
  {
    key: "explain_simple",
    question: "Explain it like I'm five.",
    hint: "One sentence. No jargon. Teaching it back is how it sticks.",
    placeholder: "Basically, it's…",
  },
  {
    key: "rabbit_hole",
    question: "What's the next rabbit hole you want to go down?",
    hint: "The thing you keep meaning to look up.",
    placeholder: "Next I want to dig into…",
  },
  {
    key: "made_collected",
    question: "What have you made, bought, or collected because of this?",
    hint: "Receipts, tabs, gear, a whole new shelf — no judgment.",
    placeholder: "So far I've…",
  },
  {
    key: "why_now",
    question: "Why does this matter to you right now?",
    hint: "What is it giving you that you needed?",
    placeholder: "Right now it's…",
  },
  {
    key: "convert",
    question: "How would you get someone else obsessed?",
    hint: "Your 30-second pitch to a friend.",
    placeholder: "You have to understand…",
  },
  {
    key: "future_self",
    question: "Where do you want this to be in a month?",
    hint: "A skill? A finished thing? Or just still fun — that counts too.",
    placeholder: "In a month I'd love to…",
  },
];

export const DEEP_DIVE_PROMPT_KEYS = new Set(DEEP_DIVE_PROMPTS.map((p) => p.key));

export function promptByKey(key: string): DeepDivePrompt | undefined {
  return DEEP_DIVE_PROMPTS.find((p) => p.key === key);
}
