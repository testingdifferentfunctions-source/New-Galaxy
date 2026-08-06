import React, { useState } from "react";
import { X, ArrowUp, ArrowDown, Plus, Trash2, GripVertical } from "lucide-react";

const BLOCK_TYPES = [
  { type: "heading", label: "Heading" },
  { type: "subheading", label: "Subheading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "list", label: "List" },
  { type: "code", label: "Code Block" },
  { type: "latex", label: "LaTeX Formula" },
];

function createEmptyBlock(type) {
  switch (type) {
    case "heading":
    case "subheading":
      return { type, text: "" };
    case "paragraph":
      return { type, text: "" };
    case "list":
      return { type, items: [""] };
    case "code":
      return { type, language: "python", code: "" };
    case "latex":
      return { type, formula: "" };
    default:
      return { type, text: "" };
  }
}

export default function BlockEditorItem({
  block,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) {
  const blockMeta = BLOCK_TYPES.find((b) => b.type === block.type) || {
    label: block.type,
  };

  return (
    <div className="rounded-lg border border-border bg-card p-3 mb-2 group">
      {/* Block header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground/50" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {blockMeta.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Block content editor */}
      {(block.type === "heading" || block.type === "subheading") && (
        <input
          type="text"
          value={block.text || ""}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder={
            block.type === "heading" ? "Heading text..." : "Subheading text..."
          }
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      )}

      {block.type === "paragraph" && (
        <textarea
          value={block.text || ""}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Paragraph text..."
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      )}

      {block.type === "list" && (
        <div className="space-y-2">
          {(block.items || []).map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const items = [...(block.items || [])];
                  items[i] = e.target.value;
                  onChange({ items });
                }}
                placeholder={`List item ${i + 1}...`}
                className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    items: (block.items || []).filter((_, idx) => idx !== i),
                  })
                }
                disabled={(block.items || []).length <= 1}
                className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ items: [...(block.items || []), ""] })}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
          >
            <Plus className="w-3 h-3" /> Add list item
          </button>
        </div>
      )}

      {block.type === "code" && (
        <div className="space-y-2">
          <input
            type="text"
            value={block.language || "python"}
            onChange={(e) => onChange({ language: e.target.value })}
            placeholder="Language (e.g. python)"
            className="w-40 rounded-md border border-border bg-background px-3 py-1 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
          <textarea
            value={block.code || ""}
            onChange={(e) => onChange({ code: e.target.value })}
            placeholder="Write code here..."
            rows={5}
            spellCheck={false}
            className="w-full rounded-md border border-border bg-zinc-900 text-zinc-50 px-3 py-2 text-sm font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
      )}

      {block.type === "latex" && (
        <div className="space-y-2">
          <textarea
            value={block.formula || ""}
            onChange={(e) => onChange({ formula: e.target.value })}
            placeholder="LaTeX formula, e.g. \int_0^1 x^2 \, dx = \frac{1}{3}"
            rows={3}
            spellCheck={false}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
          {block.formula && (
            <div className="rounded-md bg-muted/50 px-3 py-2 text-sm font-mono text-muted-foreground overflow-x-auto">
              {block.formula}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { createEmptyBlock, BLOCK_TYPES };