"use client";

import React, { useEffect } from "react";
import {
  Container,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  AccessRequest,
  AccessResponse,
  fetchAttributesByName,
  fetchDronesByZone,
  sendAccessRequest,
} from "./api";

interface Drone {
  ID: number;
  model_type: string;
  zone: number;
  level: number;
}

export default function Home() {
  const [layer, setLayer] = React.useState("");
  const [zone, setZone] = React.useState("");
  const [drones, setDrones] = React.useState<Drone[]>([]);
  const [smallDrone, setSmallDrone] = React.useState<Drone | null>(null);
  const [terminalDrone, setTerminalDrone] = React.useState<Drone | null>(null);
  const [target, setTarget] = React.useState("");

  const [zones, setZones] = React.useState<string[]>([]);
  const [targets, setTargets] = React.useState<string[]>([]);

  const [accessResponse, setAccessResponse] =
    React.useState<AccessResponse | null>(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const zonesData = await fetchAttributesByName("Zone");
        const zonesValues = zonesData.reduce(
          (acc: string[], attr: { value: string[] }) => acc.concat(attr.value),
          []
        );
        const targetsData = await fetchAttributesByName("Area");
        const targetsValues = targetsData.reduce(
          (acc: string[], attr: { value: string[] }) => acc.concat(attr.value),
          []
        );
        setZones(zonesValues);
        setTargets(targetsValues);
      } catch (error) {
        console.error("Error fetching zones:", error);
      }
    };
    fetchZones();
  }, []);

  const handleLayerChange = (event: SelectChangeEvent<string>) => {
    setLayer(event.target.value as string);
  };

  const handleZoneChange = async (event: SelectChangeEvent<string>) => {
    const selectedZone = event.target.value as string;
    setZone(event.target.value as string);

    try {
      const drones = await fetchDronesByZone(Number(selectedZone));
      setDrones(drones);

      const firstSmallDrone =
        drones.find((drone: Drone) => drone.model_type === "Small") || null;
      const firstTerminalDrone =
        drones.find((drone: Drone) => drone.model_type === "Terminal") || null;

      setSmallDrone(firstSmallDrone);
      setTerminalDrone(firstTerminalDrone);
    } catch (error) {
      console.error("Error fetching drones:", error);
    }
  };

  const handleTargetChange = (event: SelectChangeEvent<string>) => {
    setTarget(event.target.value as string);
  };

  const handleSmallDroneChange = (event: SelectChangeEvent<any>) => {
    setSmallDrone(drones[event.target.value as number]);
  };

  const handleSendRequest = async () => {
    if (!smallDrone) {
      console.error("No small drone selected");
      return;
    }

    const request: AccessRequest = {
      drone_id: smallDrone.ID.toString(),
      request_target: target,
    };

    try {
      const response = await sendAccessRequest(request);
      setAccessResponse(response);
    } catch (error) {
      console.error("Error sending access request:", error);
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="space-between"
        justifyContent="start-end"
        minHeight="100vh"
        p={5}
        maxWidth={"lg"}
      >
        <Box
          mb={8}
          display="flex"
          flexDirection="row"
          // justifyContent={"space-between"}
        >
          <FormControl
            variant="outlined"
            className="w-full max-w-28 relative mr-40"
          >
            <InputLabel id="layer-label">Layer</InputLabel>
            <Select
              labelId="layer-label"
              value={layer}
              onChange={handleLayerChange}
              label="Layer"
            >
              <MenuItem value="Layer 0">Layer 0</MenuItem>
              <MenuItem value="Layer 1">Layer 1</MenuItem>
              <MenuItem value="Layer 2">Layer 2</MenuItem>
              <MenuItem value="Layer 3">Layer 3</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" className="w-full max-w-28">
            <InputLabel id="zone-label">Zone</InputLabel>
            <Select
              labelId="zone-label"
              value={zone}
              onChange={handleZoneChange}
              label="Zone"
            >
              {zones.map((zone) => (
                <MenuItem value={zone}>Zone {zone}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" justifyContent="space-between" maxWidth={"lg"}>
          <Box mr={3}>
            <FormControl variant="outlined" className="min-w-52 mb-10">
              <InputLabel id="drone-label">Select Small Drone</InputLabel>
              <Select
                labelId="drone-label"
                value={smallDrone}
                onChange={handleSmallDroneChange}
                label="Select Small Drone"
              >
                {drones.map((drone: Drone, index) =>
                  drone.model_type === "Small" ? (
                    <MenuItem value={index}>{drone.ID}</MenuItem>
                  ) : null
                )}
              </Select>
            </FormControl>
            <Typography variant="h5" align="center" mb={2}>
              Small Drone
            </Typography>
            <Paper
              variant="outlined"
              className="w-[400px] h-[500px] p-8 flex flex-col"
            >
              <Typography variant="h6">Attributes</Typography>
              {smallDrone ? (
                <>
                  <Typography>ID: {smallDrone.ID}</Typography>
                  <Typography>Type: {smallDrone.model_type}</Typography>
                  <Typography>Zone: {smallDrone.zone}</Typography>
                  <Typography className="mb-10">
                    Level: {smallDrone.level}
                  </Typography>
                  <FormControl variant="outlined" className="max-w-52 mb-5">
                    <InputLabel id="target-label">Select target</InputLabel>
                    <Select
                      labelId="target-label"
                      value={target}
                      onChange={handleTargetChange}
                      label="Select Target"
                    >
                      {targets.map((target) => (
                        <MenuItem value={target}>Area {target}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography mt={2} mb={2}>
                    Access Request to the Area{" "}
                    <span className="font-bold">{target}</span>
                  </Typography>
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSendRequest}
                    >
                      Send Request
                    </Button>
                  </div>
                </>
              ) : (
                <Typography>No small drone selected</Typography>
              )}
            </Paper>
          </Box>
          <Box>
            <FormControl variant="outlined" className="min-w-52 mb-10">
              <InputLabel id="drone-label">Select Terminal Drone</InputLabel>
              <Select
                labelId="drone-label"
                value={drones[0]}
                // onChange={handleDroneChange}
                label="Select Terminal Drone"
              >
                {drones.map((drone: Drone) =>
                  drone.model_type === "Terminal" ? (
                    <MenuItem value={drone.ID}>{drone.ID}</MenuItem>
                  ) : null
                )}
              </Select>
            </FormControl>
            <Typography variant="h5" align="center" mb={2}>
              Terminal Drone
            </Typography>
            <Paper
              variant="outlined"
              className="w-[400px] h-[500px] p-8 flex flex-col"
            >
              <Typography variant="h6">Attributes</Typography>
              {terminalDrone ? (
                <>
                  <Typography>ID: {terminalDrone.ID}</Typography>
                  <Typography>Type: {terminalDrone.model_type}</Typography>
                  <Typography>Zone: {terminalDrone.zone}</Typography>
                </>
              ) : (
                <Typography>No small drone selected</Typography>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
