import React, { useState, useEffect } from "react";
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
import { Attribute } from "../types";
import {
  CreateAttribute,
  DeleteAttribute,
  fetchAttributes,
  UpdateAttribute,
} from "@/app/api";
import Loading from "@/app/components/Loading";
import { LoadingButton } from "@mui/lab";

const Attributes: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [open, setOpen] = useState(false);
  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState<string[]>([]);
  const [rawAttributeValue, setRawAttributeValue] = useState(""); // New state for raw input
  const [currentAttributeId, setCurrentAttributeId] = useState<string | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Fetching attributes...");
  const [sendLoading, setSendLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        setLoading(true);
        const attributeData = await fetchAttributes();
        setAttributes(attributeData);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttribute();
  }, []);

  const handleEdit = (attribute: Attribute) => {
    setEditMode(true);
    setCurrentAttributeId(attribute.ID !== undefined ? attribute.ID : null);
    setAttributeName(attribute.name);
    setAttributeValue(attribute.value);
    setRawAttributeValue(attribute.value.join(", ")); // Initialize raw input
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveAddAttribute = async () => {
    const newAttribute: Attribute = {
      name: attributeName,
      value: rawAttributeValue
        .split(",")
        .map((val) => val.trim())
        .filter((val) => val), // Split raw input into array
    };

    try {
      setSendLoading(true);
      if (editMode && currentAttributeId !== null) {
        setMessage("Saving attribute...");
        const updatedAttribute = await UpdateAttribute(
          newAttribute,
          currentAttributeId
        );
        setAttributes(
          attributes.map((attr) =>
            attr.ID === currentAttributeId ? updatedAttribute : attr
          )
        );
      } else {
        setMessage("Creating attribute...");
        const createdAttribute = await CreateAttribute(newAttribute);
        setAttributes([...attributes, createdAttribute]);
      }
      handleClose();
    } catch (error) {
      console.error("Error adding attributes:", error);
    } finally {
      setSendLoading(false);
    }
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRawAttributeValue(event.target.value);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Attributes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="text-center">Name</TableCell>
              <TableCell className="text-center">Value</TableCell>
              <TableCell className="text-center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attributes.map((attribute) => (
              <TableRow key={attribute.ID}>
                <TableCell className="text-center">{attribute.name}</TableCell>
                <TableCell className="text-center">
                  {Array.isArray(attribute.value)
                    ? attribute.value.join(", ")
                    : ""}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(attribute)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Attribute Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editMode ? "Edit Attribute" : "Add New Attribute"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Attribute Name"
            fullWidth
            value={attributeName}
            onChange={(e) => setAttributeName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Attribute Values (comma-separated)"
            fullWidth
            value={rawAttributeValue}
            onChange={handleValueChange}
            onBlur={() =>
              setAttributeValue(
                rawAttributeValue
                  .split(",")
                  .map((val) => val.trim())
                  .filter((val) => val)
              )
            } // Update attributeValue on blur
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
            onClick={handleSaveAddAttribute}
          >
            {editMode ? "Update" : "Add"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {loading ? <Loading message={message} /> : null}
    </Box>
  );
};

export default Attributes;
