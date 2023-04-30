import { gql } from "@apollo/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../server/client";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

export const getCars = createAsyncThunk("cars/getCars", async () => {
  const { data } = await client.query({
    query: gql`
      query {
        cars {
          id_car
          year
          vin
          plate
          model
          brand
        }
      }
    `,
  });
  return data.cars;
});

export const getCarbyId = createAsyncThunk("cars/getCarbyId", async (id) => {
  const { data } = await client.query({
    query: gql`
      query State($carId: ID!) {
        car(id: $carId) {
          id_car
          year
          vin
          plate
          model
          brand
          client {
            name
            dpi
          }
        }
      }
    `,
    variables: { carId: id },
  });
  return data.car;
});

export const createCar = createAsyncThunk("cars/createCar", async (car) => {
  const { year } = car;
  const { data } = await client.mutate({
    mutation: gql`
      mutation CreateCar($carInput: CarInput!) {
        createCar(carInput: $carInput) {
          id_car
          vin
          plate
          model
          brand
        }
      }
    `,
    variables: {
      carInput: {
        clientId: car.idClient,
        year,
        vin: car.vin,
        plate: car.plate,
        model: car.model?.model,
        brand: car.brand?.make,
      },
    },
  });
  return data.createCar;
});

export const deleteCar = createAsyncThunk("cars/deleteCar", async (id) => {
  const { data } = await client.mutate({
    mutation: gql`
      mutation Mutation($deleteCarId: ID!) {
        deleteCar(id: $deleteCarId)
      }
    `,
    variables: {
      deleteCarId: id,
    },
  });
  return data.deleteCar;
});

export const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCars.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCars.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getCars.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(createCar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.data.push(action.payload);
      })
      .addCase(createCar.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(deleteCar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((car) => car.id !== action.payload.id);
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.deleteCar = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(getCarbyId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCarbyId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getCarbyId.rejected, (state, action) => {
        state.deleteCar = "failed";
        state.error = action.error.message;
      });
  },
});

export default carsSlice.reducer;
