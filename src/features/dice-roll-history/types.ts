import { RollResults, Token } from "@airjp73/dice-notation"
import { RollTotal } from "@airjp73/dice-notation/dist/tallyRolls"

export type DiceRoll = {
    timestamp?: null|Date|string,
    formula: string,
    result: DiceRollResult
}

export type DiceRollResult = {
    rollDice: RollResults,
    tokens: Token[],
    rollTotals: RollTotal[],
    finalResult: number
}