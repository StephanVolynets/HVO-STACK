import { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import Iconify from "@/components/iconify";
import { useLibraryFilters } from "../../../hooks/use-library-filters";
import SvgColor from "@/components/svg-color";

export default function SearchInput() {
  const { searchTerm, setSearchTerm } = useLibraryFilters();
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
      size="medium"
      placeholder="Search videos..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      sx={{
        width: "256px",
        borderRadius: 100,
        height: 48,
        "& .MuiOutlinedInput-root": {
          borderRadius: 100,
          height: 48,
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SvgColor src="/assets/icons/search.svg" />
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
