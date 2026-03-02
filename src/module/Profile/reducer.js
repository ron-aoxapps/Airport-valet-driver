import {createReducer, createSlice} from '@reduxjs/toolkit';

import {profileSuccess} from './actions';

const initialState = {
  profileData: null,
};

const reducer = createReducer(initialState, builder => {
  builder.addCase(profileSuccess, (state, action) => {
    return {
      ...state,
      profileData: action.payload,
    };
  });
});

export default reducer;
