import { gql } from "@apollo/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../server/client";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

export const getStatus = createAsyncThunk("status/getStatus", async () => {
  const { data } = await client.query({
    query: gql`
      query CatalogServices {
        states {
          id_sem
          name
        }
      }
    `,
  });
  return data.states;
});

export const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getStatus.rejected, (state, action) => {
        state.deleteCar = "failed";
        state.error = action.error.message;
      });
  },
});

export default statusSlice.reducer;
