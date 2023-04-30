import { gql } from "@apollo/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../server/client";

const initialState = {
  data: [],
  status: "idle",
  error: null,
  total: 0,
};

export const getVisitbyCarId = createAsyncThunk(
  "visit/getVisitbyCarId",
  async (id) => {
    const { data } = await client.query({
      query: gql`
        query Query($idCar: Int!) {
          visitsByCarId(id_car: $idCar) {
            id_visit
            start_date
            end_date
            comments
            state {
              id_sem
              name
            }
            token {
              token
            }
          }
        }
      `,
      variables: { idCar: id },
    });
    return data.visitsByCarId;
  }
);

export const getVisitbyId = createAsyncThunk(
  "visit/getVisitbyId",
  async (id) => {
    const { data } = await client.query({
      query: gql`
        query ServicesByVisitId($visitId: ID!) {
          visit(id: $visitId) {
            start_date
            end_date
            state {
              id_sem
              name
            }
            token {
              id_token
              token
            }
            comments
          }
        }
      `,
      variables: { visitId: id },
    });
    return data.visit;
  }
);

export const createVisitCar = createAsyncThunk(
  "visit/createVisitCar",
  async (visit) => {
    const { data } = await client.mutate({
      mutation: gql`
        mutation CreateVisit($visitInput: VisitInput!) {
          createVisit(visitInput: $visitInput) {
            id_visit
            start_date
            end_date
            state {
              id_sem
              name
            }
            token {
              id_token
              token
            }
            comments
          }
        }
      `,
      variables: {
        visitInput: {
          start_date: new Date(),
          end_date: null,
          stateId: 1,
          carId: visit.idCar,
          comments: visit.comment,
        },
      },
    });
    return data.createVisit;
  }
);

export const visitSlice = createSlice({
  name: "visits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVisitbyCarId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVisitbyCarId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.total = action.payload.length;
        state.data = action.payload;
      })
      .addCase(getVisitbyCarId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(getVisitbyId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVisitbyId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getVisitbyId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(createVisitCar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createVisitCar.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(createVisitCar.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default visitSlice.reducer;
