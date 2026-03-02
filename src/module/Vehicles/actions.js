import {createAction} from '@reduxjs/toolkit';

export const addNewVehicleRequest = createAction('addnewVehicle/request');
export const deleteVehicleRequest = createAction('deleteVehicle/request');

export const vehicleListRequest = createAction('VehicleList/request');
export const vehicleListSuccess = createAction('VehicleList/success');
