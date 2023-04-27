import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#000000",
});

const StyledTypography = styled(Typography)({
  flexGrow: 1,
  textAlign: "center",
  color: "#ffffff",
  // Establece diferentes tamaños de fuente en función del ancho de la pantalla
  ["@media (min-width:600px)"]: {
    fontSize: "1.5rem",
  },
  ["@media (min-width:960px)"]: {
    fontSize: "2rem",
  },
});

const StyledButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
});

const StyledButton = styled(Button)({
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#ff0000",
    color: "#ffffff",
  },
});

const StyledIconButton = styled(IconButton)({
  color: "#ffffff",
});

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <StyledTypography variant="h6">Mi sitio web</StyledTypography>
        {/* Agrega un botón para mostrar las opciones en pantallas pequeñas */}
        <Box sx={{ display: { xs: "flex", sm: "none" } }}>
          <StyledIconButton edge="end" onClick={handleMenuClick}>
            <MenuIcon />
          </StyledIconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleMenuClose}>Opcion 1</MenuItem>
            <MenuItem onClick={handleMenuClose}>Opcion 2</MenuItem>
            <MenuItem onClick={handleMenuClose}>Opcion 3</MenuItem>
          </Menu>
        </Box>
        {/* Muestra las opciones en el mismo navbar en pantallas grandes */}
        <StyledButtonContainer sx={{ display: { xs: "none", sm: "flex" } }}>
          <NavLink to="/clients">
            <StyledButton>Cliente</StyledButton>
          </NavLink>
          <NavLink to="/cars">
            <StyledButton>Vehiculo</StyledButton>
          </NavLink>
          <StyledButton>Opcion 3</StyledButton>
        </StyledButtonContainer>
      </Toolbar>
      {/* Muestra el botón y las opciones debajo del mismo en pantallas pequeñas */}
      <Stack
        direction="column"
        spacing={2}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <NavLink to="/clients">
            <MenuItem onClick={handleMenuClose}>Cliente</MenuItem>
          </NavLink>
          <NavLink to="/cars">
            <MenuItem onClick={handleMenuClose}>Vehiculo</MenuItem>
          </NavLink>
          <MenuItem onClick={handleMenuClose}>Opcion 2</MenuItem>
          <MenuItem onClick={handleMenuClose}>Opcion 3</MenuItem>
        </Menu>
      </Stack>
    </StyledAppBar>
  );
};

export default Header;
