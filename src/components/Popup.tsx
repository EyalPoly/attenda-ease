import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const DialogStyled = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogTitle-root": {
    textAlign: "center",
  },
  "& .MuiTypography-h6": {
    fontFamily: "'Roboto', sans-serif",
    flexGrow: 1,
  },
  "& .titleContainer": {
    display: "flex",
  },
  "& .closeButton": {
    border: "none",
    background: "none",
    padding: "8px",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: theme.palette.grey[900],
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.grey[900],
    },
    "&:focus": {
      outline: "none",
      backgroundColor: theme.palette.grey[200],
    },
  },
}));

export default function Popup(props: {
  title: any;
  children: any;
  openPopup: boolean;
  setOpenPopup: (open: boolean) => void;
}) {
  const { title, children, openPopup, setOpenPopup } = props;

  function handleClose() {
    const target = document.activeElement as HTMLElement;
    target.blur();
    setOpenPopup(false);
  }

  return (
    <DialogStyled open={openPopup} aria-labelledby="popup-title">
      <DialogTitle id="popup-title">
        <div className="titleContainer">
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <button
            className="closeButton"
            onClick={handleClose}
            aria-label="Close"
          >
            X
          </button>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </DialogStyled>
  );
}
