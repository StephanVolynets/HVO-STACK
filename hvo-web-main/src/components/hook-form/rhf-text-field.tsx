import { Controller, useFormContext } from "react-hook-form";

import TextField, { TextFieldProps } from "@mui/material/TextField";
import { InputAdornment, Tooltip } from "@mui/material";
import Iconify from "../iconify";
import SvgColor from "../svg-color";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
// import "src/theme/other/tippy-tooltip.css";

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export default function RHFTextField({ name, helperText, type, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === "number" && field.value === 0 ? "" : field.value}
          onChange={(event) => {
            if (type === "number") {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          sx={
            {
              // backgroundColor: error ? "#FFE5E4!important" : "inherit",
              // backgroundColor: error ? "1px solid blue" : "inherit",
              // border: (theme) => (error ? `1px solid ${theme.palette.error.main}` : "1px solid #E6E6E6"),
            }
          }
          error={!!error}
          // helperText={error ? error?.message : helperText}
          InputProps={{
            // Add the icon with a tooltip for error messages
            endAdornment: error && (
              <InputAdornment position="end">
                {/* <Tooltip title={error.message || ""}> */}
                <Tippy
                  content={error.message || ""}
                  arrow={true}
                  placement="right"
                  offset={[0, 25]}
                  theme="custom"
                  animation="fade"
                >
                  <SvgColor
                    src="/assets/icons/info-new.svg"
                    color="#4D0000"
                    style={{ cursor: "pointer", width: 24, height: 24 }}
                  />
                  {/* </Tooltip> */}
                </Tippy>
              </InputAdornment>
            ),
          }}
          {...other}
        />
      )}
    />
  );
}
