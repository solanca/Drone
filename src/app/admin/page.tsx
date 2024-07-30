"use client";

import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  Link,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import Drones from "./components/Drones";
import Attributes from "./components/Attributes";
import Policies from "./components/Policies";

const AdminPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  console.log(selectedTab);

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return <Attributes />;
      case 1:
        return <Drones />;
      case 2:
        return <Policies />;
      default:
        return <Attributes />;
    }
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  return (
    <Box display="flex" p={5}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          marginRight: "50px",
          marginTop: "10px",
        }}
      >
        <Tabs
          value={selectedTab}
          orientation="vertical"
          onChange={handleTabChange}
          aria-label="Admin Panel Tabs"
          centered
        >
          <Tab label="Attributes" />
          <Tab label="Drones" />
          <Tab label="Policies" />
        </Tabs>
      </Box>
      <Container className="relative" maxWidth="lg">
        {/* <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Admin Panel</Typography>
          </Toolbar>
        </AppBar> */}
        <div className="absolute right-0 top-10">
          <Link href="/">Frontend →</Link>
        </div>
        <Box mt={2}>{renderContent()}</Box>
      </Container>
    </Box>
  );
};

export default AdminPage;
