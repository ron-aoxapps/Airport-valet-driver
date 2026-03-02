import {createReducer, createSlice} from '@reduxjs/toolkit';
import {vehicleListSuccess} from './actions';

const initialState = {
  vehicles: [],
};

const reducer = createReducer(initialState, builder => {
  builder.addCase(vehicleListSuccess, (state, action) => {
    console.log('data', action.payload);
    return {
      ...state,
      vehicles: action.payload,
    };
  });
});

export default reducer;
