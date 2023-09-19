import { useSelector } from "react-redux";
import { getAttributesByCharacterId, getAttributesError, getAttributesIsLoading, getAttributesSlice } from "@/features/attributes/attributesSlice";
import { getProgressesByCharacterId, getProgressesError, getProgressesIsLoading, getProgressesSlice } from "@/features/progresses/progressesSlice";
import { getActionsByCharacterId, getActionsError, getActionsIsLoading, getActionsSlice } from "@/features/actions/actionsSlice";
import { getCharactersSlice } from "@/features/characters/charactersSlice";
import { ID } from "./types";


import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getSearchString } from "@/features/top-bar/top-bar-slice";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const leftZero = (arg: string, strLen: number) => {
    const remainingSpace = strLen - arg.length;
    if (remainingSpace <= 0) return arg;
    const prepend = Array(remainingSpace).fill('0');
    return prepend + arg;
}

export const getCurrentTime = () => {
    const now = new Date();
    const year = leftZero(now.getFullYear().toString(), 4);
    const month = leftZero(now.getMonth().toString(), 2);
    const day = leftZero(now.getDate().toString(), 2);
    const hour = leftZero(now.getHours().toString(), 2);
    const minute = leftZero(now.getMinutes().toString(), 2);
    const second = leftZero(now.getSeconds().toString(), 2);
    const format = `${year}${month}${day}-${hour}${minute}${second}`;
    return format;
}


export const asyncLocalStorage = {
    async setItem(key: string, value: string) {
        await Promise.resolve();
        localStorage.setItem(key, value);
    },
    async getItem(key: string) {
        await Promise.resolve();
        return localStorage.getItem(key);
    }
};

export const loadDataForEntity = async (entity: string) => {
    try {

        const data = await asyncLocalStorage.getItem(entity);
        const ret = JSON.parse(data ?? '[]');
        if(ret == undefined || ret === null) return [];
        return ret;
    }
    catch(e) {
        console.error('loadDataForEntity exception', e);
        return [];
    }
}


export function useGetCharacterInfo(characterId: ID) {

    const queryFilter = useSelector(getSearchString);

    const attributes = useSelector((state) => getAttributesByCharacterId(state, characterId));
    const attributesIsLoading = useSelector(getAttributesIsLoading);
    const attributesError = useSelector(getAttributesError);

    const progresses = useSelector((state) => getProgressesByCharacterId(state, characterId));
    const progressesIsLoading = useSelector(getProgressesIsLoading);
    const progressesError = useSelector(getProgressesError);

    const actions = useSelector((state) => getActionsByCharacterId(state, characterId));
    const actionsIsLoading = useSelector(getActionsIsLoading);
    const actionsError = useSelector(getActionsError);

    const filteredAttributes = attributes.filter(item => {
        if (queryFilter === '') return true;
        const filtered = item.name.toLowerCase().includes(queryFilter.toLowerCase());
        return filtered;
    });
    const filteredProgresses = progresses.filter(item => {
        if (queryFilter === '') return true;
        const filtered = item.name.toLowerCase().includes(queryFilter.toLowerCase());
        return filtered;
    })
    const filteredActions = actions.filter(item => {
        if (queryFilter === '') return true;
        const filtered = item.name.toLowerCase().includes(queryFilter.toLowerCase());
        return filtered;
    })

    return {
        filteredAttributes, attributesIsLoading, attributesError,
        filteredProgresses, progressesIsLoading, progressesError,
        filteredActions, actionsIsLoading, actionsError,
    };
}

export function useGetAllData() {

    const charactersSlice = useSelector(getCharactersSlice);
    const attributesSlice = useSelector(getAttributesSlice);
    const actionsSlice = useSelector(getActionsSlice);
    const progressesSlice = useSelector(getProgressesSlice);

    return {
        characters: charactersSlice.items,
        charactersIsLoading: charactersSlice.isLoading,
        charactersError: charactersSlice.error,

        attributes: attributesSlice.items,
        attributesIsLoading: attributesSlice.isLoading,
        attributesError: attributesSlice.error,

        actions: actionsSlice.items,
        actionsIsLoading: actionsSlice.isLoading,
        actionsError: actionsSlice.error,

        progresses: progressesSlice.items,
        progressesIsLoading: progressesSlice.isLoading,
        progressesError: progressesSlice.error,

    };
}

export function setAllItems() {
    return {
        reducer(state, { payload }) {
            state.items = payload.items;
        },
        prepare({ items }) {
            return {
                payload: {
                    items: items
                }
            };
        }
    }
}


export function removeById() {
    return {
        reducer(state, action) {
            state.items = [...(state.items.filter((elem) => action.payload.id !== elem.id))];
        },
        prepare({ id }) {
            return {
                payload: {
                    id: id
                }
            };
        }
    }
}

export function getRandomAttributeName() {
    const names = [
        'Passive projection',
        'Fleeing responsibilities speed',
        'Sunscreen sensitivity',
        'Words per minute',
    ];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}
export function getRandomActionName() {
    const names = [
        'Bonk',
        "Joestar's secret technique",
        'Ask for a refund',
        'Seduce the dragon',
        'Set on fire',
    ];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}
export function getRandomProgressnName() {
    const names = [
        'Level down',
        "Getting a 9 to 5 fulltime job",
        'Saving the dragon from the princess',
        'Filling out the tax form',
    ];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}
export function getRandomNumber(min: number, max: number) {
    const range = max-min;
    return Math.floor(Math.random() * range) + min;
}


