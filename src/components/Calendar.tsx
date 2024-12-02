import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Dayjs } from "dayjs";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import AttendanceDayForm from "./AttendanceDayForm";
import axios from "axios";


const PaperStyled = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(5),
  padding: theme.spacing(3),
}));

interface CalendarProps {
  month: Dayjs;
}

function Calendar({ month }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [attendanceForms, setAttendanceForms] = useState<{ [key: number]: any }>({});
  const [selectedAttendanceData, setSelectedAttendanceData] = useState(null);

  // useEffect(() => {
  //   const fetchDataForMonth = async () => {
  //     const monthKey = month.format("YYYY-MM");
  //     try {
  //       const response = await axios.get(`/api/attendance/${monthKey}`);
  //       setAttendanceForms(response.data);
  //     } catch (error) {
  //       console.error("Error fetching attendance data:", error);
  //     }
  //   };

  //   fetchDataForMonth();
  // }, [month]);

  useEffect(() => {
    if (selectedDate) {
      const day = selectedDate.date();
      setSelectedAttendanceData(attendanceForms[day] || null);
    }
  }, [selectedDate, attendanceForms]);

  function handleDateChange(newDate: Dayjs) {
    setSelectedDate(newDate);
  }

  function handleFormSubmit(day: number | undefined, data: any) {
    if (day !== undefined) {
      setAttendanceForms((prev) => ({
        ...prev,
        [day]: data,
      }));
      console.log("Updated Attendance Forms:", attendanceForms);
    } else {
      console.error("Day is undefined, cannot update attendance forms.");
    }
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar value={selectedDate} onChange={handleDateChange} />
      </LocalizationProvider>
      <PaperStyled>
        <AttendanceDayForm attendanceData={selectedAttendanceData}
        onSubmit={(data) => handleFormSubmit(selectedDate?.date(), data)} />
      </PaperStyled>
    </>
  );
}

export default Calendar;
