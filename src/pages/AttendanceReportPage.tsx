import React from "react";
import Header from "../components/Header";
import AttendanceDayForm from "../components/AttendanceDayForm";
import PageHeader from "../components/PageHeader";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Calendar from "../components/Calendar";

const PaperStyled = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(5),
  padding: theme.spacing(3),
}));

function AttendanceReportPage() {
  return (
    <div>
      <Header />
      <PageHeader
        title="Attendance Report"
        subTitle="Fill in your monthly attendance. At the end of the month, submit the report."
        icon={<EventAvailableIcon fontSize="large" />}
      />
      <Calendar />
      <PaperStyled>
        <AttendanceDayForm />
      </PaperStyled>
    </div>
  );
}

export default AttendanceReportPage;
