import { useState } from "react";
import { Box, Chip, Stack, TextField, TextFieldProps } from "@mui/material";
import Iconify from "@/components/iconify";
import SvgColor from "@/components/svg-color";

interface EmailChipInputProps extends Omit<TextFieldProps, "onChange"> {
  emails: string[];
  onChange: (emails: string[]) => void;
}

export default function EmailChipInput({
  emails,
  onChange,
  ...other
}: EmailChipInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue) {
      event.preventDefault();

      if (!validateEmail(inputValue)) {
        setError("Please enter a valid email address");
        return;
      }

      // Check if email already exists in the list
      if (emails.includes(inputValue)) {
        setError("This email has already been added");
        return;
      }

      onChange([...emails, inputValue]);
      setInputValue("");
      setError(null);
    }

    // Remove the last email when backspace is pressed and the input is empty
    if (event.key === "Backspace" && inputValue === "" && emails.length > 0) {
      const newEmails = [...emails];
      newEmails.pop();
      onChange(newEmails);
    }
  };

  const handleDelete = (emailToDelete: string) => {
    onChange(emails.filter((email) => email !== emailToDelete));
  };

  return (
    <TextField
      fullWidth
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={emails.length > 0 ? "" : "Type email and press Enter to add"}
      error={!!error}
      helperText={error}
      InputProps={{
        startAdornment: (
          //   <Box
          //     sx={{
          //       display: "flex",
          //       flexDirection: "row",
          //       flexWrap: "wrap",
          //       gap: 0.5,
          //       mr: 1,
          //       maxWidth: "100%",
          //     }}
          //   >
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              mr: 0,
              //   width: emails.length > 0 ? "calc(100% - 20px)" : "auto",
              //   overflow: "auto",
              //   flexWrap: "nowrap",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {emails.map((email) => (
              <Chip
                key={email}
                label={email}
                size="medium"
                variant="outlined"
                onDelete={() => handleDelete(email)}
                deleteIcon={<SvgColor src="/assets/icons/close.svg" />}
                sx={{
                  //   backgroundColor: "#262626",
                  height: 40,
                  backgroundColor: "common.white",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "common.surface",
                }}
              />
            ))}
          </Stack>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#F2F2F2",
          borderRadius: "100px",
          boxSizing: "border-box",
          padding: "0 8px",
          "& fieldset": {
            borderColor: "common.mainBorder",
            borderWidth: "1px",
          },
          "&:hover": {
            "& fieldset": {
              borderColor: "primary.main",
            },
          },
          "&.Mui-focused": {
            backgroundColor: "common.white",
            "& fieldset": {
              borderColor: "primary.main",
            },
          },
          "&.Mui-error": {
            backgroundColor: "red.surface2",
            "& fieldset": {
              borderColor: "red.border",
            },
            "& .MuiInputBase-input": {
              color: "red.surface",
            },
          },
        },
        "& .MuiInputBase-input": {
          padding: 2,
          fontSize: "16px",
          fontWeight: 400,
          color: "#333333",
          "&::placeholder": {
            color: "#333333",
            opacity: 0.5,
          },
        },
      }}
      {...other}
    />
  );
}
