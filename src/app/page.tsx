"use client";

import React, { useEffect, useState } from "react";
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
  Link,
  IconButton,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  AccessRequest,
  AccessResponse,
  fetchAttributesByName,
  fetchDronesByZone,
  sendAccessRequest,
} from "./api";
import { Drone } from "./admin/types";
import Loading from "./components/Loading";
import LoadingButton from "@mui/lab/LoadingButton";

export default function Home() {
  const [layer, setLayer] = useState("1");
  const [zone, setZone] = React.useState<number>(NaN);
  const [drones, setDrones] = React.useState<Drone[]>([]);
  const [smallDrone, setSmallDrone] = React.useState<Drone | null>(null);
  const [terminalDrone, setTerminalDrone] = React.useState<Drone | null>(null);
  const [zones, setZones] = React.useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sendLoading, setSendLoading] = useState<boolean>(false);

  const [accessResponse, setAccessResponse] =
    React.useState<AccessResponse | null>(null);

  useEffect(() => {
    const storedLayer = localStorage.getItem("layer");
    if (storedLayer) {
      setLayer(storedLayer);
    }
  }, [layer]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        const zonesData = await fetchAttributesByName("Zone");
        const zonesValues = zonesData.reduce(
          (acc: string[], attr: { value: string[] }) => acc.concat(attr.value),
          []
        );
        setZones(zonesValues);
      } catch (error) {
        console.error("Error fetching zones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, [layer]);

  const handleLayerChange = (event: SelectChangeEvent<string>) => {
    localStorage.setItem("layer", event.target.value);
    setLayer(event.target.value);
  };

  const handleZoneChange = async (event: SelectChangeEvent<string>) => {
    setLoading(true);
    const selectedZone = event.target.value as string;
    setZone(Number(event.target.value));

    try {
      const drones = await fetchDronesByZone(Number(selectedZone));
      setDrones(drones === null ? [] : drones);

      const firstSmallDrone =
        drones.find((drone: Drone) => drone.model_type === "Small") || null;
      const firstTerminalDrone =
        drones.find((drone: Drone) => drone.model_type === "Terminal") || null;

      setSmallDrone(firstSmallDrone);
      setTerminalDrone(firstTerminalDrone);
    } catch (error) {
      console.error("Error fetching drones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSmallDroneChange = (event: SelectChangeEvent<any>) => {
    setSmallDrone(
      drones.find((drone: Drone) => drone.ID === event.target.value) || null
    );
    console.log(smallDrone);
  };

  const handleTerminalDroneChange = (event: SelectChangeEvent<any>) => {
    setTerminalDrone(
      drones.find((drone: Drone) => drone.ID === event.target.value) || null
    );
  };

  const handleSendRequest = async () => {
    if (!smallDrone) {
      console.error("No small drone selected");
      return;
    }

    const request: AccessRequest = {
      entity_id: smallDrone.ID !== undefined ? smallDrone.ID.toString() : "",
      request_target: zone,
    };

    try {
      setSendLoading(true);
      const response = await sendAccessRequest(request);
      setAccessResponse(response);
    } catch (error) {
      console.error("Error sending access request:", error);
    } finally {
      setSendLoading(false);
    }
  };

  // if (loading) {
  //   return <Loading message={message} />;
  // }

  return (
    <Container maxWidth={"lg"} className="relative">
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
          alignItems={"center"}
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
              <MenuItem value={1}>Layer 1</MenuItem>
              <MenuItem value={2}>Layer 2</MenuItem>
              <MenuItem value={3}>Layer 3</MenuItem>
              <MenuItem value={4}>Layer 4</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" className="w-full max-w-28">
            <InputLabel id="zone-label">Zone</InputLabel>
            <Select
              labelId="zone-label"
              type="number"
              value={zone.toString()}
              onChange={handleZoneChange}
              label="Zone"
            >
              {zones.map((zone, index) => (
                <MenuItem value={zone} key={index}>
                  Zone {zone}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="absolute right-0">
            <Link href="/admin">Admin →</Link>
          </div>
        </Box>
        <Box display="flex" justifyContent="space-between" maxWidth={"lg"}>
          <Box>
            <FormControl variant="outlined" className="min-w-52 mb-10">
              <InputLabel id="drone-label">Select Small Drone</InputLabel>
              <Select
                labelId="drone-label"
                value={smallDrone?.ID}
                onChange={handleSmallDroneChange}
                label="Select Small Drone"
              >
                {drones.map((drone: Drone, index) =>
                  drone.model_type === "Small" ? (
                    <MenuItem value={drone.ID} key={index}>
                      {drone.ID}
                    </MenuItem>
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
                </>
              ) : (
                <Typography>No small drone selected</Typography>
              )}
            </Paper>
          </Box>
          <div className="my-auto mx-auto flex flex-col items-center">
            <div>
              {/* <Button
                variant="contained"
                color="primary"
                onClick={handleSendRequest}
              >
                Send Request
              </Button> */}
              <LoadingButton
                loading={sendLoading}
                loadingPosition="end"
                variant="contained"
                sx={{ width: "190px" }}
                onClick={handleSendRequest}
              >
                Send Request
              </LoadingButton>
            </div>
          </div>
          <Box>
            <FormControl variant="outlined" className="min-w-52 mb-10">
              <InputLabel id="drone-label">Select Terminal Drone</InputLabel>
              <Select
                labelId="drone-label"
                value={terminalDrone?.ID}
                onChange={handleTerminalDroneChange}
                label="Select Terminal Drone"
              >
                {drones.map((drone: Drone, index) =>
                  drone.model_type === "Terminal" ? (
                    <MenuItem value={drone.ID} key={index}>
                      {drone.ID}
                    </MenuItem>
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
                <Typography>No Terminal drone selected</Typography>
              )}
              {accessResponse ? (
                <Typography
                  variant="h6"
                  color={accessResponse.granted === true ? "blue" : "red"}
                  mt={4}
                >
                  {accessResponse.granted
                    ? "Access request processed"
                    : "Access request denied"}
                </Typography>
              ) : null}
            </Paper>
          </Box>
        </Box>
      </Box>
      {loading ? <Loading /> : null}
    </Container>
  );
}
