import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableCommon from "../common/TableCommon";
import { getCars } from "./CarSlice";

const Car = () => {
  const dispatch = useDispatch();
  const { status, data = [], error } = useSelector((state) => state.cars);

  const columns = [
    {
      name: "ID",
      value: "id_car",
    },
    {
      name: "Modelo",
      value: "model",
    },
    {
      name: "Marca",
      value: "brand",
    },
    {
      name: "Placas",
      value: "plate",
    },
    {
      name: "Vin",
      value: "vin",
    },
    {
      name: "Año",
      value: "year",
    },
  ];

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    dispatch(getCars());
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return <TableCommon columns={columns} data={data} />;
};

export default Car;
