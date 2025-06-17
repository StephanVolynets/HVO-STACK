"use client";
import SvgColor from "@/components/svg-color";
import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import { usePathname } from "next/navigation";
import React, { FC } from "react";

interface ISearchProps {}

const Search: FC<ISearchProps> = ({}: ISearchProps) => {
  const pathname = usePathname();

  if (pathname.includes("/companies")) {
    return <></>;
  }

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search by Job, Company, Specialty, Location..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SvgColor src="/assets/icons/search.svg" sx={{ width: 24, height: 24 }} />
          </InputAdornment>
        ),
      }}
      sx={{ backgorundColor: "pink", borderRadius: "50%" }}
    />
  );
};

export default Search;
