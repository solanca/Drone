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
} from "@mui/material";
import { Drone } from "../types";
import { CreateDrone, DeleteDrone, fetchDrones, UpdateDrone } from "@/app/api";

const Drones: React.FC = () => {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState("");
  const [zone, setZone] = useState(NaN);
  const [currentDroneId, setCurrentDroneId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchDrone = async () => {
      try {
        const droneData = await fetchDrones();
        setDrones(droneData);
      } catch (error) {
        console.error("Error fetching zones:", error);
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
      await DeleteDrone(droneId);
      setDrones(drones.filter((drone) => drone.ID !== droneId));
    } catch (error) {
      console.error("Error deleting drones:", error);
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
      if (editMode && currentDroneId !== null) {
        const updatedDrone = await UpdateDrone(newDrone, currentDroneId);
        setDrones(
          drones.map((drone) =>
            drone.ID === currentDroneId ? updatedDrone : drone
          )
        );
      } else {
        const createdDrone = await CreateDrone(newDrone);
        setDrones([...drones, createdDrone]);
      }
      handleClose();
    } catch (error) {
      console.error("Error adding drones:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Drones
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Drone
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="text-center">ID</TableCell>
              <TableCell className="text-center">Model</TableCell>
              <TableCell className="text-center">Zone</TableCell>
              <TableCell className="text-center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="text-center">
            {drones.map((drone) => (
              <TableRow key={drone.ID}>
                <TableCell className="text-center">{drone.ID}</TableCell>
                <TableCell className="text-center">
                  {drone.model_type}
                </TableCell>
                <TableCell className="text-center">{drone.zone}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(drone)}
                    className="mr-2"
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
          <Button onClick={handleSaveAddDrone} color="primary">
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Drones;
