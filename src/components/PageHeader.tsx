import { Card, Paper, Typography } from "@mui/material";
import React from "react";
import "../styles/PageHeader.css";
import { styled } from "@mui/material/styles";

interface Props {
  title: string;
  subTitle: string;
  icon: React.ReactNode;
}

const PageHeaderStyled = styled("div")(({ theme }) => ({
  backgroundColor: "#f4f4f4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  textAlign: "center",
}));

const CardStyled = styled(Card)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  color: "#3c44b1",
  borderRadius: "12px",
  marginBottom: theme.spacing(3),
}));

const PageTitleWrapper = styled("div")(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  marginTop: theme.spacing(4),
}));

const PageTitleStyled = styled(Typography)(({ theme }) => ({
  fontFamily: "Cantata One",
  fontWeight: 600,
  fontSize: "48px",
  marginTop: theme.spacing(2),
}));

const PageSubtitleStyled = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  color: "#222",
  opacity: 0.7,
}));

function PageHeader(props: Props) {
  return (
    <Paper elevation={0} square>
      <PageHeaderStyled>
        <CardStyled>{props.icon}</CardStyled>
        <PageTitleWrapper>
          <PageTitleStyled variant="h6">{props.title}</PageTitleStyled>
          <PageSubtitleStyled variant="subtitle2">
            {props.subTitle}
          </PageSubtitleStyled>
        </PageTitleWrapper>
      </PageHeaderStyled>
    </Paper>
  );
}

export default PageHeader;
