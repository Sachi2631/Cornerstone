"use client";

import React, { useEffect, useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Link from "next/link";

import { upsertLessonNote } from "@/features/learning/notesActions";
import type { NotebookEntry } from "@/features/learning/types";

const BRAND = "#B43D20";

type EditableEntry = NotebookEntry & { savedBody: string; saving: boolean; error?: string };

type Props = {
  open: boolean;
  onClose: () => void;
  /** Every note the learner has, across every lesson — the shared notebook. */
  notes: NotebookEntry[];
  /** Which lesson's icon opened this — its sticky sits first, so it's on
   *  screen the moment the dialog opens with no scrolling needed. */
  focusLesson: { slug: string; title: string; href?: string };
  /**
   * Reports each successful save (or clear) back to the caller, so a note
   * written just now shows up if a *different* lesson's notebook is opened
   * next in the same session — without this, the caller's `notes` prop is a
   * one-time server read and would otherwise go stale until the page reloads.
   */
  onSaved?: (entry: NotebookEntry | { lessonId: string; cleared: true }) => void;
};

/*
 * The sticky-note popup. One dialog, reused from both the lessons list and
 * the lesson player — "notebook" rather than "note", because it always shows
 * every lesson's note, not just the one that was clicked. What changes
 * between the two call sites is only which entry sits on top.
 */
const NotesNotebookDialog: React.FC<Props> = ({ open, onClose, notes, focusLesson, onSaved }) => {
  const [entries, setEntries] = useState<EditableEntry[]>([]);

  // Rebuilt on every open so a note saved elsewhere (or in a previous open)
  // shows up, with the focused lesson always first.
  useEffect(() => {
    if (!open) return;
    const existing = notes.find((n) => n.lessonId === focusLesson.slug);
    const focusEntry: EditableEntry = existing
      ? { ...existing, savedBody: existing.body, saving: false }
      : {
          lessonId: focusLesson.slug,
          title: focusLesson.title,
          href: focusLesson.href,
          body: "",
          savedBody: "",
          updatedAt: "",
          saving: false,
        };
    const rest = notes
      .filter((n) => n.lessonId !== focusLesson.slug)
      .map((n) => ({ ...n, savedBody: n.body, saving: false }));
    setEntries([focusEntry, ...rest]);
  }, [open, notes, focusLesson.slug, focusLesson.title, focusLesson.href]);

  const setBody = (lessonId: string, body: string) => {
    setEntries((prev) => prev.map((e) => (e.lessonId === lessonId ? { ...e, body, error: undefined } : e)));
  };

  // Autosaves when the field loses focus — the closest thing to "put the
  // sticky note down" a text field has, and it means there is nothing to
  // remember to click before closing the dialog.
  const save = async (lessonId: string) => {
    setEntries((prevEntries) => {
      const entry = prevEntries.find((e) => e.lessonId === lessonId);
      if (!entry || entry.body === entry.savedBody) return prevEntries;

      void (async () => {
        const result = await upsertLessonNote({ lessonId, body: entry.body });
        const updatedAt = new Date().toISOString();
        setEntries((prev) =>
          prev.map((e) =>
            e.lessonId === lessonId
              ? {
                  ...e,
                  saving: false,
                  savedBody: result.ok ? entry.body : e.savedBody,
                  updatedAt: result.ok ? updatedAt : e.updatedAt,
                  error: result.ok ? undefined : result.message,
                }
              : e
          )
        );
        if (!result.ok) return;
        if (entry.body.trim() === "") onSaved?.({ lessonId, cleared: true });
        else onSaved?.({ lessonId, title: entry.title, href: entry.href, body: entry.body, updatedAt });
      })();

      return prevEntries.map((e) => (e.lessonId === lessonId ? { ...e, saving: true } : e));
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        Notes
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5, bgcolor: "#F9F7F4" }}>
        {entries.map((entry) => {
          const dirty = entry.body !== entry.savedBody;
          return (
            <Box
              key={entry.lessonId}
              sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: "#FFFBEB",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 1, gap: 1 }}>
                {entry.href ? (
                  <Typography
                    component={Link}
                    href={entry.href}
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      color: "#1C1917",
                      textDecoration: "none",
                      "&:hover": { color: BRAND },
                    }}
                  >
                    {entry.title}
                  </Typography>
                ) : (
                  <Typography sx={{ fontWeight: 800, fontSize: "0.9rem" }}>{entry.title}</Typography>
                )}
                {entry.updatedAt && (
                  <Typography variant="caption" sx={{ color: "text.secondary", flexShrink: 0 }}>
                    {new Date(entry.updatedAt).toLocaleDateString()}
                  </Typography>
                )}
              </Box>

              <TextField
                value={entry.body}
                onChange={(e) => setBody(entry.lessonId, e.target.value)}
                onBlur={() => void save(entry.lessonId)}
                placeholder="Write a note for this lesson…"
                multiline
                minRows={2}
                maxRows={10}
                fullWidth
                variant="standard"
                slotProps={{ input: { disableUnderline: true } }}
                sx={{ fontSize: "0.9rem" }}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5, minHeight: 18 }}>
                {entry.error ? (
                  <Typography variant="caption" sx={{ color: "#DC2626" }}>
                    {entry.error}
                  </Typography>
                ) : entry.saving ? (
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Saving…
                  </Typography>
                ) : dirty ? (
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Unsaved — click away to save
                  </Typography>
                ) : entry.savedBody ? (
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Saved
                  </Typography>
                ) : null}
              </Box>
            </Box>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default NotesNotebookDialog;
