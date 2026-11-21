import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreVertical, Plus, X, ArrowUp, ArrowDown, ArrowRightLeft } from 'lucide-react';

/**
 * CriterionRow component.
 * Supports drag-and-drop via @dnd-kit and full accessible keyboard/menu non-drag actions.
 */
export function CriterionRow({
  criterion,
  listType, // 'mustHave' | 'niceToHave'
  index,
  totalInList,
  isEditMode,
  onMoveUp,
  onMoveDown,
  onMoveAcross,
  onDeleteCriterion,
  onAddValue,
  onRemoveValue,
  isDragOverlay = false,
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [newChipText, setNewChipText] = React.useState('');
  const [showAddChipInput, setShowAddChipInput] = React.useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: criterion.id,
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition || undefined,
  };

  const handleAddChipSubmit = (e) => {
    e.preventDefault();
    const trimmed = newChipText.trim();
    if (trimmed && onAddValue) {
      onAddValue(criterion.id, trimmed.slice(0, 40));
      setNewChipText('');
      setShowAddChipInput(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-[16px] border transition-colors ${
        isDragging
          ? 'z-30 border-[rgb(var(--c-indigo))] bg-[rgb(var(--c-tint))] shadow-md opacity-90'
          : 'border-[var(--line)] bg-[rgb(var(--c-card))] hover:bg-[rgb(var(--c-chip))]'
      }`}
    >
      <div className="flex items-start justify-between gap-3 p-3.5">
        {/* Left: Grip Handle + Content */}
        <div className="flex flex-1 items-start gap-2.5 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Drag handle for ${criterion.label}. Press Space to reorder.`}
            className="mt-0.5 flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded text-[rgb(var(--c-muted-2))] hover:text-[rgb(var(--c-text))] active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--c-indigo))]"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-[rgb(var(--c-text))]">
                {criterion.label}
              </span>
            </div>

            {/* Chips List */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {criterion.values.map((val) => (
                <span
                  key={val}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[rgb(var(--c-chip))] px-3 py-1 text-[13px] font-medium text-[rgb(var(--c-text))]"
                >
                  <span>{val}</span>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => onRemoveValue && onRemoveValue(criterion.id, val)}
                      aria-label={`Remove value ${val} from ${criterion.label}`}
                      className="text-[rgb(var(--c-muted-2))] hover:text-red-600 focus-visible:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}

              {isEditMode && !showAddChipInput && (
                <button
                  type="button"
                  onClick={() => setShowAddChipInput(true)}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--line-strong)] px-2.5 py-1 text-[12px] font-semibold text-[rgb(var(--c-indigo))] hover:bg-[rgb(var(--c-tint))] focus-visible:outline-none"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add</span>
                </button>
              )}

              {isEditMode && showAddChipInput && (
                <form onSubmit={handleAddChipSubmit} className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    value={newChipText}
                    onChange={(e) => setNewChipText(e.target.value)}
                    placeholder="New value"
                    autoFocus
                    className="h-6 w-28 rounded-full border border-[var(--line-strong)] bg-[rgb(var(--c-card))] px-2 text-[12px] text-[rgb(var(--c-text))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--c-indigo))]"
                  />
                  <button
                    type="submit"
                    className="h-6 rounded-full bg-[rgb(var(--c-btn))] px-2 text-[11px] font-semibold text-[rgb(var(--c-btn-text))]"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddChipInput(false);
                      setNewChipText('');
                    }}
                    className="text-[rgb(var(--c-muted-2))]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right: Non-drag Accessible Action Menu */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={`Options for ${criterion.label}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[rgb(var(--c-muted-2))] transition-colors hover:bg-[rgb(var(--c-chip))] hover:text-[rgb(var(--c-text))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--c-indigo))]"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-9 z-50 w-48 rounded-[14px] border border-[var(--line)] bg-[rgb(var(--c-card))] p-1.5 shadow-lg animate-fade-in"
              role="menu"
            >
              {index > 0 && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onMoveUp && onMoveUp(criterion.id);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium text-[rgb(var(--c-text))] hover:bg-[rgb(var(--c-chip))]"
                >
                  <ArrowUp className="h-3.5 w-3.5 text-[rgb(var(--c-muted-2))]" />
                  <span>Move up</span>
                </button>
              )}

              {index < totalInList - 1 && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onMoveDown && onMoveDown(criterion.id);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium text-[rgb(var(--c-text))] hover:bg-[rgb(var(--c-chip))]"
                >
                  <ArrowDown className="h-3.5 w-3.5 text-[rgb(var(--c-muted-2))]" />
                  <span>Move down</span>
                </button>
              )}

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onMoveAcross && onMoveAcross(criterion.id, listType);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium text-[rgb(var(--c-text))] hover:bg-[rgb(var(--c-chip))]"
              >
                <ArrowRightLeft className="h-3.5 w-3.5 text-[rgb(var(--c-indigo))]" />
                <span>
                  {listType === 'mustHave' ? 'Move to Nice to have' : 'Move to Must have'}
                </span>
              </button>

              {isEditMode && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onDeleteCriterion && onDeleteCriterion(criterion.id);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium text-red-600 hover:bg-red-50"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Delete criterion</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
