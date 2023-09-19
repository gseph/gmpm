import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { Progress, ProgressSliceState, ID } from '@/app/types';
import { remove as deleteCharacter } from '@/features/characters/charactersSlice';
import { loadDataForEntity, removeById, setAllItems } from "@/app/utils";


const initialState: ProgressSliceState = {
  items: [],
  isLoading: false,
  error: ''
}


export const fetch = createAsyncThunk(
  'progresses/fetch',
  async () => {
    const data = await loadDataForEntity('progresses')
    return data!.length === 0 ? [] as Progress[] : data as Progress[];
  }
)

const progressesSlice = createSlice({
  name: 'progresses',
  initialState: initialState,
  reducers: {
    add: {
      reducer(state, action) {
        state.items.push(action.payload)
      },
      prepare({ name, dice, starting, current, min, max, characterId }) {
        return {
          payload: {
            id: nanoid(),
            name: name,
            dice: dice,
            starting: starting,
            current: current,
            min: min,
            max: max,
            characterId: characterId
          }
        }
      }
    },
    remove: removeById(),
    update: {
      reducer(state, { payload }) {
        const item = state.items.find(elem => elem.id === payload.id)
        const newValue = payload.add + item!.current
        const max = item!.max
        const min = item!.min
        item!.current = Math.min(Math.max(min, newValue), max);
      },
      prepare({ id, add }) {
        return {
          payload: {
            id: id,
            add: add
          }
        }
      }
    },
    edit: {
      reducer(state, { payload }) {
        const item = state.items.find(item => payload.id === item.id);
        if (payload.name) item!.name = payload.name;
        if (payload.dice) item!.dice = payload.dice;
        if (payload.starting) item!.starting = payload.starting;
        if (payload.current) item!.current = payload.current;
        if (payload.min) item!.min = payload.min;
        if (payload.max) item!.max = payload.max;
      },
      prepare({ id, name, dice, starting, current, min, max, }) {
        return {
          payload: {
            id: id,
            name: name,
            dice: dice,
            starting: starting,
            current: current,
            min: min,
            max: max,
          }
        }
      }
    },
    reset: {
      reducer(state, { payload }) {
        const item = state.items.find(item => payload.id === item.id);
        item!.current = item!.starting;
      },
      prepare({ id }) {
        return {
          payload: {
            id: id
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

export const getProgressesSlice = (state: { progresses: ProgressSliceState }): ProgressSliceState => {
  return state.progresses
};

export const getProgresses = (state: { progresses: ProgressSliceState }): Progress[] => {
  return state.progresses.items
};

export const getProgressById = (
  state: { progresses: ProgressSliceState },
  id: ID
): undefined | Progress => {
  return state.progresses.items.find(elem => elem.id === id)
};

export const getProgressesById = (
  state: { progresses: ProgressSliceState },
  ids: ID[]
): Progress[] => {
  return state.progresses.items.filter(elem => (ids.find(id => elem.id === id) !== undefined))
};

export const getProgressesByCharacterId = (
  state: { progresses: ProgressSliceState },
  id: ID
): Progress[] => {
  return state.progresses.items.filter(elem => elem.characterId === id)
};

export const getProgressesIsLoading = (state: { progresses: ProgressSliceState }): boolean => {
  return state.progresses.isLoading
};

export const getProgressesError = (state: { progresses: ProgressSliceState }): string => {
  return state.progresses.error ?? ''
};


export const { add, remove, update, edit, reset, setAll } = progressesSlice.actions;

export const progressesReducer = progressesSlice.reducer;

