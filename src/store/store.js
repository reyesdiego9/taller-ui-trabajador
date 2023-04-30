import { configureStore } from "@reduxjs/toolkit";
import ClientSlide from "../features/client/ClientSlide";
import CarSlice from "../features/car/CarSlice";
import visitSlice from "../features/visit/visitSlice";
import serviceSlice from "../features/services/serviceSlice";
import catalogServiceSlice from "../features/reducers/catalogSlice";
import statusSlice from "../features/reducers/statusSlice";

export default configureStore({
  reducer: {
    clients: ClientSlide,
    cars: CarSlice,
    visits: visitSlice,
    services: serviceSlice,
    catalog: catalogServiceSlice,
    states: statusSlice,
  },
});
