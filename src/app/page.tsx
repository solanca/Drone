"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useLayer } from "./context/LayerContext";
import { AccessRequest, AccessResponse } from "./api";
import { Drone } from "./admin/types";
import LoadingButton from "@mui/lab/LoadingButton";
import Loading from "./components/Loading";
import { useApi } from "./api";

export default function Home() {
  const { layer, setLayer } = useLayer();
  const [zone, setZone] = useState<number>(NaN);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [terminalDrone, setTerminalDrone] = useState<Drone | null>(null);
  const [edgeDrone, setEdgeDrone] = useState<Drone | null>(null);
  const [zones, setZones] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [accessResponse, setAccessResponse] = useState<AccessResponse | null>(
    null
  );

  const { fetchAttributesByName, fetchDronesByZone, sendAccessRequest } =
    useApi();
  useEffect(() => {
    const storedLayer = localStorage.getItem("layer");
    if (storedLayer) {
      setLayer(storedLayer);
    }
  }, [setLayer]);

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

      const firstTerminalDrone =
        drones.find((drone: Drone) => drone.model_type === "Terminal") || null;
      const firstEdgeDrone =
        drones.find((drone: Drone) => drone.model_type === "Edge") || null;

      setTerminalDrone(firstTerminalDrone);
      setEdgeDrone(firstEdgeDrone);
    } catch (error) {
      console.error("Error fetching drones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminalDroneChange = (event: SelectChangeEvent<any>) => {
    setTerminalDrone(
      drones.find((drone: Drone) => drone.ID === event.target.value) || null
    );
  };

  const handleEdgeDroneChange = (event: SelectChangeEvent<any>) => {
    setEdgeDrone(
      drones.find((drone: Drone) => drone.ID === event.target.value) || null
    );
  };

  const handleSendRequest = async () => {
    if (!terminalDrone) {
      console.error("No terminal drone selected");
      return;
    }

    const request: AccessRequest = {
      entity_id:
        terminalDrone.ID !== undefined ? terminalDrone.ID.toString() : "",
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
        <Box mb={8} display="flex" flexDirection="row" alignItems={"center"}>
          <FormControl
            variant="outlined"
            className="w-full max-w-28 relative !mr-40"
          >
            <InputLabel id="layer-label">Level</InputLabel>
            <Select
              labelId="layer-label"
              value={layer}
              onChange={handleLayerChange}
              label="Level"
            >
              <MenuItem value={0}>Level 0</MenuItem>
              <MenuItem value={1}>Level 1</MenuItem>
              <MenuItem value={2}>Level 2</MenuItem>
              <MenuItem value={3}>Level 3</MenuItem>
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
            <FormControl variant="outlined" className="!min-w-52 !mb-10">
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
                <Typography>No terminal drone selected</Typography>
              )}
            </Paper>
          </Box>
          <div className="my-auto mx-auto flex flex-col items-center">
            <div>
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
            <FormControl variant="outlined" className="!min-w-52 !mb-10">
              <InputLabel id="drone-label">Select Edge Drone</InputLabel>
              <Select
                labelId="drone-label"
                value={edgeDrone?.ID}
                onChange={handleEdgeDroneChange}
                label="Select Edge Drone"
              >
                {drones.map((drone: Drone, index) =>
                  drone.model_type === "Edge" ? (
                    <MenuItem value={drone.ID} key={index}>
                      {drone.ID}
                    </MenuItem>
                  ) : null
                )}
              </Select>
            </FormControl>
            <Typography variant="h5" align="center" mb={2}>
              Edge Drone
            </Typography>
            <Paper
              variant="outlined"
              className="w-[400px] h-[500px] p-8 flex flex-col"
            >
              <Typography variant="h6">Attributes</Typography>
              {edgeDrone ? (
                <>
                  <Typography>ID: {edgeDrone.ID}</Typography>
                  <Typography>Type: {edgeDrone.model_type}</Typography>
                  <Typography>Zone: {edgeDrone.zone}</Typography>
                </>
              ) : (
                <Typography>No Edge drone selected</Typography>
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
