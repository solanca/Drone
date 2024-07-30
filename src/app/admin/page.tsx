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
} from "@mui/material";
import Drones from "./components/Drones";
import Attributes from "./components/Attributes";
import Policies from "./components/Policies";

const AdminPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>("dashboard");

  console.log(selectedKey);

  const renderContent = () => {
    switch (selectedKey) {
      case "drones":
        return <Drones />;
      case "attributes":
        return <Attributes />;
      case "policies":
        return <Policies />;
      default:
        return <Attributes />;
    }
  };

  return (
    <Box display="flex">
      <Drawer variant="permanent">
        <List className="p-4">
          {["Attributes", "Drones", "Policies"].map((text, index) => (
            <ListItem
              button
              key={text}
              onClick={() =>
                setSelectedKey(text.toLowerCase().replace(" ", ""))
              }
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Container className="pl-60 px-32 relative" maxWidth="lg">
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
