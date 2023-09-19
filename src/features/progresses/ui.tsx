import { useDispatch, useSelector } from "react-redux";
import { diceNotationRoll } from "../dice-roll-history/utils";
import { ProgressBar } from "../../ui/ProgressBar";
import { TextLoading } from "../../ui/loading";
import { Progress } from "../../app/types";
import { add, edit, reset as resetProgress, getProgressesByCharacterId, remove, update } from "./progressesSlice";
import { forwardRef, useState } from "react";
import { Button } from "@/ui/Button";
import { getRandomNumber, getRandomProgressnName } from "@/app/utils";
import { ArrowBackUp, Plus, ThumbDown, ThumbUp, Trash } from "tabler-icons-react";


export const ProgressComponent = ({ progress }: { progress: Progress }) => {
  const dispatch = useDispatch();
  function rollProgressDice(e, add = true) {
    e.preventDefault();
    const result = diceNotationRoll(progress.dice, dispatch);
    dispatch(update({
      id: progress.id,
      add: add ? result.finalResult : -result.finalResult
    }))
  }
  function reset(e) {
    e.preventDefault();
    dispatch(resetProgress({
      id: progress.id
    }))
  }
  return <div className={`flex flex-col px-4 py-2 border-t-2 border-gray-500
    `}>
    <div className='text-center'>
      <h3 className='text-lg font-semibold underline underline-offset-2'>

        {progress.name}
      </h3>
    </div>
    <div className="flex flex-col justify-between gap-2 pb-2">
      <ProgressBar value={progress.current} min={progress.min} max={progress.max} />
      <div className="flex flex-row justify-between gap-2 px-8">
        <div>Formula</div>
        <div>{progress.dice}</div>
      </div>
      <div className="flex flex-row gap-2 justify-between">
        <Button variant={"rollDown"} size={'progress'}
          className="max-w-fit basis-1/3  "
          onClick={(e) => rollProgressDice(e, false)}
        >
          <ThumbDown size={20} strokeWidth={2} />
        </Button>
        <Button variant={"reset"} size={'progress'}
          className="basis-1/3 "
          onClick={reset}
        >Reset</Button>
        <Button variant={"rollUp"} size={'progress'}
          className="max-w-fit basis-1/3 flex-grow  "
          onClick={(e) => rollProgressDice(e, true)}
        >
          <ThumbUp size={20} strokeWidth={2} />
        </Button>
      </div>
    </div>
  </div>
}


export const ProgressComponentLoading = () => {

  return <div className={`flex flex-col gap-2 px-4 py-2 border-t-2 border-gray-500 animate-pulse`}>
    <div className='text-center'>
      <h3 className='w-full h-8 text-lg font-semibold underline underline-offset-2'>
        <TextLoading> <div className='bg-slate-700 h-full w-full rounded-sm' /> </TextLoading>
      </h3>

    </div>
    <div className="w-full h-16">

      <TextLoading> <div className='bg-slate-700 h-full w-full rounded-sm' /> </TextLoading>
    </div>
  </div>
}

export const Progresses = ({ progresses }: { progresses: Progress[] }) => {
  const [shown, setShown] = useState(true);
  const progressesRender = (<>
    {progresses.map((progress, progr_i) => {
      return <ProgressComponent
        progress={progress} key={'progress-component-' + progr_i + progress.id} />
    })}
  </>);
  return (<>
    <div className="flex flex-col border-slate-600 border">
      <h2 className='w-full px-2 py-4 text-xl font-semibold text-left bg-slate-700 text-slate-50 hover:underline cursor-pointer'
        onClick={() => { setShown(prev => !prev) }}
      >
        {shown ? '-' : '+'} Progresses
      </h2>
      {shown ? progressesRender : null}
    </div>
  </>);
}

export const ProgressesLoading = () => {
  return (<>

    <div className="flex flex-col border-slate-600 border">
      <h2 className='w-full px-2 py-4 text-xl font-semibold text-left bg-slate-700 text-slate-50 hover:underline cursor-pointer'>
        Progresses
      </h2>
      {[0, 1].map((i) => {
        return <ProgressComponentLoading key={'progress-element-' + i} />
      })}
    </div>

  </>);
}


interface DeletableProgress extends Progress {
  deleted?: boolean,
  startingString?: string,
  currentString?: string,
  minString?: string,
  maxString?: string,
}

export const CharacterFormProgressColumn = forwardRef(({ character, ...props }, ref) => {
  const dispatch = useDispatch();
  const sliceProgresses = useSelector(state => getProgressesByCharacterId(state, character?.id ?? ''));
  const [progresses, setProgresses] = useState<DeletableProgress[]>([...(sliceProgresses.map((a: Progress) => {
    return {
      id: a.id,
      characterId: a.characterId,
      name: a.name,
      starting: a.starting,
      startingString: a.starting.toString(),
      current: a.current,
      currentString: a.current.toString(),
      min: a.min,
      minString: a.min.toString(),
      max: a.max,
      maxString: a.max.toString(),
      dice: a.dice,
      deleted: false
    }
  }))]);
  const [collapsed, setCollapsed] = useState(false);

  const submitted = (e) => {
    e.preventDefault();
    progresses
      .filter(a => a.name !== '')
      .forEach((progress) => {
        if (progress.deleted) {
          dispatch(remove({
            id: progress.id
          }))
        }
        else if (progress.id === '') {
          dispatch(add({
            characterId: character.id,
            name: progress.name,
            dice: progress.dice,
            starting: parseInt(progress.startingString!),
            current: parseInt(progress.currentString!),
            min: parseInt(progress.minString!),
            max: parseInt(progress.maxString!),
          }))
        }
        else {
          dispatch(edit({
            id: progress.id,
            name: progress.name,
            dice: progress.dice,
            starting: parseInt(progress.startingString!),
            current: parseInt(progress.currentString!),
            min: parseInt(progress.minString!),
            max: parseInt(progress.maxString!),
          }))
        }
      })
  }

  const addProgress = e => {
    e.preventDefault();
    setProgresses([...progresses,
    {
      id: '',
      characterId: character.id,
      name: '', dice: '',
      starting: 0,
      startingString: '',
      current: 0,
      currentString: '',
      min: 0,
      minString: '',
      max: 0,
      maxString: ''
    }
    ])
  }

  const nameChange = (e, i) => {
    e.preventDefault();
    const a = progresses;
    a[i].name = e.target.value;
    setProgresses([...a])
  }
  const diceChange = (e, i) => {
    e.preventDefault();
    const a = progresses;
    a[i].dice = (e.target.value);
    setProgresses([...a])
  }
  const currentChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    e.preventDefault();
    const a = progresses;
    a[i].currentString = (e.target.value);
    setProgresses([...a])
  }
  const startingChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    e.preventDefault();
    const a = progresses;
    a[i].startingString = (e.target.value);
    setProgresses([...a])
  }
  const maxChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    e.preventDefault();
    const a = progresses;
    a[i].maxString = (e.target.value);
    setProgresses([...a])
  }
  const minChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    e.preventDefault();
    const a = progresses;
    a[i].minString = (e.target.value);
    setProgresses([...a])
  }

  const markProgressAsDeleted = (e, i, deleted = true) => {
    e.preventDefault();
    const a = progresses;
    a[i].deleted = deleted;
    setProgresses([...a])
  }


  const renderEdit = (<>
    <div className="flex flex-col justify-center w-full max-w-full px-4">
      <div className="grid grid-cols-12 gap-2 justify-center">
        <div className="col-span-11 grid grid-cols-12 gap-2 justify-center">
          <h3 className="col-span-4 font-semibold text-md">Name</h3>
          <h3 className="col-span-2 font-semibold text-md">Dice</h3>
          <h3 className="col-span-1 font-semibold text-md">Min value</h3>
          <h3 className="col-span-1 font-semibold text-md">Max value</h3>
          <h3 className="col-span-2 font-semibold text-md">Starting value</h3>
          <h3 className="col-span-2 font-semibold text-md">Current value</h3>
        </div>
        <div className="col-span-1 flex flex-row gap-2 justify-center"></div>
        {progresses.map((progress, i) => {
          return (<>
            <div className={`col-span-11 grid grid-cols-12 gap-2 justify-center ${progress.deleted ? 'bg-red-400' : ''}`}>
              <div className="col-span-4">
                <input type="text" name={"progress-name-" + i} id={"progress-name-" + i}
                  value={progress.name} onChange={e => nameChange(e, i)}
                  placeholder={getRandomProgressnName()}
                  className={`shadow-inner rounded-sm border border-slate-400 bg-transparent w-full ${progress.deleted ? 'line-through' : ''}`}
                />
              </div>
              <div className="col-span-2">
                <input type="text" name={"progress-dice-" + i} id={"progress-dice-" + i}
                  value={progress.dice} onChange={e => diceChange(e, i)}
                  placeholder={'1d20'}
                  className={`shadow-inner rounded-sm border border-slate-400 bg-transparent w-full ${progress.deleted ? 'line-through' : ''}`}
                />
              </div>
              <div className="col-span-1">
                <input type="text" inputMode="numeric" name={"progress-min-" + i} id={"progress-min-" + i}
                  value={progress.minString} onChange={e => minChange(e, i)}
                  placeholder={getRandomNumber(1, 42).toLocaleString()}
                  className={`shadow-inner rounded-sm border border-slate-400 bg-transparent w-full ${progress.deleted ? 'line-through' : ''}`}
                />
              </div>
              <div className="col-span-1">
                <input type="text" inputMode="numeric" name={"progress-max-" + i} id={"progress-max-" + i}
                  value={progress.maxString} onChange={e => maxChange(e, i)}
                  placeholder={getRandomNumber(1, 42).toLocaleString()}
                  className={`shadow-inner rounded-sm border border-slate-400 bg-transparent w-full ${progress.deleted ? 'line-through' : ''}`}
                />
              </div>
              <div className="col-span-2">
                <input type="text" inputMode="numeric" name={"progress-starting-" + i} id={"progress-starting-" + i}
                  value={progress.startingString} onChange={e => startingChange(e, i)}
                  placeholder={getRandomNumber(1, 42).toLocaleString()}
                  className={`shadow-inner rounded-sm border border-slate-400 bg-transparent w-full ${progress.deleted ? 'line-through' : ''}`}
                />
              </div>
              <div className="col-span-2">
                <input type="text" inputMode="numeric" name={"progress-value-" + i} id={"progress-value-" + i}
                  value={progress.currentString} onChange={e => currentChange(e, i)}
                  placeholder={getRandomNumber(1, 42).toLocaleString()}
                  className={`shadow-inner rounded-sm border border-slate-400 bg-transparent w-full ${progress.deleted ? 'line-through' : ''}`}
                />
              </div>

            </div>
            <div className="col-span-1 flex flex-row justify-center">
              <Button type="button" onClick={e => markProgressAsDeleted(e, i, !progress.deleted)}>
                {progress.deleted ? <ArrowBackUp /> : <Trash />}
              </Button>
            </div>
          </>);
        })}
        <div className="lastRow col-span-12 flex flex-row justify-center">

          <Button
            size={'none'} variant={'add'}
            type="button"
            className=" my-2 p-2 font-bold "
            onClick={addProgress}
          >
            <Plus size={24} strokeWidth={2} color="white" />
          </Button>
        </div>
      </div>
    </div>
  </>);


  return (<>
    <button hidden ref={ref} onClick={submitted} />
    <div className="h-full flex flex-col gap-4 justify-start border-2 border-slate-700">
      <h2 className='hover:cursor-pointer hover:underline w-full px-2 py-4 text-left bg-slate-700 text-slate-50'
        onClick={e => { setCollapsed(prev => !prev) }}>
        Progresses
      </h2>
      {collapsed ? null : renderEdit}



    </div>
  </>);

})