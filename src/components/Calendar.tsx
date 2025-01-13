import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Dayjs } from "dayjs";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import AttendanceDayForm from "./AttendanceDayForm";
import Popup from "./Popup";
import axios from "axios";

const PaperStyled = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

interface CalendarProps {
  initialDate: Dayjs;
}

function Calendar({ initialDate }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [attendanceForms, setAttendanceForms] = useState<{
    [key: number]: any;
  }>({});
  const [selectedAttendanceData, setSelectedAttendanceData] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [mounted, setMounted] = useState(false);

  const startOfMonth = initialDate.startOf("month");
  const endOfMonth = initialDate.endOf("month");

  useEffect(() => {
    const fetchDataForMonth = async () => {
      const monthKey = initialDate.format("YYYY-MM");
      try {
        const response = await axios.get(`/api/v1/attendance/${monthKey}`);
        setAttendanceForms(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    // fetchDataForMonth();
    setSelectedDate(initialDate);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const day = selectedDate.date();
      setSelectedAttendanceData(attendanceForms[day] || null);
    }
  }, [selectedDate, attendanceForms]);

  function handleDateChange(newDate: Dayjs) {
    setSelectedDate(newDate);
    setOpenPopup(true);
  }

  function handleFormSubmit(day: number | undefined, data: any) {
    if (day !== undefined) {
      setAttendanceForms((prev) => ({
        ...prev,
        [day]: data,
      }));
      // console.log("Updated Attendance Forms:", attendanceForms);
    } else {
      console.error("Day is undefined, cannot update attendance forms.");
    }
    setOpenPopup(false);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          defaultValue={initialDate}
          value={selectedDate}
          onChange={handleDateChange}
          minDate={startOfMonth}
          maxDate={endOfMonth}
          views={["day"]}
        />
      </LocalizationProvider>
      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        title={
          selectedDate
            ? `${selectedDate.format("DD/MM/YYYY")} - פרטי נוכחות`
            : "פרטי נוכחות"
        }
      >
        <PaperStyled>
          <AttendanceDayForm
            attendanceData={selectedAttendanceData}
            onSubmit={(data) => handleFormSubmit(selectedDate?.date(), data)}
          />
        </PaperStyled>
      </Popup>
    </>
  );
}

export default Calendar;
