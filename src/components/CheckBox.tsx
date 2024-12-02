import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

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
