import React, { useState } from "react";
import { Plus } from "lucide-react";
import BlockEditorItem, {
  createEmptyBlock,
  BLOCK_TYPES,
} from "@/components/admin/BlockEditorItem";

export default function BlockEditor({ blocks, onChange }) {
  const [showMenu, setShowMenu] = useState(false);

  const updateBlock = (index, data) => {
    const next = [...blocks];
    next[index] = { ...next[index], ...data };
    onChange(next);
  };

  const addBlock = (type) => {
    onChange([...(blocks || []), createEmptyBlock(type)]);
    setShowMenu(false);
  };

  const removeBlock = (index) => {
    onChange((blocks || []).filter((_, i) => i !== index));
  };

  const moveBlock = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= (blocks || []).length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {(blocks || []).map((block, i) => (
        <BlockEditorItem
          key={i}
          block={block}
          index={i}
          onChange={(data) => updateBlock(i, data)}
          onRemove={() => removeBlock(i)}
          onMoveUp={() => moveBlock(i, -1)}
          onMoveDown={() => moveBlock(i, 1)}
          canMoveUp={i > 0}
          canMoveDown={i < (blocks || []).length - 1}
        />
      ))}

      {/* Add block control */}
      <div className="relative pt-1">
        <button
          type="button"
          onClick={() => setShowMenu((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add content block
        </button>

        {showMenu && (
          <div className="mt-2 rounded-lg border border-border bg-popover p-1.5 shadow-md grid grid-cols-2 gap-1 z-10">
            {BLOCK_TYPES.map((b) => (
              <button
                key={b.type}
                type="button"
                onClick={() => addBlock(b.type)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-left hover:bg-accent transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                {b.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {(!blocks || blocks.length === 0) && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No content blocks yet. Add one above.
        </p>
      )}
    </div>
  );
}