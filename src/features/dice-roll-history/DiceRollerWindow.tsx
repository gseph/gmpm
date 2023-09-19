import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllDiceRolls } from './dice-roll-historySlice';
import { diceNotationRoll, rollStringOutput } from './utils';
import { Button } from '@/ui/Button';


const StdDiceSet = () => {
  const dispatch = useDispatch();
  const diceSetRow0 = [2, 4, 6];
  const diceSetRow1 = [8, 10, 12];
  const diceSetRow2 = [20, 100];
  const diceSetCol = [diceSetRow0, diceSetRow1, diceSetRow2];
  const stdDiceRoll = (e, faces: number) => {
    e.preventDefault();
    const formula = `1d${faces}`;
    const rollResult = diceNotationRoll(formula, dispatch);
  }
  return (<>
    <div className='flex flex-col gap-2'>
      {diceSetCol.map((rows, row_i) => {
        return (<>
          <div key={'dice-row-' + row_i} className='flex flex-row gap-2'>
            {rows.map((faces) => {
              return (<>
                <Button variant={'top'}
                  className={`basis-1/${rows.length} flex-grow px-2 py-2 font-bold text-center`}
                  key={`1d${faces}`}
                  onClick={(e) => stdDiceRoll(e, faces)}>
                  1d{faces}
                </Button>

              </>);
            })}
          </div>
        </>);
      })}
    </div>

  </>);
}


export const DiceRollerWindow = () => {
  const dispatch = useDispatch();
  const diceHistory = useSelector(selectAllDiceRolls);
  const [input, setInput] = useState('');
  const scrollableChatRef = useRef<HTMLUListElement>(null);
  function handleSubmit(e) {
    e.preventDefault();
    const roll = diceNotationRoll(input, dispatch);
    setInput('');
  }

  const diceInputRef = useRef(null)

  useEffect(() => {
    scrollableChatRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
  }, [diceHistory]);


  const diceHistoryRenderLi = <>
    {diceHistory.map((dh) => {
      const render =
        <>
          rolloing ({dh.formula}) -{'>'}
          {rollStringOutput(dh.result).split("=")[0]} = <b>{dh.result.finalResult}</b>
        </>;
      return (<>
        <li className='border-b-2 border-gray-400' title={dh.timestamp?.toLocaleString()}>
          {render}
        </li>
      </>);
    })}
  </>

  return (
    <>
      <div id='dice-area' className='w-full h-full p-2 mr-2'>
        <div id="flex-layout"
          className='flex flex-col h-full gap-2'>
          <div className='p-4 shadow-md bg-slate-700'>
            <StdDiceSet />
          </div>
          <div className='flex flex-col justify-end h-[100%] gap-1 overflow-scroll overflow-x-clip pl-2 shadow-inner bg-slate-300'>
            <div className='overflow-scroll '>
              <ul ref={scrollableChatRef} className='text-sm flex flex-col shadow-inner  gap-1 h-max-[70%] overflow-x-hidden overflow-y-scroll justify-end'>
                <li className='border-b-2 border-gray-400'></li>
                {diceHistoryRenderLi}
              </ul>
            </div>

            <div className='w-full h-fit'>
              <form onSubmit={handleSubmit}>
                <input
                  ref={diceInputRef}
                  className='px-4 py-2 bg-gray-200 shadow-inner outline-none'
                  placeholder={"e.g '2d12 + 1d6 + 4'"}
                  type="text" name="in" id="in" value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </form>
            </div>
          </div>
        </div>

      </div>

    </>
  )
}

