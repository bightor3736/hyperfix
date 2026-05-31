const eulogies = [
  {
    category: "A song",
    title: "Pink Pony Club",
    lived: "Lived 47 days",
    text: "Played four hundred times. Sang it in the shower until my flatmate asked, sincerely, to pick a different one.",
    user: "@maya",
  },
  {
    category: "A book series",
    title: "A Court of Thorns and Roses",
    lived: "Lived 112 days",
    text: "Read all five in eleven days. Then re-read book two. Then re-read book two again.",
    user: "@elise",
  },
  {
    category: "A character",
    title: "Astarion",
    lived: "Still counting",
    text: "Two hundred and three days in. Made a playlist. Bought a candle that smells like a cathedral.",
    user: "@theo",
  },
];

export function Graveyard() {
  return (
    <section id="graveyard" className="bg-bg-soft">
      <div className="mx-auto max-w-[1200px] px-6 py-24 sm:px-10 sm:py-28">
        <div className="max-w-[640px]">
          <h2 className="font-display text-[36px] leading-[1.05] tracking-tight text-ink sm:text-[44px]">
            Everything ends. Bury it properly.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-ink-muted">
            When a fix dies, you write the eulogy. It moves to a quiet room
            you can walk back into anytime.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {eulogies.map((e) => (
            <article
              key={e.title}
              className="flex flex-col rounded-[22px] border border-line bg-bg p-7"
            >
              <p className="text-[13px] text-ink-muted">{e.category}</p>
              <h3 className="mt-2 font-display text-[26px] leading-[1.1] tracking-tight text-ink">
                {e.title}
              </h3>
              <p className="mt-1.5 text-[13px] text-ink-faint">{e.lived}</p>
              <p className="mt-6 text-[14px] leading-[1.65] text-ink">
                &ldquo;{e.text}&rdquo;
              </p>
              <p className="mt-auto pt-6 text-[12px] text-ink-faint">
                {e.user}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
