import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { Action, ActionSliceState, ID } from "../../app/types";
import { remove as deleteCharacter } from "../characters/charactersSlice";
import { loadDataForEntity, removeById, setAllItems } from "../../app/utils";


const initialState: ActionSliceState = {
  items: [],
  isLoading: false,
  error: ''
}


export const fetch = createAsyncThunk(
  'actions/fetch',
  async () => {
    const data = await loadDataForEntity('actions')
    return data!.length === 0 ? [] as Action[] : data as Action[];
  }
)

const actionsSlice = createSlice({
  name: 'actions',
  initialState: initialState,
  reducers: {
    add: {
      reducer(state, action) {
        state.items.push(action.payload)
      },
      prepare({ name, dice, characterId }) {
        return {
          payload: {
            id: nanoid(),
            name: name,
            dice: dice,
            characterId: characterId
          }
        }
      }
    },
    remove: removeById(),
    edit: {
      reducer(state, action) {
        const item = state.items.find(item => action.payload.id === item.id);
        item!.name = action.payload.name;
        item!.dice = action.payload.dice;
      },
      prepare({ name, dice, id }) {
        return {
          payload: {
            id: id,
            name: name,
            dice: dice,
          }
        }
      }
    },
    setAll: setAllItems()

  },
  extraReducers(builder) {
    builder
      .addCase(fetch.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Something went wrong!';
      })
      .addCase(deleteCharacter, (state, action) => {
        state.items = [...(state.items.filter(elem => elem.characterId !== action.payload.id))];
      })
  },
});

export const getActionsSlice = (state: { actions: ActionSliceState }): ActionSliceState => {
  return state.actions
};

export const getActions = (state: { actions: ActionSliceState }): Action[] => {
  return state.actions.items
};

export const getActionById = (
  state: { actions: ActionSliceState },
  id: ID
): undefined | Action => {
  return state.actions.items.find(elem => elem.id === id)
};

export const getActionsById = (
  state: { actions: ActionSliceState },
  ids: ID[]
): Action[] => {
  return state.actions.items.filter(elem => (ids.find(id => elem.id === id) !== undefined))
};

export const getActionsByCharacterId = (
  state: { actions: ActionSliceState },
  id: ID
): Action[] => {
  return state.actions.items.filter(elem => elem.characterId === id)
};

export const getActionsIsLoading = (state: { actions: ActionSliceState }): boolean => {
  return state.actions.isLoading
};

export const getActionsError = (state: { actions: ActionSliceState }): string => {
  return state.actions.error ?? ''
};


export const { add, remove, edit, setAll } = actionsSlice.actions;

export const actionsReducer = actionsSlice.reducer;