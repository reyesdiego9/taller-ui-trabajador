import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { deleteCar } from "./CarSlice";
import { useDispatch } from "react-redux";

const DeleteCarModal = ({ isOpen, onClose, setClientData, car }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    setIsDeleting(true);
    dispatch(deleteCar(car.id_car)).then((data) => {
      // Eliminar el coche con el id especificado
      if (data.meta.requestStatus === "fulfilled") {
        // Actualizar el estado con la nueva lista de coches
        setClientData((prevState) => {
          const updatedCars = prevState.cars.filter(
            (carData) => carData.id_car !== car.id_car
          );

          return { ...prevState, cars: updatedCars };
        });
        setIsDeleting(false);
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Eliminar Vehículo</DialogTitle>
      <DialogContent>
        ¿Estás seguro de que deseas eliminar el vehículo con placa {car.plate}?
      </DialogContent>
      <DialogActions>
        <Button disabled={isDeleting} onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={isDeleting} onClick={handleDelete}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCarModal;
