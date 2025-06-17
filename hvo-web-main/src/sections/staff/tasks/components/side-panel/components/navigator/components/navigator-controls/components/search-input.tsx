import { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import Iconify from "@/components/iconify";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";

export default function SearchInput() {
  const { searchTerm, setSearchTerm } = useStaffContext();
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      setSearchTerm(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSearchTerm("");
  };

  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      placeholder="Search..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& .MuiOutlinedInput-input": {
            fontSize: "18px",
            fontWeight: 400,
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#929292",
            fontSize: "18px",
            fontWeight: 400,
          },
        },
      }}
      InputProps={{
        sx: {
          height: 56,
          backgroundColor: "#F2F2F2",
          borderRadius: 100,
          "&:hover": {
            backgroundColor: "common.white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "common.mainBorder",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "common.mainBorder",
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "common.black",
            },
          },
        },
        startAdornment: (
          <InputAdornment position="start" sx={{ paddingLeft: 1 }}>
            <Iconify icon="ion:search" color="#929292" />
          </InputAdornment>
        ),
        endAdornment: inputValue && (
          <InputAdornment position="end">
            <Iconify
              icon="mdi:close-circle"
              color="#929292"
              style={{ cursor: "pointer" }}
              onClick={handleClear}
            />
          </InputAdornment>
        ),
      }}
    />
  );
}
