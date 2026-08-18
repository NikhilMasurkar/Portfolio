import React, { useRef, useState } from "react";
import { Box, Button, LinearProgress, Link, Stack, Typography } from "@mui/material";
import { uploadFile } from "../../admin/uploadFile.js";

/**
 * Pick a file, upload it to S3, hand back the public URL.
 *
 * Images are resized in the browser first — see uploadFile.js. The current
 * value is shown as a link rather than only a preview, so it is obvious
 * whether a field holds a local path from the original build or an uploaded
 * S3 object.
 */
export default function FileField({
  label,
  kind,
  value,
  onChange,
  accept = "image/*",
  helperText,
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError(null);
    try {
      onChange(await uploadFile(file, kind));
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
      // Clear the input so re-picking the same file fires change again.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <Button
          variant="outlined"
          size="small"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : value ? "Replace" : "Upload"}
        </Button>

        {value && (
          <Link
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            sx={{ wordBreak: "break-all" }}
          >
            {value.replace(/^https?:\/\/[^/]+\//, "")}
          </Link>
        )}
      </Stack>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        hidden
      />

      {busy && <LinearProgress sx={{ mt: 1.5 }} />}

      {(error || helperText) && (
        <Typography
          variant="caption"
          color={error ? "error" : "text.secondary"}
          sx={{ display: "block", mt: 1 }}
        >
          {error || helperText}
        </Typography>
      )}
    </Box>
  );
}
