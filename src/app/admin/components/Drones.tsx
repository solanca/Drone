import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { Drone } from "../types";
import Loading from "@/app/components/Loading";
import { LoadingButton } from "@mui/lab";
import { useApi } from "../../api";

const Drones: React.FC = () => {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState("");
  const [zone, setZone] = useState(NaN);
  const [currentDroneId, setCurrentDroneId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Fetching drones...");
  const [sendLoading, setSendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { CreateDrone, DeleteDrone, fetchDrones, UpdateDrone } = useApi();
  useEffect(() => {
    const fetchDrone = async () => {
      try {
        setLoading(true);
        const droneData = await fetchDrones();
        setDrones(droneData === null ? [] : droneData);
      } catch (error) {
        console.error("Error fetching zones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrone();
  }, []);

  const handleClickOpen = () => {
    setEditMode(false);
    setModel("");
    setZone(NaN);
    setOpen(true);
  };

  const handleEdit = (drone: Drone) => {
    setEditMode(true);
    setCurrentDroneId(drone.ID !== undefined ? drone.ID : null);
    setModel(drone.model_type);
    setZone(drone.zone);
    setOpen(true);
  };

  const handleDelete = async (droneId: string | null) => {
    try {
      setMessage("Deleting Drone...");
      setLoading(true);
      await DeleteDrone(droneId);
      setDrones(drones.filter((drone) => drone.ID !== droneId));
    } catch (error) {
      console.error("Error deleting drones:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveAddDrone = async () => {
    const newDrone: Drone = {
      model_type: model,
      zone: zone,
    };

    try {
      setSendLoading(true);
      setErrorMessage(null);
      if (editMode && currentDroneId !== null) {
        setMessage("Saving Drone...");
        const updatedDrone = await UpdateDrone(newDrone, currentDroneId);
        setDrones(
          drones.map((drone) =>
            drone.ID === currentDroneId ? updatedDrone : drone
          )
        );
      } else {
        setMessage("Creating Drone...");
        const createdDrone = await CreateDrone(newDrone);
        setDrones([...drones, createdDrone]);
      }
      handleClose();
    } catch (error) {
      console.error("Error adding drones:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Drones
      </Typography>
      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Drone
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="!text-center">ID</TableCell>
              <TableCell className="!text-center">Model</TableCell>
              <TableCell className="!text-center">Zone</TableCell>
              <TableCell className="!text-center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="!text-center">
            {drones.map((drone) => (
              <TableRow key={drone.ID}>
                <TableCell className="!text-center">{drone.ID}</TableCell>
                <TableCell className="!text-center">
                  {drone.model_type}
                </TableCell>
                <TableCell className="!text-center">{drone.zone}</TableCell>
                <TableCell className="!text-center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(drone)}
                    className="!mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleDelete(drone.ID !== undefined ? drone.ID : null)
                    }
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editMode ? "Edit Attribute" : "Add New Attribute"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Model Type"
            fullWidth
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Zone"
            type="number"
            fullWidth
            value={zone}
            onChange={(e) => setZone(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <LoadingButton
            loading={sendLoading}
            loadingPosition="end"
            variant="text"
            sx={{ width: "100px" }}
            onClick={handleSaveAddDrone}
          >
            {editMode ? "Update" : "Add"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {loading ? <Loading message={message} /> : null}
    </Box>
  );
};

export default Drones;
