import * as React from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Pencil, Info, Plus } from 'lucide-react';
import { BriefBox } from './BriefBox';
import { CriterionRow } from './CriterionRow';
import { MatchesResultsView } from './MatchesResultsView';
import { AutoDemoOverlay } from './AutoDemoOverlay';
import {
  SAMPLE_PROMPT,
  SAMPLE_MUST_HAVE,
  SAMPLE_NICE_TO_HAVE,
} from '@/config/criteriaSample';
import { onParseBrief } from '@/lib/ranking';

export function CriteriaBuilder({
  replayTrigger = 0,
}) {
  // State
  const [prompt, setPrompt] = React.useState(SAMPLE_PROMPT);
  const [attachedFile, setAttachedFile] = React.useState(null);
  const [mustHave, setMustHave] = React.useState(SAMPLE_MUST_HAVE);
  const [niceToHave, setNiceToHave] = React.useState(SAMPLE_NICE_TO_HAVE);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [view, setView] = React.useState('builder'); // 'builder' | 'matches'
  const [isExtracting, setIsExtracting] = React.useState(false);
  const [activeDragId, setActiveDragId] = React.useState(null);
  const [liveAnnouncement, setLiveAnnouncement] = React.useState('');
  const [isAutoDemoActive, setIsAutoDemoActive] = React.useState(false);

  // New criterion form state
  const [showAddCriterionModal, setShowAddCriterionModal] = React.useState(false);
  const [newCriterionLabel, setNewCriterionLabel] = React.useState('');
  const [newCriterionTargetList, setNewCriterionTargetList] = React.useState('mustHave');

  const scrollRef = React.useRef(null);
  const abortControllerRef = React.useRef(null);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4, // Prevents clicks on edit/buttons from triggering drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Trigger auto-demo once when mounted or on replay trigger
  React.useEffect(() => {
    if (replayTrigger > 0) {
      setMustHave(SAMPLE_MUST_HAVE);
      setNiceToHave(SAMPLE_NICE_TO_HAVE);
      setView('builder');
      setIsAutoDemoActive(true);
    }
  }, [replayTrigger]);

  // Handle brief extraction
  const handleExtractBrief = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsExtracting(true);
    setLiveAnnouncement('Extracting hiring criteria from brief...');

    try {
      const parsed = await onParseBrief(prompt, attachedFile, controller.signal);
      setMustHave(parsed.mustHave);
      setNiceToHave(parsed.niceToHave);
      setLiveAnnouncement(
        `Extracted ${parsed.mustHave.length} must-have criteria and ${parsed.niceToHave.length} nice-to-have criteria.`
      );
    } catch (err) {
      if (err.name !== 'AbortError') {
        setLiveAnnouncement('Error extracting criteria. Please try again.');
      }
    } finally {
      setIsExtracting(false);
    }
  };

  // Find criterion by id
  const findCriterion = (id) => {
    const inMust = mustHave.find((c) => c.id === id);
    if (inMust) return { criterion: inMust, listType: 'mustHave' };
    const inNice = niceToHave.find((c) => c.id === id);
    if (inNice) return { criterion: inNice, listType: 'niceToHave' };
    return null;
  };

  // Drag handlers
  const handleDragStart = (event) => {
    setIsAutoDemoActive(false);
    const { active } = event;
    setActiveDragId(active.id);
    const found = findCriterion(active.id);
    if (found) {
      setLiveAnnouncement(`Picked up ${found.criterion.label}. Press arrow keys to move, Space to drop.`);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeFound = findCriterion(active.id);
    const overFound = findCriterion(over.id);

    if (!activeFound) return;

    // Moving across lists during drag
    if (overFound && activeFound.listType !== overFound.listType) {
      const sourceList = activeFound.listType === 'mustHave' ? mustHave : niceToHave;

      const item = sourceList.find((c) => c.id === active.id);
      if (!item) return;

      if (activeFound.listType === 'mustHave') {
        setMustHave((prev) => prev.filter((c) => c.id !== active.id));
        setNiceToHave((prev) => [...prev, item]);
      } else {
        setNiceToHave((prev) => prev.filter((c) => c.id !== active.id));
        setMustHave((prev) => [...prev, item]);
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) {
      setLiveAnnouncement('Drag cancelled.');
      return;
    }

    const activeFound = findCriterion(active.id);
    const overFound = findCriterion(over.id);

    if (activeFound && overFound && activeFound.listType === overFound.listType) {
      const list = activeFound.listType === 'mustHave' ? mustHave : niceToHave;
      const oldIndex = list.findIndex((c) => c.id === active.id);
      const newIndex = list.findIndex((c) => c.id === over.id);

      if (oldIndex !== newIndex) {
        const reordered = arrayMove(list, oldIndex, newIndex);
        if (activeFound.listType === 'mustHave') {
          setMustHave(reordered);
        } else {
          setNiceToHave(reordered);
        }
        setLiveAnnouncement(
          `Moved ${activeFound.criterion.label} to position ${newIndex + 1} of ${reordered.length} in ${
            activeFound.listType === 'mustHave' ? 'Must have' : 'Nice to have'
          }.`
        );
      }
    } else {
      setLiveAnnouncement(`Dropped ${activeFound?.criterion.label}.`);
    }
  };

  // Non-drag accessibility movements
  const handleMoveUp = (id) => {
    const found = findCriterion(id);
    if (!found) return;
    const list = found.listType === 'mustHave' ? mustHave : niceToHave;
    const idx = list.findIndex((c) => c.id === id);
    if (idx <= 0) return;
    const reordered = arrayMove(list, idx, idx - 1);
    if (found.listType === 'mustHave') setMustHave(reordered);
    else setNiceToHave(reordered);
    setLiveAnnouncement(`Moved ${found.criterion.label} up.`);
  };

  const handleMoveDown = (id) => {
    const found = findCriterion(id);
    if (!found) return;
    const list = found.listType === 'mustHave' ? mustHave : niceToHave;
    const idx = list.findIndex((c) => c.id === id);
    if (idx < 0 || idx >= list.length - 1) return;
    const reordered = arrayMove(list, idx, idx + 1);
    if (found.listType === 'mustHave') setMustHave(reordered);
    else setNiceToHave(reordered);
    setLiveAnnouncement(`Moved ${found.criterion.label} down.`);
  };

  const handleMoveAcross = (id, currentListType) => {
    if (currentListType === 'mustHave') {
      const item = mustHave.find((c) => c.id === id);
      if (!item) return;
      setMustHave((prev) => prev.filter((c) => c.id !== id));
      setNiceToHave((prev) => [...prev, item]);
      setLiveAnnouncement(`Moved ${item.label} to Nice to have.`);
    } else {
      const item = niceToHave.find((c) => c.id === id);
      if (!item) return;
      setNiceToHave((prev) => prev.filter((c) => c.id !== id));
      setMustHave((prev) => [...prev, item]);
      setLiveAnnouncement(`Moved ${item.label} to Must have.`);
    }
  };

  const handleDeleteCriterion = (id) => {
    setMustHave((prev) => prev.filter((c) => c.id !== id));
    setNiceToHave((prev) => prev.filter((c) => c.id !== id));
    setLiveAnnouncement('Deleted criterion.');
  };

  const handleAddValue = (id, value) => {
    const updater = (list) =>
      list.map((c) => (c.id === id ? { ...c, values: [...c.values, value] } : c));
    setMustHave(updater);
    setNiceToHave(updater);
  };

  const handleRemoveValue = (id, value) => {
    const updater = (list) =>
      list.map((c) => (c.id === id ? { ...c, values: c.values.filter((v) => v !== value) } : c));
    setMustHave(updater);
    setNiceToHave(updater);
  };

  const handleCreateCustomCriterion = (e) => {
    e.preventDefault();
    const trimmed = newCriterionLabel.trim();
    if (!trimmed) return;
    const newCrit = {
      id: `custom-${Date.now()}`,
      category: 'other',
      label: trimmed.slice(0, 80),
      values: ['Custom requirement'],
    };
    if (newCriterionTargetList === 'mustHave') {
      setMustHave((prev) => [...prev, newCrit]);
    } else {
      setNiceToHave((prev) => [...prev, newCrit]);
    }
    setNewCriterionLabel('');
    setShowAddCriterionModal(false);
  };

  // Demo auto-drop completion helper
  const handleAutoDemoDrop = () => {
    const jobTitlesItem = niceToHave.find((c) => c.category === 'job_titles');
    if (jobTitlesItem) {
      setNiceToHave((prev) => prev.filter((c) => c.id !== jobTitlesItem.id));
      setMustHave((prev) => [jobTitlesItem, ...prev]);
    }
  };

  const activeCriterionObj = activeDragId ? findCriterion(activeDragId)?.criterion : null;

  return (
    <div
      onPointerDown={() => setIsAutoDemoActive(false)}
      onKeyDown={() => setIsAutoDemoActive(false)}
      className="relative flex h-[560px] w-full flex-col justify-between overflow-hidden rounded-[28px] border border-[var(--line)] bg-[rgb(var(--c-card))] p-6 shadow-[var(--shadow-card)]"
    >
      {/* Polite Accessibility Live Region */}
      <div className="sr-only" aria-live="polite">
        {liveAnnouncement}
      </div>

      {/* Scripted Auto-demo overlay */}
      <AutoDemoOverlay
        isPlaying={isAutoDemoActive}
        onStopDemo={() => {
          setIsAutoDemoActive(false);
        }}
        onCompleteDrop={handleAutoDemoDrop}
        scrollContainerRef={scrollRef}
      />

      {view === 'matches' ? (
        <MatchesResultsView
          criteriaConfig={{
            rawPrompt: prompt,
            attachedBriefFile: attachedFile,
            mustHave,
            niceToHave,
          }}
          onBackToEdit={() => setView('builder')}
        />
      ) : (
        <>
          {/* Scrollable Criteria Configuration Area */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-1">
            {/* Card Title */}
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
              <h3 className="text-[17px] font-bold text-[rgb(var(--c-text))]">
                Who are you hiring?
              </h3>
              <span className="text-[12px] text-[rgb(var(--c-muted-2))]">
                {mustHave.length + niceToHave.length} criteria active
              </span>
            </div>

            {/* Brief Box */}
            <BriefBox
              prompt={prompt}
              onPromptChange={setPrompt}
              attachedFile={attachedFile}
              onFileAttach={setAttachedFile}
              onFileRemove={() => setAttachedFile(null)}
              onExtract={handleExtractBrief}
              isExtracting={isExtracting}
            />

            {/* dnd-kit context for criteria lists */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              {/* 1. MUST HAVE (Hard Filter) */}
              <div className="rounded-[18px] border border-[var(--line)] bg-[rgb(var(--c-chip)/0.5)] p-3.5">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-bold text-[rgb(var(--c-text))]">
                      Must have
                    </span>
                    <span
                      title="Candidates who don't match are filtered out."
                      className="inline-flex cursor-help text-[rgb(var(--c-muted-2))]"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[12px] text-[rgb(var(--c-muted-2))]">
                      (Mandatory filter)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditMode((prev) => !prev)}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-[rgb(var(--c-indigo))] hover:underline cursor-pointer"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>{isEditMode ? 'Done' : 'Edit'}</span>
                  </button>
                </div>

                <SortableContext
                  items={mustHave.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {mustHave.map((crit, idx) => (
                      <CriterionRow
                        key={crit.id}
                        criterion={crit}
                        listType="mustHave"
                        index={idx}
                        totalInList={mustHave.length}
                        isEditMode={isEditMode}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        onMoveAcross={handleMoveAcross}
                        onDeleteCriterion={handleDeleteCriterion}
                        onAddValue={handleAddValue}
                        onRemoveValue={handleRemoveValue}
                      />
                    ))}
                    {mustHave.length === 0 && (
                      <div className="rounded-[12px] border border-dashed border-[var(--line-strong)] p-3 text-center text-[12px] text-[rgb(var(--c-muted-2))]">
                        No mandatory criteria. Drag an item here or use options menu.
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>

              {/* 2. NICE TO HAVE (Weighted Priority) */}
              <div className="rounded-[18px] border border-[var(--line)] bg-[rgb(var(--c-chip)/0.5)] p-3.5">
                <div className="mb-2.5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-bold text-[rgb(var(--c-text))]">
                        Nice to have
                      </span>
                      <span className="text-[12px] text-[rgb(var(--c-muted-2))]">
                        (Weighted priority)
                      </span>
                    </div>
                    <p className="text-[12px] text-[rgb(var(--c-muted))]">
                      Drag to change the order of priority.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditMode((prev) => !prev)}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-[rgb(var(--c-indigo))] hover:underline cursor-pointer"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>{isEditMode ? 'Done' : 'Edit'}</span>
                  </button>
                </div>

                <SortableContext
                  items={niceToHave.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {niceToHave.map((crit, idx) => (
                      <CriterionRow
                        key={crit.id}
                        criterion={crit}
                        listType="niceToHave"
                        index={idx}
                        totalInList={niceToHave.length}
                        isEditMode={isEditMode}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        onMoveAcross={handleMoveAcross}
                        onDeleteCriterion={handleDeleteCriterion}
                        onAddValue={handleAddValue}
                        onRemoveValue={handleRemoveValue}
                      />
                    ))}
                    {niceToHave.length === 0 && (
                      <div className="rounded-[12px] border border-dashed border-[var(--line-strong)] p-3 text-center text-[12px] text-[rgb(var(--c-muted-2))]">
                        No nice-to-have criteria.
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>

              {/* Drag Overlay for smooth transform-only drag previews */}
              <DragOverlay>
                {activeCriterionObj ? (
                  <CriterionRow
                    criterion={activeCriterionObj}
                    listType="niceToHave"
                    index={0}
                    totalInList={1}
                    isEditMode={false}
                    isDragOverlay={true}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>

            {/* Custom Criterion Quick Add button in edit mode */}
            {isEditMode && (
              <div className="pt-1">
                {!showAddCriterionModal ? (
                  <button
                    type="button"
                    onClick={() => setShowAddCriterionModal(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--line-strong)] py-2 text-[13px] font-semibold text-[rgb(var(--c-indigo))] hover:bg-[rgb(var(--c-tint))]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add custom criterion</span>
                  </button>
                ) : (
                  <form
                    onSubmit={handleCreateCustomCriterion}
                    className="rounded-xl border border-[var(--line)] bg-[rgb(var(--c-chip))] p-3 space-y-2"
                  >
                    <label className="text-[12px] font-bold text-[rgb(var(--c-text))] block">
                      New criterion label:
                    </label>
                    <input
                      type="text"
                      value={newCriterionLabel}
                      onChange={(e) => setNewCriterionLabel(e.target.value)}
                      placeholder="e.g. System Design, Mentorship"
                      maxLength={80}
                      autoFocus
                      className="w-full rounded-lg border border-[var(--line-strong)] bg-[rgb(var(--c-card))] px-3 py-1.5 text-[13px] text-[rgb(var(--c-text))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--c-indigo))]"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <select
                        value={newCriterionTargetList}
                        onChange={(e) => setNewCriterionTargetList(e.target.value)}
                        className="rounded-lg border border-[var(--line)] bg-[rgb(var(--c-card))] px-2 py-1 text-[12px]"
                      >
                        <option value="mustHave">Add to Must have</option>
                        <option value="niceToHave">Add to Nice to have</option>
                      </select>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddCriterionModal(false)}
                          className="px-2 py-1 text-[12px] text-[rgb(var(--c-muted))]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-lg bg-[rgb(var(--c-btn))] px-3 py-1 text-[12px] font-semibold text-[rgb(var(--c-btn-text))]"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Sticky Bottom Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-3">
            <span className="text-[12px] text-[rgb(var(--c-muted-2))]">
              {mustHave.length} mandatory • {niceToHave.length} weighted
            </span>
            <button
              type="button"
              onClick={() => setView('matches')}
              className="btn-gold min-h-[46px] px-6 text-[15px]"
            >
              See matches →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
