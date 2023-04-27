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
import { createCar } from "./CarSlice";
import { isEmpty, isNull } from "lodash";

const AddCarModal = ({ isOpen, onClose, idClient = 0, setClientData }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.cars);

  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(50), (val, index) => currentYear - index);

  useEffect(() => {
    const getBrands = async () => {
      try {
        const response = await axios.get("http://localhost:8084/api/makes");
        setBrands(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getBrands();
  }, []);

  const handleBrandChange = async (event) => {
    const selectedBrand = event.target.value;
    setBrand(selectedBrand);
    setModel("");
    try {
      const response = await axios.get(
        `http://localhost:8084/api/models/${selectedBrand.id}`
      );
      setModels(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    const brandCar = brand["make"];
    const modelCar = model["model"];
    setBrand(brandCar);
    setModel(modelCar);
    await dispatch(
      createCar({ idClient, plate, model, brand, year, vin })
    ).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        setClientData((prevState) => {
          return { ...prevState, cars: [...prevState.cars, data.payload] };
        });
        handleClose();
      }
    });
  };

  const handleClose = () => {
    setPlate("");
    setModel("");
    setBrand("");
    setYear("");
    setVin("");
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Agregar Vehículo</DialogTitle>
      {idClient === 0 && (
        <TextField
          autoFocus
          margin="dense"
          label="ID"
          type="text"
          fullWidth
          value={idClient}
        />
      )}
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Placa"
          type="text"
          fullWidth
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Marca</InputLabel>
          <Select value={brand} onChange={handleBrandChange} fullWidth required>
            {brands.map((brand) => (
              <MenuItem key={`${brand.id}-${brand.slug}`} value={brand}>
                {brand.make}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Modelo</InputLabel>
          <Select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            fullWidth
            required
          >
            {models.map((model) => (
              <MenuItem key={`${model.id}-${model.slug}`} value={model}>
                {model.model}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Año</InputLabel>
          <Select
            label="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            fullWidth
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          autoFocus
          margin="dense"
          label="VIN"
          type="text"
          fullWidth
          value={vin}
          onChange={(e) => setVin(e.target.value)}
        />
      </DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCarModal;
