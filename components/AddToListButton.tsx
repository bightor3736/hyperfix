"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { addFixToList, removeFixFromList, createList } from "@/app/actions/lists";
import { Plus, TickSquare } from "react-iconly";

type FixList = {
  id: string;
  name: string;
  is_public: boolean;
  hasThisFix: boolean;
};

export function AddToListButton({ fixId }: { fixId: string }) {
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<FixList[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function fetchLists() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: allLists } = await supabase
      .from("fix_lists")
      .select("id, name, is_public")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: listItems } = await supabase
      .from("fix_list_items")
      .select("list_id")
      .eq("fix_id", fixId);

    const inListIds = new Set((listItems ?? []).map((i: { list_id: string }) => i.list_id));

    setLists(
      (allLists ?? []).map((l: { id: string; name: string; is_public: boolean }) => ({
        ...l,
        hasThisFix: inListIds.has(l.id),
      }))
    );
    setLoading(false);
  }

  async function handleOpen() {
    setOpen(true);
    await fetchLists();
  }

  async function toggleList(list: FixList) {
    setPending(list.id);
    if (list.hasThisFix) {
      await removeFixFromList(list.id, fixId);
    } else {
      await addFixToList(list.id, fixId);
    }
    setLists((prev) =>
      prev.map((l) =>
        l.id === list.id ? { ...l, hasThisFix: !l.hasThisFix } : l
      )
    );
    setPending(null);
  }

  async function handleCreateList() {
    if (!newListName.trim()) return;
    setPending("new");
    const result = await createList(newListName.trim(), "", true);
    if (result && "id" in result) {
      await addFixToList(result.id, fixId);
      setLists((prev) => [
        { id: result.id, name: newListName.trim(), is_public: true, hasThisFix: true },
        ...prev,
      ]);
    }
    setNewListName("");
    setCreating(false);
    setPending(null);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-widest transition-all duration-150"
        style={{
          background: "rgba(244,244,244,0.05)",
          border: "1px solid rgba(244,244,244,0.12)",
          color: "rgba(244,244,244,0.5)",
        }}
      >
        <Plus set="light" size={13} primaryColor="currentColor" />
        Add to list
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-64 rounded-xl overflow-hidden"
          style={{
            background: "#1A1A1C",
            border: "1px solid rgba(244,244,244,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            right: 0,
          }}
        >
          <div className="px-3 py-2.5" style={{ borderBottom: "1px solid rgba(244,244,244,0.07)" }}>
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,244,244,0.4)" }}>
              Your lists
            </p>
          </div>

          <div className="max-h-52 overflow-y-auto">
            {loading ? (
              <div className="px-3 py-4 font-mono text-[11px] text-center" style={{ color: "rgba(244,244,244,0.3)" }}>
                loading…
              </div>
            ) : lists.length === 0 ? (
              <div className="px-3 py-4 font-mono text-[11px] text-center" style={{ color: "rgba(244,244,244,0.3)" }}>
                No lists yet
              </div>
            ) : (
              lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => toggleList(list)}
                  disabled={pending === list.id}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-[rgba(244,244,244,0.05)]"
                >
                  <span className="font-sans text-sm truncate" style={{ color: list.hasThisFix ? "#5EEAD4" : "rgba(244,244,244,0.8)" }}>
                    {list.name}
                  </span>
                  <span
                    className="shrink-0 w-4 h-4 rounded flex items-center justify-center ml-2"
                    style={{
                      background: list.hasThisFix ? "#5EEAD4" : "rgba(244,244,244,0.08)",
                      border: list.hasThisFix ? "none" : "1px solid rgba(244,244,244,0.15)",
                    }}
                  >
                    {list.hasThisFix && (
                      <TickSquare set="bold" size={10} primaryColor="#0A0A0A" />
                    )}
                  </span>
                </button>
              ))
            )}
          </div>

          <div style={{ borderTop: "1px solid rgba(244,244,244,0.07)" }}>
            {creating ? (
              <div className="flex items-center gap-2 px-3 py-2">
                <input
                  autoFocus
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreateList(); if (e.key === "Escape") setCreating(false); }}
                  placeholder="List name…"
                  className="flex-1 bg-transparent outline-none font-sans text-sm"
                  style={{ color: "#F4F4F4" }}
                />
                <button
                  onClick={handleCreateList}
                  disabled={!newListName.trim() || pending === "new"}
                  className="font-mono text-[10px] px-2 py-1 rounded transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ background: "#5EEAD4", color: "#0A0A0A" }}
                >
                  Create
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="w-full flex items-center gap-2 px-3 py-2.5 font-mono text-[11px] transition-colors hover:bg-[rgba(244,244,244,0.05)]"
                style={{ color: "rgba(244,244,244,0.4)" }}
              >
                <Plus set="light" size={13} primaryColor="currentColor" />
                New list
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
