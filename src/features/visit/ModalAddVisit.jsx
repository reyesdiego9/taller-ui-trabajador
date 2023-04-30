import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { uid } from "uid";
import { createVisitCar } from "./visitSlice";

const AddVisitModal = ({ isOpen, onClose, idCar = 0, setVisits }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const handleSave = async () => {
    dispatch(createVisitCar({ comment, idCar })).then((data) => {
      console.log(data);
      if (data.meta.requestStatus === "fulfilled") {
        handleClose();
      }
    });
  };

  const handleClose = () => {
    setComment("");
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Agendar Visita</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Motivo de la visita"
          type="text"
          multiline
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVisitModal;
