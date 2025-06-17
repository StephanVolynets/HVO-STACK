import { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import Iconify from "@/components/iconify";
import { useInboxFilters } from "@/sections/admin/inbox/hooks/use-inbox-filters";

export default function SearchInput() {
  const { searchTerm, setSearchTerm } = useInboxFilters();
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
            // color: "#929292", // Input text color
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#929292", // Placeholder text color
            // opacity: 1,
          },
        },
      }}
      InputProps={{
        sx: {
          height: 40,
          backgroundColor: "#F2F2F2",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E6E6E6", // Change the border color
          },
        },
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="ion:search" color="#929292" />
          </InputAdornment>
        ),
        endAdornment: inputValue && (
          <InputAdornment position="end">
            <Iconify icon="mdi:close-circle" color="#929292" style={{ cursor: "pointer" }} onClick={handleClear} />
          </InputAdornment>
        ),
      }}
    />
  );
}
