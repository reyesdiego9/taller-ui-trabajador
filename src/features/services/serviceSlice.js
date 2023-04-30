import { gql } from "@apollo/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../server/client";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

export const serviceByVisitId = createAsyncThunk(
  "services/serviceByVisitId",
  async (id) => {
    const { data } = await client.query({
      query: gql`
        query Visit($idVisit: ID!) {
          servicesByVisitId(id_visit: $idVisit) {
            description
            id_service
            state {
              id_sem
              name
            }
            catalog_service {
              charge
              fault
            }
            starttimestamp
            endtimestamp
          }
        }
      `,
      variables: { idVisit: id },
    });
    return data.servicesByVisitId;
  }
);

export const createServices = createAsyncThunk(
  "services/createService",
  async (services) => {
    const { data } = await client.mutate({
      mutation: gql`
        mutation CreateService($serviceInput: ServiceInput!) {
          createService(serviceInput: $serviceInput) {
            id_service
            description
            state {
              name
              id_sem
            }
            catalog_service {
              fault
              id_catalog_service
              charge
            }
            starttimestamp
            endtimestamp
          }
        }
      `,
      variables: {
        serviceInput: {
          description: services.service,
          visitId: services.idVisit,
          catalogServiceId: services.catalog.id_catalog_service,
          stateId: 1,
          starttimestamp: new Date(),
          endtimestamp: null,
        },
      },
    });
    console.log("test", data.createService);
    return data.createService;
  }
);

export const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(serviceByVisitId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(serviceByVisitId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(serviceByVisitId.rejected, (state, action) => {
        state.deleteCar = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(createServices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(createServices.rejected, (state, action) => {
        state.deleteCar = "failed";
        state.error = action.error.message;
      });
  },
});

export default servicesSlice.reducer;
