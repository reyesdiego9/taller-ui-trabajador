import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getVisitbyId, updateVisitState } from "./visitSlice";
import { StyledPaper } from "../../css/style";
import "./visit.css";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  CardHeader,
  Chip,
  ListItem,
  ListItemText,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { blue, deepOrange, lightGreen, yellow } from "@mui/material/colors";
import { serviceByVisitId, updateServiceState } from "../services/serviceSlice";
import AddVisitModal from "./ModalAddVisit";
import ModalAddService from "../services/ModalAddService";
import ButtonStage from "./components/ButtonStage/ButtonStage";

const steps = ["Pendiente", "En proceso", "Finalizado"];

function QontoStepIcon(props) {
  const { completed, icon } = props;
  let colorCheck = "#000080";

  if (icon === 1) {
    colorCheck = deepOrange[800];
  }
  if (icon === 2) {
    colorCheck = yellow[600];
  }
  if (icon === 3) {
    colorCheck = lightGreen[600];
  }

  return (
    <>
      {completed ? (
        <Avatar sx={{ bgcolor: blue[900], width: 30, height: 30 }}>
          <Check />
        </Avatar>
      ) : (
        <Avatar sx={{ bgcolor: colorCheck, width: 30, height: 30 }}>
          {icon}
        </Avatar>
      )}
    </>
  );
}

const VisitDetail = () => {
  const dataVisit = useSelector((state) => state.visits.data);
  const statusVisit = useSelector((state) => state.visits.status);
  const { data = [], error, status } = useSelector((state) => state.services);

  const { id_visit } = useParams();
  const dispatch = useDispatch();
  const [activeStepVisit, setactiveStepVisit] = useState(0);
  const [activeStep, setActiveStep] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getVisitbyId(id_visit)).then((data) => {
      setactiveStepVisit(parseInt(data.payload.state.id_sem));
      console.log(data.payload.token.token);
    });
  }, []);

  useEffect(() => {
    dispatch(serviceByVisitId(id_visit)).then((data) => {
      setActiveStep(data.payload.length);
    });
  }, []);

  if (statusVisit === "loading") {
    return <div>Loading...</div>;
  }

  if (statusVisit === "failed") {
    return <div>Error: {error}</div>;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const getColorChip = (idState) => {
    console.log(idState);
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleAddService = () => {
    setIsModalOpen(true);
  };

  const handleServiceStateUpdate = (serviceId, newStateId) => {
    dispatch(updateServiceState({ serviceId, newStateId })).then(() => {
      dispatch(serviceByVisitId(id_visit));
    });
  };

  const handleEndVisit = () => {
    dispatch(updateVisitState({ id_visit }));
    setactiveStepVisit(3);
  };

  const handleCopyURL = () => {
    const url = `http://localhost:5174/visit/${dataVisit.token.token}`; // Reemplaza con tu URL deseada

    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("URL copiado al portapapeles:", url);
      })
      .catch((error) => {
        console.error("Error al copiar el URL:", error);
      });
  };

  return (
    <>
      <StyledPaper>
        <Box mb={2}>
          <CardHeader
            title={`Detalles de Visita`}
            action={
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginLeft: "16px" }}
                  onClick={handleAddService}
                >
                  Agregar servicio
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCopyURL}
                  style={{ marginLeft: "16px" }}
                >
                  Compartir
                </Button>
                {dataVisit?.state?.id_sem != 3 && (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: "16px" }}
                    onClick={handleEndVisit}
                  >
                    Finalizar
                  </Button>
                )}
              </>
            }
          />
          <CardContent>
            <Typography variant="h6">Informacion de Visita</Typography>
            <Typography>Comentario: {dataVisit.comments}</Typography>
          </CardContent>
        </Box>
        <Box>
          <Stepper activeStep={activeStepVisit} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box sx={{ maxWidth: 600 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {data &&
              data.map((service, index) => (
                <Step key={service.description}>
                  <StepLabel>{service.description}</StepLabel>
                  <StepContent>
                    <Paper elevation={2} sx={{ padding: 1 }}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={`Estado`}
                          secondary={
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Chip
                                label={`${service.state.name}`}
                                color={getColorChip(service.state.id_sem)}
                              />
                              <ButtonStage
                                serviceState={service.state.id_sem}
                                serviceId={service.id_service}
                                onUpdateState={handleServiceStateUpdate}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={`Fecha de inicio`}
                          secondary={`${new Date(
                            Number(service.starttimestamp)
                          ).toLocaleDateString("es-ES")}`}
                        />
                      </ListItem>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={`Fecha de fin`}
                          secondary={
                            service.endtimestamp !== null
                              ? `${new Date(
                                  Number(service.endtimestamp)
                                ).toLocaleDateString("es-ES")}`
                              : "-"
                          }
                        />
                      </ListItem>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={`Falla`}
                          secondary={service.catalog_service.fault}
                        />
                      </ListItem>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={`Recargo`}
                          secondary={`Q. ${parseFloat(
                            service.catalog_service.charge
                          ).toFixed(2)}`}
                        />
                      </ListItem>
                      <ListItem alignItems="flex-start">
                        <Box sx={{ mb: 2 }}>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === steps.length - 1 ? "Finish" : "Continue"}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Back
                          </Button>
                        </Box>
                      </ListItem>
                    </Paper>
                  </StepContent>
                </Step>
              ))}
          </Stepper>
          {data.length > 0 ? (
            activeStep === data.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>Ver Servicios</Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reiniciar
                </Button>
              </Paper>
            )
          ) : (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  p: 2,
                  width: "100%",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Aun no se tienen servicios
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      </StyledPaper>
      <ModalAddService
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        idVisit={id_visit}
      />
    </>
  );
};

export default VisitDetail;
