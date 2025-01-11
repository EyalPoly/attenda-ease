import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Profile from "../components/Profile";

function ProfilePage() {
  return (
    <div>
      <Header />
      <PageHeader
        title="פרופיל"
        subTitle="הגדרות ומידע אישי"
        icon={<AccountBoxIcon fontSize="large" />}
      />
      <Profile />
    </div>
  );
}

export default ProfilePage;
