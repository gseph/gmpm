import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { Character, CharacterSliceState, ID } from "../../app/types";
import { loadDataForEntity, removeById, setAllItems } from "../../app/utils";


const initialState: CharacterSliceState = {
  items: [],
  isLoading: false,
  error: ''
}

export const fetch = createAsyncThunk(
  'characters/fetch',
  async () => {
    const data = await loadDataForEntity('characters')
    return data!.length === 0 ? [] as Character[] : data as Character[];
  }
);

const charactersSlice = createSlice({
  name: 'characters',
  initialState: initialState,
  reducers: {
    add: {
      reducer(state, action) {
        state.items.push(action.payload)
      },
      prepare({ name, id }: {name: string, id?: string}) {
        return {
          payload: {
            id: id !== undefined && id !== null && id !== '' ? id: nanoid(),
            name: name,
          }
        }
      }
    },
    remove: removeById(),
    edit: {
      reducer(state, {payload}) {
        const item = state.items.find(item => payload.id === item.id);
        item!.name = payload.name;
      },
      prepare({ id, name}) {
        return {
          payload: {
            id: id,
            name: name,
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
  },
});

export const getCharactersSlice = (state: { characters: CharacterSliceState }): CharacterSliceState => {
  return state.characters
};

export const getCharacters = (state: { characters: CharacterSliceState }): Character[] => {
  return state.characters.items
};

export const getCharacterById = (
  state: { characters: CharacterSliceState },
  id: ID
): undefined | Character => {
  return state.characters.items.find(character => character.id === id)
};

export const getCharactersIsLoading = (state: { characters: CharacterSliceState }): boolean => {
  return state.characters.isLoading
};

export const getCharactersError = (state: { characters: CharacterSliceState }): string => {
  return state.characters.error ?? ''
};


export const { add, remove, edit, setAll } = charactersSlice.actions;

export const charactersReducer = charactersSlice.reducer;