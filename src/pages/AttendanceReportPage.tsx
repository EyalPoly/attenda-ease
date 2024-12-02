import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Calendar from "../components/Calendar";
import dayjs, { Dayjs } from "dayjs";

function AttendanceReportPage() {
  const month: Dayjs = dayjs();
  return (
    <div>
      <Header />
      <PageHeader
        title="דו״ח נוכחות חודשי"
        subTitle=".יש למלא את הנוכחות החודשית שלך, ובסוף החודש להגיש את הדו״ח"
        icon={<EventAvailableIcon fontSize="large" />}
      />
      <Calendar month={month} />
    </div>
  );
}

export default AttendanceReportPage;
