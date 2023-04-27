import { configureStore } from "@reduxjs/toolkit";
import ClientSlide from "../features/client/ClientSlide";
import CarSlice from "../features/car/CarSlice";

export default configureStore({
  reducer: {
    clients: ClientSlide,
    cars: CarSlice,
  },
});
