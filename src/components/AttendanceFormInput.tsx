import {
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";

interface AttendanceInputProps {
  name: string;
  label: string;
  register: any;
  required?: boolean;
  pattern?: { value: RegExp; message: string };
  error?: { message?: string };
  type?: string;
  multiline?: boolean;
  rows?: number;
}

const theme = createTheme({ direction: "rtl" });

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function AttendanceFormInput({
  name,
  label,
  register,
  required,
  pattern,
  error,
  type = "text",
  multiline = false,
  rows = 1,
}: AttendanceInputProps) {
  return (
    <>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <div dir="rtl">
            <TextField
              {...register(name, {
                required: required ? `שדה ${label} הוא חובה` : false,
                pattern: pattern,
              })}
              label={label}
              variant="outlined"
              type={type}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              multiline={multiline}
              rows={rows}
            />
            {error && (
              <Typography sx={{ color: "red", mt: 1 }}>
                {error.message}
              </Typography>
            )}
          </div>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}

export default AttendanceFormInput;
