import { gql } from "@apollo/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../server/client";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

export const getCatalogService = createAsyncThunk(
  "catalogService/getCatalogService",
  async () => {
    const { data } = await client.query({
      query: gql`
        query CatalogServices {
          catalogServices {
            id_catalog_service
            fault
            charge
          }
        }
      `,
    });
    return data.catalogServices;
  }
);

export const catalogServiceSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCatalogService.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCatalogService.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getCatalogService.rejected, (state, action) => {
        state.deleteCar = "failed";
        state.error = action.error.message;
      });
  },
});

export default catalogServiceSlice.reducer;
