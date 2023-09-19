import {
    tokenize,
    rollDice,
    tallyRolls,
    calculateFinalResult,
    Rolls,
} from '@airjp73/dice-notation';
import { DiceRollResult } from './types';
import { Dispatch } from 'react';
import { AnyAction } from '@reduxjs/toolkit';
import { saveRoll } from './dice-roll-historySlice';

export const diceNotationRoll = (input: string, dispatch?: Dispatch<AnyAction>): DiceRollResult => {
    const tokens = tokenize(input);
    const r = rollDice(tokens);
    const rollTotals = tallyRolls(tokens, r);
    const finalResult = calculateFinalResult(tokens, rollTotals);
    const roll = { rollDice: r, rollTotals, tokens, finalResult };
    if (dispatch) {
        dispatch(saveRoll({
            formula: input,
            result: roll
        }))
    }
    return roll;
};

export const rollStringOutput = (input: DiceRollResult): string => {
    let retString = "";
    input.rollDice.forEach((roll: Rolls | null, i) => {
        if (roll !== null && roll.length !== 0) {
            retString = retString + JSON.stringify(roll);
        }
        else if (roll !== null && roll.length === 0) {
            retString = retString + input.rollTotals[i];
        }
        else {
            retString = retString + input.tokens[i].content;
        }
    });
    return `{${retString}} = ${input.finalResult}`;
}