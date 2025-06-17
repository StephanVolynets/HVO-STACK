import { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import Iconify from "@/components/iconify";
import { useStaffContext } from "../../../contexts/staff-context";

export default function SearchInput() {
  const { search, setSearch } = useStaffContext();
  const [inputValue, setInputValue] = useState(search);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      setSearch(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSearch("");
  };

  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      placeholder="Search Videos..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      sx={{
        width: "256px",
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
          height: 48,

          backgroundColor: "common.white",
          borderRadius: 100,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E6E6E6", // Change the border color
            // borderRadius: 100,
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
