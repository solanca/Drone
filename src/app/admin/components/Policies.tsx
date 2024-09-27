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
import { Policy } from "../types";
import Loading from "@/app/components/Loading";
import { LoadingButton } from "@mui/lab";
import { useApi } from "../../api";

const Policies: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [open, setOpen] = useState(false);
  const [zone, setZone] = useState<number>(NaN);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [currentPolicyId, setCurrentPolicyId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Fetching policies...");
  const [sendLoading, setSendLoading] = useState(false);

  const { CreatePolicy, DeletePolicy, fetchPolicies, UpdatePolicy } = useApi();
  useEffect(() => {
    const fetchPolicy = async () => {
      setLoading(true);
      try {
        const policyData = await fetchPolicies();
        setPolicies(policyData === null ? [] : policyData);
      } catch (error) {
        console.error("Error fetching zones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  const handleClickOpen = () => {
    setEditMode(false);
    setZone(NaN);
    setStartTime("");
    setEndTime("");
    setOpen(true);
  };

  const handleEdit = (policy: Policy) => {
    setEditMode(true);
    setCurrentPolicyId(policy.ID !== undefined ? policy.ID : null);
    setZone(policy.zone);
    setStartTime(policy.start_time);
    setEndTime(policy.end_time);
    setOpen(true);
  };

  const handleDelete = async (policyId: string | null) => {
    try {
      setLoading(true);
      setMessage("Deleting policy...");
      await DeletePolicy(policyId);
      setPolicies(policies.filter((policy) => policy.ID !== policyId));
    } catch (error) {
      console.error("Error deleting drones:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveAddPolicy = async () => {
    const newPolicy: Policy = {
      zone: zone,
      start_time: startTime,
      end_time: endTime,
    };

    try {
      setSendLoading(true);
      if (editMode && currentPolicyId !== null) {
        setMessage("Saving policy...");
        console.log(currentPolicyId);
        const updatedPolicy = await UpdatePolicy(newPolicy, currentPolicyId);
        setPolicies(
          policies.map((policy) =>
            policy.ID === currentPolicyId ? updatedPolicy : policy
          )
        );
      } else {
        setMessage("Creating policy...");
        const createdPolicy = await CreatePolicy(newPolicy);
        setPolicies([...policies, createdPolicy]);
      }
      handleClose();
    } catch (error) {
      console.error("Error adding drones:", error);
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Policies
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Policy
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="!text-center">Zone</TableCell>
              <TableCell className="!text-center">StartTime</TableCell>
              <TableCell className="!text-center">EndTime</TableCell>
              <TableCell className="!text-center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="!text-center">
            {policies.map((policy) => (
              <TableRow key={policy.ID}>
                <TableCell className="!text-center">{policy.zone}</TableCell>
                <TableCell className="!text-center">
                  {policy.start_time}
                </TableCell>
                <TableCell className="!text-center">
                  {policy.end_time}
                </TableCell>
                <TableCell className="!text-center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(policy)}
                    className="!mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleDelete(policy.ID !== undefined ? policy.ID : null)
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
        <DialogTitle>{editMode ? "Edit Policy" : "Add New Policy"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Zone"
            type="number"
            fullWidth
            value={zone}
            onChange={(e) => setZone(Number(e.target.value))}
          />
          <TextField
            margin="dense"
            label="Start Time"
            fullWidth
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <TextField
            margin="dense"
            label="End Time"
            fullWidth
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
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
            onClick={handleSaveAddPolicy}
          >
            {editMode ? "Update" : "Add"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {loading ? <Loading message={message} /> : null}
    </Box>
  );
};

export default Policies;
