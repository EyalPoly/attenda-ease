import { useAuth } from "../contexts/authContext/AuthProvider";
import UpdatePasswordForm from "./auth/UpdatePasswordForm";
import { styled } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const StyledHeadline = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "right",
  direction: "rtl",
  marginBottom: "5px",
}));

const StyledContent = styled(Typography)(({ theme }) => ({
  color: "black",
  fontSize: "18px",
  fontWeight: "normal",
  textAlign: "right",
  direction: "rtl",
  marginBottom: "20px",
}));

function Profile() {
  const { currentUser } = useAuth();
  const [updateButton, setUpdateButton] = useState(true);
  const [updatePasswordForm, setUpdatePasswordForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isGoogleUser = currentUser?.providerData?.some(
    (provider) => provider.providerId === "google.com"
  );

  return (
    <>
      <main className="w-full h-auto flex justify-center items-start mt-5">
        <div className="w-full max-w-screen-md text-gray-600 space-y-5 p-8 shadow-xl border rounded-xl">
          <Box sx={{ padding: "20px", textAlign: "center", direction: "rtl" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <StyledHeadline variant="body1">שם משתמש:</StyledHeadline>
              <StyledContent variant="body1">
                {currentUser ? currentUser.displayName : "לא זמין"}
              </StyledContent>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <StyledHeadline variant="body1">דואר אלקטרוני:</StyledHeadline>
              <StyledContent variant="body1">
                {currentUser ? currentUser.email : "לא זמין"}
              </StyledContent>
            </Box>

            {!isGoogleUser && updateButton && (
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: "20px" }}
                onClick={() => {
                  setUpdateButton(false);
                  setUpdatePasswordForm(true);
                }}
              >
                שינוי סיסמה
              </Button>
            )}

            {updatePasswordForm && (
              <UpdatePasswordForm
                onClose={() => {
                  setUpdateButton(true);
                  setUpdatePasswordForm(false);
                }}
                onSuccess={(message) => {
                  setSuccessMessage(message);
                  setUpdateButton(true);
                  setUpdatePasswordForm(false);
                }}
              />
            )}

            {successMessage && (
              <div className="text-green-600 font-bold text-center mt-4">
                {successMessage}
              </div>
            )}
          </Box>
        </div>
      </main>
    </>
  );
}

export default Profile;
