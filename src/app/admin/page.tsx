"use client";

import React, { useEffect, useState } from "react";
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
import { useLayer } from "../context/LayerContext";

const AdminPage: React.FC = () => {
  const { layer, setLayer } = useLayer();
  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    const storedLayer = localStorage.getItem("layer");
    if (storedLayer) {
      setLayer(storedLayer);
    }
  }, [setLayer]);

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
        <div className="absolute right-0 top-10 text-right">
          <Link href="/">Frontend →</Link>
        </div>
        <Box mt={2}>{renderContent()}</Box>
      </Container>
    </Box>
  );
};

export default AdminPage;
function setLayer(storedLayer: string) {
  throw new Error("Function not implemented.");
}
