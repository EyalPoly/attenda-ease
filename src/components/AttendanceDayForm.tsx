import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, FormControl } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import AttendanceFormInput from "./AttendanceFormInput";
import CheckBox from "./CheckBox";

const FormStyled = styled(FormControl)(({ theme }) => ({
  "& .MuiFormControl-root": {
    width: "80%",
    margin: theme.spacing(1),
  },
}));

interface AttendanceDayData {
  workplace: string;
  isAbsence: boolean;
  startHour: string;
  endHour: string;
  frontalHours: number;
  individualHours: number;
  stayingHours: number;
  comments: string;
}

function AttendanceDayForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AttendanceDayData>();

  const isAbsence = watch("isAbsence");

  const onSubmit: SubmitHandler<AttendanceDayData> = (data) => {
    console.log("Attendance Data Submitted: ", data);
    // Handle saving data (e.g., send to backend)
  };

  return (
    <FormStyled>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container>
          <Grid size={{ xs: 6, md: 8 }}>
            <CheckBox
              name="isAbsence"
              label="חיסור"
              register={register}
              required={false}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 8 }}>
            <AttendanceFormInput
              name="workplace"
              label="מקום עבודה"
              register={register}
              required={true}
              pattern={{
                value: /^[\u0590-\u05FF\s]+$/,
                message: "שדה מקום העבודה יכול להכיל רק טקסט בעברית",
              }}
              error={errors.workplace}
            />
            {/* Conditionally render hours components based on isAbsence */}
            {!isAbsence && (
              <>
                <AttendanceFormInput
                  name="startHour"
                  label="שעת התחלה"
                  register={register}
                  required={true}
                  pattern={{
                    value: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                    message: "HH:MM שדה שעת התחלה צריך להיות בפורמט",
                  }}
                  error={errors.startHour}
                  type="time"
                />
                <AttendanceFormInput
                  name="endHour"
                  label="שעת סיום"
                  register={register}
                  required={true}
                  pattern={{
                    value: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                    message: "HH:MM שדה שעת סיום צריך להיות בפורמט",
                  }}
                  error={errors.endHour}
                  type="time"
                />
                <AttendanceFormInput
                  name="frontalHours"
                  label="שעות פרונטליות"
                  register={register}
                  required={true}
                  pattern={{
                    value: /^[0-9]*$/,
                    message: "שדה שעות פרונטליות צריך להיות מספר",
                  }}
                  error={errors.frontalHours}
                  type="number"
                />
                <AttendanceFormInput
                  name="individualHours"
                  label="שעות פרטניות"
                  register={register}
                  required={true}
                  pattern={{
                    value: /^[0-9]*$/,
                    message: "שדה שעות פרטניות צריך להיות מספר",
                  }}
                  error={errors.individualHours}
                  type="number"
                />
                <AttendanceFormInput
                  name="stayingHours"
                  label="שעות שהייה"
                  register={register}
                  required={true}
                  pattern={{
                    value: /^[0-9]*$/,
                    message: "שדה שעות שהייה צריך להיות מספר",
                  }}
                  error={errors.stayingHours}
                  type="number"
                />
              </>
            )}
            <AttendanceFormInput
              name="comments"
              label="הערות"
              register={register}
              required={false}
              multiline
              rows={5}
              error={errors.comments}
            />
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={1}
            >
              <Button type="submit" variant="contained" color="primary">
                שמור
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </FormStyled>
  );
}

export default AttendanceDayForm;
