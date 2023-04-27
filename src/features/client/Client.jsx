import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClients } from "./ClientSlide";
import TableCommon from "../common/TableCommon";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const Client = () => {
  const dispatch = useDispatch();
  const { status, data = [], error } = useSelector((state) => state.clients);

  const columns = [
    {
      name: "ID",
      value: "id_client",
    },
    {
      name: "Nombre",
      value: "name",
    },
    {
      name: "DPI",
      value: "dpi",
    },
    {
      name: "NIT",
      value: "nit",
    },
    {
      name: "Telefono",
      value: "phone",
    },
    {
      name: "Correo",
      value: "email",
    },
    {
      name: "Direccion",
      value: "address",
    },
    {
      name: "Usuario",
      value: "username",
    },
    {
      name: "Detalles",
      value: "id_client",
      render: (id) => (
        <Link to={`/clients/${id}`}>
          <Button variant="contained">Ver detalles</Button>
        </Link>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return <TableCommon columns={columns} data={data} />;
};

export default Client;
