import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { Attribute, AttributeSliceState, ID } from "../../app/types";
import { remove as deleteCharacter } from "../characters/charactersSlice";
import { loadDataForEntity, removeById, setAllItems } from "../../app/utils";


const initialState: AttributeSliceState = {
  items: [],
  isLoading: false,
  error: ''
}

export const fetch = createAsyncThunk(
  'attributes/fetch',
  async () => {
    const data = await loadDataForEntity('attributes')
    return data!.length === 0 ? [] as Attribute[] : data as Attribute[];
  }
)

const attributesSlice = createSlice({
  name: 'attributes',
  initialState: initialState,
  reducers: {
    add: {
      reducer(state, action) {
        state.items.push(action.payload)
      },
      prepare({ name, value, characterId }) {
        return {
          payload: {
            id: nanoid(),
            name: name,
            value: value,
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
        item!.value = action.payload.value;
      },
      prepare({ name, value, id }) {
        return {
          payload: {
            id: id,
            name: name,
            value: value,
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

export const getAttributesSlice = (state: { attributes: AttributeSliceState }): AttributeSliceState => { 
  return state.attributes 
};

export const getAttributes = (state: { attributes: AttributeSliceState }): Attribute[] => { 
  return state.attributes.items 
};

export const getAttributeById = (
  state: { attributes: AttributeSliceState },
  id: ID
): undefined | Attribute => {
  return state.attributes.items.find(elem => elem.id === id)
};

export const getAttributesById = (
  state: { attributes: AttributeSliceState },
  ids: ID[]
): Attribute[] => {
  return state.attributes.items.filter(elem => (ids.find(id => elem.id === id) !== undefined))
};

export const getAttributesByCharacterId = (
  state: { attributes: AttributeSliceState },
  id: ID
): Attribute[] => {
  return state.attributes.items.filter(elem => elem.characterId === id)
};

export const getAttributesIsLoading = (state: { attributes: AttributeSliceState }): boolean => { 
  return state.attributes.isLoading 
};

export const getAttributesError = (state: { attributes: AttributeSliceState }): string => { 
  return state.attributes.error ?? '' 
};


export const { add, remove, edit, setAll } = attributesSlice.actions;

export const attributesReducer = attributesSlice.reducer;