// Yes, I do like shoting at flies with cannon balls

import { createSlice } from "@reduxjs/toolkit";

export const searchBarSlice = createSlice<{search: string}, any, string>({
    name: 'searchBar',
    initialState: {search: ""},
    reducers: {
        updateSearch(state, action) {
            state.search = action.payload.search
        }
    }
});

export const {updateSearch} = searchBarSlice.actions;
export const getSearchString = (state) => state.searchBar.search;
export const searchBarSliceReducer = searchBarSlice.reducer;