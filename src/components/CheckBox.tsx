import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

interface CheckBoxProps {
  name: string;
  register: any;
  label: string;
  required?: boolean;
}

function CheckBox({ name, register, label, required }: CheckBoxProps) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          {...register(name, {
            required: required ? `${label} הוא חובה` : false,
          })}
        />
      }
      label={label}
      sx={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    />
  );
}

export default CheckBox;
