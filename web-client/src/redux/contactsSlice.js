import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contacts: [],
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
    updateContact: (state, action) => {
      const index = state.contacts.findIndex(
        (c) => c.phoneNumber === action.payload.phoneNumber
      );
      state.contacts[index] = {
        ...state.contacts[index],
        ...action.payload.data,
      };
    },
    addContact: (state, action) => {
      state.contacts.push(action.payload);
    },
    reset: (state, action) => {
      return initialState;
    },
  },
});

export default contactsSlice.reducer;
export const { setContacts, updateContact, addContact, reset } =
  contactsSlice.actions;
