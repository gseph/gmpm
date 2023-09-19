export type ID = string | number;

export type Attribute = {
    id: ID,
    characterId: ID,
    name: string,
    value: number
}

export type Action = {
    id: ID,
    characterId: ID,
    name: string,
    dice: string,
}

export type Progress = {
    id: ID,
    characterId: ID,
    name: string,
    dice: string,
    starting: number,
    current: number,
    min: number,
    max: number
}

export type Character = {
    id: ID
    name: string
}

export type SliceState<T> = {
    items: T[],
    isLoading: boolean,
    error?: null|string
}
export type CharacterSliceState = SliceState<Character>
export type AttributeSliceState = SliceState<Attribute>
export type ProgressSliceState = SliceState<Progress>
export type ActionSliceState = SliceState<Action>