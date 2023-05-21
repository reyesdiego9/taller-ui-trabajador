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
            id_service
            description
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
    return data.createService;
  }
);

export const updateServiceState = createAsyncThunk(
  "services/updateServiceState",
  async ({ stateID, serviceID }) => {
    console.log("stateID", stateID);
    console.log("serviceID", serviceID);
    const { data } = await client.mutate({
      mutation: gql`
        mutation Mutation($stateId: ID!, $serviceId: ID!) {
          updateServiceState(stateID: $stateId, serviceID: $serviceId) {
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
        stateId: stateID,
        serviceId: serviceID,
      },
    });
    return data.updateServiceState;
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
    builder.addCase(updateServiceState.pending, (state) => {
      state.status = "loading";
    });
    builder
      .addCase(updateServiceState.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedService = action.payload;

        const serviceIndex = state.data.findIndex(
          (service) => service.id_service === updatedService.id_service
        );
        if (serviceIndex !== -1) {
          // Clonar el objeto del servicio y actualizar solo la propiedad state
          state.data[serviceIndex] = {
            ...state.data[serviceIndex],
            state: updatedService.state,
            endtimestamp:
              updatedService.state.id_sem == 3
                ? updatedService.endtimestamp
                : null,
          };
        }

        console.log(
          "updatedService.updatedService",
          updatedService.endtimestamp
        );
      })
      .addCase(updateServiceState.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default servicesSlice.reducer;
