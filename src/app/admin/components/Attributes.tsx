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

const Attributes: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [open, setOpen] = useState(false);
  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState<string[]>([]);
  const [currentAttributeId, setCurrentAttributeId] = useState<string | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        const attributeData = await fetchAttributes();
        setAttributes(attributeData);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };
    fetchAttribute();
  }, []);

  // const handleClickOpen = () => {
  //   setEditMode(false);
  //   setAttributeName("");
  //   setAttributeValue([]);
  //   setOpen(true);
  // };

  const handleEdit = (attribute: Attribute) => {
    setEditMode(true);
    console.log(attribute.ID);
    console.log(attribute);
    setCurrentAttributeId(attribute.ID !== undefined ? attribute.ID : null);
    setAttributeName(attribute.name);
    setAttributeValue(attribute.value);
    setOpen(true);
  };

  // const handleDelete = async (attributeId: string | null) => {
  //   try {
  //     await DeleteAttribute(attributeId);
  //     setAttributes(attributes.filter((attr) => attr.ID !== attributeId));
  //   } catch (error) {
  //     console.error("Error deleting attributes:", error);
  //   }
  // };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveAddAttribute = async () => {
    const newAttribute: Attribute = {
      name: attributeName,
      value: attributeValue,
    };

    try {
      if (editMode && currentAttributeId !== null) {
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
        const createdAttribute = await CreateAttribute(newAttribute);
        setAttributes([...attributes, createdAttribute]);
      }
      handleClose();
    } catch (error) {
      console.error("Error adding attributes:", error);
    }
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAttributeValue(event.target.value.split(",").map((val) => val.trim()));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Attributes
      </Typography>
      {/* <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Attribute
        </Button>
      </Box> */}
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
                  {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleDelete(
                        attribute.ID !== undefined ? attribute.ID : null
                      )
                    }
                  >
                    Delete
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Attribute Dialog */}
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
            value={attributeValue.join(", ")}
            onChange={handleValueChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveAddAttribute} color="primary">
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Attributes;
