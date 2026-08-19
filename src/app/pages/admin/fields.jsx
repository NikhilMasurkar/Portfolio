import React from "react";
import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";

/**
 * Field kit shared by the editors.
 *
 * Nothing clever — the point is that every editor gets the same affordances,
 * so adding a bullet feels the same wherever you are.
 */

/** Explains where a field actually shows up. */
export function Hint({ children }) {
  return (
    <Typography variant="caption" color="text.disabled" sx={{ display: "block", mb: 1.5 }}>
      {children}
    </Typography>
  );
}

/**
 * A list of plain strings — resume bullets, achievements.
 *
 * Multiline because resume bullets run long and a single-line input hides
 * their real length, which is exactly what decides whether they wrap badly in
 * the PDF.
 */
export function StringListField({ label, hint, rows, onChange, addLabel = "Add" }) {
  return (
    <Box>
      <Typography variant="subtitle2">{label}</Typography>
      {hint && <Hint>{hint}</Hint>}

      <Stack spacing={1.5}>
        {rows.map((row, index) => (
          <Stack key={index} direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
            <TextField
              fullWidth
              multiline
              value={row}
              onChange={(event) => {
                const next = [...rows];
                next[index] = event.target.value;
                onChange(next);
              }}
            />
            <Stack>
              <IconButton
                size="small"
                aria-label={`Move "${label}" item ${index + 1} up`}
                disabled={index === 0}
                onClick={() => {
                  const next = [...rows];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  onChange(next);
                }}
              >
                ↑
              </IconButton>
              <IconButton
                size="small"
                aria-label={`Remove "${label}" item ${index + 1}`}
                onClick={() => onChange(rows.filter((_, i) => i !== index))}
              >
                ✕
              </IconButton>
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Button size="small" sx={{ mt: 1.5 }} onClick={() => onChange([...rows, ""])}>
        {addLabel}
      </Button>
    </Box>
  );
}

/**
 * A list of grouped items: "Label: a, b, c".
 *
 * Items are edited as a comma-separated string because that is exactly how
 * they render on the resume — typing them the way they will read avoids
 * guessing at how a list of chips turns into a line of text.
 */
export function GroupListField({ label, hint, groups, onChange, itemsLabel = "Items" }) {
  const update = (index, patch) => {
    const next = [...groups];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <Box>
      <Typography variant="subtitle2">{label}</Typography>
      {hint && <Hint>{hint}</Hint>}

      <Stack spacing={2}>
        {groups.map((group, index) => (
          <Stack key={index} direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
            <TextField
              label="Label"
              value={group.label ?? ""}
              sx={{ flex: 1 }}
              onChange={(event) => update(index, { label: event.target.value })}
            />
            <TextField
              label={itemsLabel}
              fullWidth
              multiline
              sx={{ flex: 3 }}
              value={(group.items ?? []).join(", ")}
              onChange={(event) =>
                update(index, {
                  items: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
            />
            <IconButton
              aria-label={`Remove group ${index + 1}`}
              onClick={() => onChange(groups.filter((_, i) => i !== index))}
            >
              ✕
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Button
        size="small"
        sx={{ mt: 1.5 }}
        onClick={() => onChange([...groups, { label: "", items: [] }])}
      >
        Add group
      </Button>
    </Box>
  );
}
