import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getCatalogService } from "../reducers/catalogSlice";
import { useDispatch, useSelector } from "react-redux";
import { createServices } from "./serviceSlice";

const ModalAddService = ({ isOpen, onClose, idVisit = 0, setServices }) => {
  const dispatch = useDispatch();
  const { data = [] } = useSelector((state) => state.catalog);

  const [service, setService] = useState("");
  const [catalog, setCatalog] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [photo, setPhoto] = useState("");
  const [photoDescription, setPhotoDescription] = useState("");

  useEffect(() => {
    dispatch(getCatalogService());
  }, []);

  const handleClose = () => {
    setService("");
    setCatalog("");
    setPhoto("");
    setPhotoDescription("");
    onClose();
  };

  const handleCatalogChange = (event) => {
    const catalogService = event.target.value;
    setCatalog(catalogService);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handlePhotoChange = (event) => {
    const title = event.target.value;
    setPhoto(title);
  };

  const handlePhotoDescriptionChange = (event) => {
    const description = event.target.value;
    setPhotoDescription(description);
  };

  const handleSave = () => {
    dispatch(createServices({ service, catalog, idVisit })).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        handleClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} maxWidth="md">
      <DialogTitle>Registrar Servicio</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Descripcion del servicio"
          type="text"
          multiline
          rows={4}
          value={service}
          onChange={(e) => setService(e.target.value)}
          fullWidth
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Catalogo de servicios</InputLabel>
          <Select
            value={catalog}
            onChange={handleCatalogChange}
            fullWidth
            required
          >
            {data &&
              data.map((catalog) => (
                <MenuItem
                  key={`${catalog.id_catalog}-${catalog.fault}`}
                  value={catalog}
                >
                  {catalog.fault}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxChange}
              color="primary"
            />
          }
          label="Agregar foto"
        />
        {isChecked && (
          <>
            <InputLabel htmlFor="photo">Seleccionar foto</InputLabel>
            <FormControl fullWidth margin="dense">
              <Input type="file" id="photo" onChange={handlePhotoChange} />
            </FormControl>
            <TextField
              margin="dense"
              label="Descripción de la foto"
              type="text"
              multiline
              rows={4}
              value={photoDescription}
              onChange={handlePhotoDescriptionChange}
              fullWidth
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAddService;
