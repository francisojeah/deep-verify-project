import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  menu: 0,
};

export const subscribe = () => {};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    updateMenu: (state, action: PayloadAction<number>): void => {
      state.menu = action.payload;
    },
  },
});

export const { updateMenu } = menuSlice.actions;

export default menuSlice.reducer;
