import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { Dayjs } from "dayjs";
import AttendanceDayForm from "./AttendanceDayForm";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    startHour: "",
    endHour: "",
    frontalHours: "",
    individualHours: "",
    stayingHours: "",
    workplace: "",
  });

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    setOpenPopup(true); // Open the popup when a date is selected
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAttendanceData({
      ...attendanceData,
      [name]: value,
    });
  };

  const handleSave = () => {
    console.log("Attendance data for", selectedDate, attendanceData);
    setOpenPopup(false); // Close the popup after saving
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar value={selectedDate} onChange={handleDateChange} />
      </LocalizationProvider>
    </>
  );
}

export default Calendar;
