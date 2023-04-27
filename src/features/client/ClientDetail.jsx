import {
  Box,
  Button,
  CardContent,
  CardHeader,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClientbyId } from "./ClientSlide";
import { useDispatch, useSelector } from "react-redux";
import styled from "@emotion/styled";
import AddCarModal from "../car/ModalAddCar";
import { Assignment, Delete, SendRounded } from "@mui/icons-material";

const StyledPaper = styled(Paper)({
  margin: "2rem auto",
  width: "80%",
  padding: "2rem",
});

export const ClientDetail = () => {
  const dispatch = useDispatch();
  const { status, data = [], error } = useSelector((state) => state.clients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientData, setClientData] = useState(data);
  const { clientId } = useParams();

  useEffect(() => {
    dispatch(getClientbyId(clientId));
  }, [dispatch, clientId]);

  useEffect(() => {
    setClientData(data);
  }, [data]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const handleAddCar = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <StyledPaper>
        <Box mb={2}>
          <CardHeader title={`Detalles de ${clientData.name}`} />
          <CardContent>
            <Typography variant="h6">Informacion de Contacto</Typography>
            <Typography>Correo: {clientData.email}</Typography>
            <Typography>Telefono: {clientData.phone}</Typography>
            <Typography>DPI: {clientData.dpi}</Typography>
          </CardContent>
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" component="h3">
              Vehiculos
            </Typography>
            <Button variant="contained" onClick={handleAddCar}>
              Agregar Vehiculo
            </Button>
          </Box>
          <Box mt={2}>
            {clientData?.cars?.map((car) => (
              <Box
                key={car.plate}
                mb={2}
                sx={{ borderBottom: "1px solid #e0e0e0" }}
              >
                <Typography variant="subtitle1" component="p">
                  Placas: {car.plate}
                </Typography>
                <Typography variant="subtitle1" component="p">
                  Modelo: {car.model}
                </Typography>
                <Typography variant="subtitle1" component="p">
                  Marca: {car.brand}
                </Typography>
                <Typography variant="subtitle1" component="p">
                  Año: {car.year}
                </Typography>
                {car?.vin && (
                  <Typography variant="subtitle1" component="p">
                    Vin: {car.vin}
                  </Typography>
                )}
                <Box mt={1} mb={2}>
                  <Button
                    color="error"
                    variant="contained"
                    startIcon={<Delete />}
                    sx={{ marginRight: "8px" }}
                  >
                    Eliminar
                  </Button>
                  <Button variant="contained" endIcon={<Assignment />}>
                    Ver info.
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </StyledPaper>
      <AddCarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        idClient={clientId}
        setClientData={setClientData}
      />
    </>
  );
};
