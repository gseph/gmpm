import { SliceCaseReducers, createSlice } from "@reduxjs/toolkit";
import { DiceRoll } from "./types";
const MAX_HISTORY_LENGHT = 50;
export const diceRollSlice = createSlice<DiceRoll[], SliceCaseReducers<DiceRoll[]>, string>({
    name: 'diceRolls',
    initialState: [],
    reducers: {
        saveRoll(state, action) {
            if (state.length > MAX_HISTORY_LENGHT) {
                state.shift();
            }
            state.push({
                formula: action.payload.formula,
                result: action.payload.result,
                timestamp: new Date()
            })
        }
    }
})

export const {saveRoll} = diceRollSlice.actions;

export const selectAllDiceRolls = (state: {diceRolls: DiceRoll[]}) => {return state.diceRolls};
export const selectDiceRollsState = (state) => {return state};

export const diceRollerReducer = diceRollSlice.reducer;