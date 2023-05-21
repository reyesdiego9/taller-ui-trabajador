import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCarbyId } from "./CarSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { StyledPaper } from "../../css/style";
import { getVisitbyCarId } from "../visit/visitSlice";
import AddVisitModal from "../visit/ModalAddVisit";

export const CarDetailById = () => {
  const { status, data = [], error } = useSelector((state) => state.cars);
  const visitData = useSelector((state) => state.visits.data);
  const dispatch = useDispatch();
  const { id_car } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    setVisits(visitData);
  }, [visitData]);

  useEffect(() => {
    dispatch(getCarbyId(id_car));
    dispatch(getVisitbyCarId(Number(id_car)));
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const getColorChip = (idState) => {
    console.log("idState", idState);

    if (idState == 1) {
      return "info";
    }
    if (idState == 2) {
      return "warning";
    }

    if (idState == 3) {
      return "success";
    }
  };

  const handleAddVisit = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <StyledPaper>
        <Box mb={2}>
          <CardHeader
            title={`Detalles del vehiculo`}
            action={
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddVisit}
              >
                Agendar Visita
              </Button>
            }
          />
          <CardContent>
            <Typography>Placas: {data.plate}</Typography>
            <Typography>Marca: {data.brand}</Typography>
            <Typography>Modelo: {data.model}</Typography>
          </CardContent>
          <Box>
            <CardHeader title={`Visitas del vehiculo`} />
            <CardContent key="visitContent">
              {visits.length > 0 ? (
                visits.map((visit, index) => (
                  <>
                    <List
                      key={`${visit.token.token}`}
                      sx={{
                        width: "100%",
                        bgcolor: "background.paper",
                      }}
                    >
                      <Card variant="outlined">
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={`Fecha de inicio`}
                            secondary={`${new Date(
                              Number(visit.start_date)
                            ).toLocaleDateString("es-ES")}`}
                          />
                        </ListItem>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={`Fecha de fin`}
                            secondary={
                              visit.end_date !== null
                                ? `${new Date(
                                    Number(visit.end_date)
                                  ).toLocaleDateString("es-ES")}`
                                : "-"
                            }
                          />
                        </ListItem>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={`Comentario`}
                            secondary={`${visit.comments}`}
                          />
                        </ListItem>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={`Estado`}
                            secondary={
                              <Chip
                                label={`${visit.state.name}`}
                                color={getColorChip(visit.state.id_sem)}
                              />
                            }
                          />
                        </ListItem>
                        <ListItem alignItems="flex-start">
                          <ListItemText>
                            <Button
                              variant="contained"
                              sx={{
                                ml: "auto",
                                bgcolor: "#000080",
                                color: "#fff",
                                "&:hover": { bgcolor: "#000050" },
                              }}
                              component={Link}
                              to={`/visits/${visit.id_visit}`}
                            >
                              Ver más
                            </Button>
                          </ListItemText>
                        </ListItem>
                      </Card>
                    </List>
                  </>
                ))
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "200px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    p: 2,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Sin visitas
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Box>
        </Box>
      </StyledPaper>
      <AddVisitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        idCar={id_car}
        setVisits={setVisits}
      />
    </>
  );
};
