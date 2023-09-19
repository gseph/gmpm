import { applyMiddleware, configureStore } from "@reduxjs/toolkit";


import { charactersReducer } from "../features/characters/charactersSlice";
import { diceRollerReducer } from "../features/dice-roll-history/dice-roll-historySlice";
import { attributesReducer } from "../features/attributes/attributesSlice";
import { progressesReducer } from "../features/progresses/progressesSlice";
import { actionsReducer } from "../features/actions/actionsSlice";
import { asyncLocalStorage } from "./utils";
import { searchBarSliceReducer } from "@/features/top-bar/top-bar-slice";


const savingMiddleware = api => next => action => {
  const result = next(action);

  const charactersActionSave = ['characters/add', 'characters/remove', 'characters/edit', 'characters/setAll'];
  const attributesActionSave = ['attributes/add', 'attributes/remove', 'attributes/edit', 'attributes/setAll'];
  const actionsActionSave = ['actions/add', 'actions/remove', 'actions/edit', 'actions/setAll'];
  const progressesActionSave = ['progresses/add', 'progresses/remove', 'progresses/edit', 'progresses/update', 'progresses/setAll'];

  if (action.type.startsWith("diceRolls/")) { return result; }
  if (charactersActionSave.includes(action.type)) {
    const characters = api.getState().characters.items;
    asyncLocalStorage.setItem('characters', JSON.stringify(characters));
  }
  if (attributesActionSave.includes(action.type)) {
    const attributes = api.getState().attributes.items;
    asyncLocalStorage.setItem('attributes', JSON.stringify(attributes));
  }
  if (actionsActionSave.includes(action.type)) {
    const actions = api.getState().actions.items;
    asyncLocalStorage.setItem('actions', JSON.stringify(actions));
  }
  if (progressesActionSave.includes(action.type)) {
    const progresses = api.getState().progresses.items;
    asyncLocalStorage.setItem('progresses', JSON.stringify(progresses));
  }
  return result;
}

const savingEnhancer = applyMiddleware(savingMiddleware);
export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    attributes: attributesReducer,
    progresses: progressesReducer,
    actions: actionsReducer,
    diceRolls: diceRollerReducer,
    searchBar: searchBarSliceReducer,
  },
  enhancers: [
    savingEnhancer,
  ]
})

