import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  serviceByVisitId,
  updateServiceState,
} from "../../../services/serviceSlice";

const ButtonStage = ({ serviceState = 0, serviceId }) => {
  const dispatch = useDispatch();

  const handleButtonClick = (newStateId) => {
    dispatch(updateServiceState({ stateID: newStateId, serviceID: serviceId }));
  };

  if (serviceState == 1) {
    return (
      <Button
        variant="contained"
        sx={{ ml: "auto" }}
        onClick={() => handleButtonClick(2)}
      >
        Comenzar
      </Button>
    );
  } else if (serviceState == 2) {
    return (
      <Button
        variant="contained"
        sx={{ ml: "auto" }}
        onClick={() => handleButtonClick(3)}
      >
        Finalizar
      </Button>
    );
  } else {
    return <></>;
  }
};

ButtonStage.propTypes = {
  serviceState: PropTypes.string.isRequired,
};

export default ButtonStage;
