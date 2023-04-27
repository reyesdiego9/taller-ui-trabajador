import { gql, useQuery } from "@apollo/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../server/client";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

export const getClients = createAsyncThunk("clients/fetchClients", async () => {
  const { data } = await client.query({
    query: gql`
      query {
        clients {
          id_client
          address
          dpi
          nit
          email
          name
          phone
          username
        }
      }
    `,
  });
  return data.clients;
});

export const getClientbyId = createAsyncThunk(
  "client/getClientbyId",
  async (id) => {
    const { data } = await client.query({
      query: gql`
        query Query($clientId: ID!) {
          client(id: $clientId) {
            id_client
            address
            dpi
            nit
            name
            email
            phone
            username
            cars {
              vin
              plate
              model
              brand
              year
              id_car
            }
          }
        }
      `,
      variables: { clientId: id },
    });
    return data.client;
  }
);

export const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getClients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getClients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(getClientbyId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getClientbyId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getClientbyId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default clientsSlice.reducer;
