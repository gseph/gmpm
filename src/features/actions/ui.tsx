import { forwardRef, useState } from "react";
import { Action } from "@/app/types";
import { TextLoading } from "@/ui/loading";
import { useDispatch, useSelector } from "react-redux";
import { diceNotationRoll } from "../dice-roll-history/utils";
import { Button } from "@/ui/Button";
import { add, edit, getActionsByCharacterId, remove } from "./actionsSlice";
import { getRandomActionName } from "@/app/utils";
import { ArrowBackUp, Plus, Trash } from "tabler-icons-react";

export const ActionComponent = ({ action }: { action: Action }) => {

  const dispatch = useDispatch();
  const onClickFunction = (e) => {
    e.preventDefault();
    const roll = diceNotationRoll(action.dice, dispatch);
  };

  return (<>
    <div className={`flex flex-row justify-between p-2 gap-2 border-t-2 border-gray-500 items-center`}>
      <div className="basis-3/5">
        {action.name}
      </div>
      <div className="basis-2/5">

        <Button variant={'action'}
          className="w-full flex-grow p-2 font-bold text-center"
          onClick={(e) => onClickFunction(e)}
        >{action.dice}</Button>

      </div>
    </div>
  </>)
}

export const ActionComponentLoading = () => {
  return(
  <div className={`flex flex-row justify-between p-2 gap-2 border-t-2 border-gray-500 items-center`}>
    <div className="basis-3/5 h-8">
    <TextLoading> <div className='bg-slate-700 h-full w-full rounded-sm' /> </TextLoading>
    </div>
    <div className="basis-2/5">

      <Button variant={'action'}
        className="w-full flex-grow p-2 font-bold text-center"
      >...</Button>

    </div>
  </div>)
}
export const Actions = ({ actions }: { actions: Action[] }) => {
  const [shown, setShown] = useState(true);

  const actionsRender = (<>
    <div className="transition-opacity ease-in-out">

      {actions.map((action, act_i) => {
        return <ActionComponent action={action} key={'action-component-' + act_i + action.id} />
      })}
    </div>
  </>);
  return (<>
    <div className="flex flex-col border-slate-600 border">
      <h2 className='w-full px-2 py-4 text-xl font-semibold text-left bg-slate-700 text-slate-50 hover:underline cursor-pointer'
        onClick={() => { setShown(prev => !prev) }}
      >
        {shown ? '-' : '+'} Actions
      </h2>
      {shown ? actionsRender : null}

      <div className="h-0 border-t-2 border-gray-500" />
    </div>
  </>);
}

export const ActionsLoading = () => {
  return (<>

    <div className="flex flex-col border-slate-600 border">
      <h2 className='w-full px-2 py-4 text-xl font-semibold text-left bg-slate-700 text-slate-50 hover:underline cursor-pointer'>
        Actions
      </h2>
      <div className="transition-opacity ease-in-out">

        {[0, 1].map((i) => {
          return <ActionComponentLoading key={'action-loading-elem-' + i} />
        })}
      </div>

      <div className="h-0 border-t-2 border-gray-500" />
    </div>

  </>);
}



interface DeletableAction extends Action {
  deleted?: boolean
}

export const CharacterFormActionColumn = forwardRef(({ character, ...props }, ref) => {
  const dispatch = useDispatch();
  const sliceActions = useSelector(state => getActionsByCharacterId(state, character?.id ?? ''));
  const [actions, setActions] = useState<DeletableAction[]>([...(sliceActions.map((a: Action) => {
    return {
      id: a.id,
      characterId: a.characterId,
      name: a.name,
      dice: a.dice,
      deleted: false
    }
  }))]);
  const [collapsed, setCollapsed] = useState(false);

  const submitted = (e) => {
    e.preventDefault();
    actions
      .filter(a => a.name !== '')
      .forEach((action, i) => {
        if (action.deleted) {
          dispatch(remove({
            id: action.id
          }))
        }
        else if (action.id === '') {
          dispatch(add({
            characterId: character.id,
            name: action.name,
            dice: action.dice
          }))
        }
        else {
          dispatch(edit({
            id: action.id,
            name: action.name,
            dice: action.dice
          }))
        }
      })
  }

  const addAction = e => {
    e.preventDefault();
    setActions([...actions, { id: '', characterId: character.id, name: '', dice: '' }])
  }

  const nameChange = (e, i) => {
    e.preventDefault();
    const a = actions;
    a[i].name = e.target.value;
    setActions([...a])
  }
  const diceChange = (e, i) => {
    e.preventDefault();
    const a = actions;
    a[i].dice = (e.target.value);
    setActions([...a])
  }

  const markActionAsDeleted = (e, i, deleted = true) => {
    e.preventDefault();
    const a = actions;
    a[i].deleted = deleted;
    setActions([...a])
  }

  const renderEdit_flex = (<>
    <div className="container flex flex-col gap-1 justify-start">
      <div className="row0 flex flex-row basis-0 gap-2 mx-2 justify-between">
        <h3 className="basis-8/12">Name</h3>
        <h3 className="basis-4/12">Dice</h3>
      </div>
      {actions.map((action, i) => {
        return (<>
          <div className={`rows flex flex-row basis-0 gap-2 mx-2`}>
            <div className="basis-10/12">
              <input type="text" name={"action-name-" + i} id={"action-name-" + i}
                value={action.name} onChange={e => nameChange(e, i)}
                placeholder={getRandomActionName()}
                className={`w-full ${action.deleted ? 'line-through' : ''}`}
              />
            </div>
            <div className="basis-0">
              <input type="text" name={"action-value-" + i} id={"action-value-" + i}
                value={action.dice} onChange={e => diceChange(e, i)}
                placeholder="1d20"
                className={`min-w-0 ${action.deleted ? 'line-through' : ''}`}
              />
            </div>
            <div className="basis-0">
              <Button type="button" onClick={e => markActionAsDeleted(e, i, !action.deleted)}>
                {action.deleted ? <ArrowBackUp /> : <Trash />}
              </Button>
            </div>
          </div>
        </>);
      })}

      <div className="lastRow text-center">

        <Button size={'none'} type="button"
          className=" my-2 rounded-full p-2 font-bold text-center transition duration-200 ease-in-out shadow-md bg-slate-950 text-slate-100 hover:bg-slate-900 hover:text-cyan-50 hover:scale-125 hover:rotate-[360deg]"
          onClick={addAction}
        >
          <Plus size={24} strokeWidth={2} color="white" />
        </Button>
      </div>
    </div>
  </>);

  const renderEdit = (<>
    <div className="flex flex-col justify-center w-full max-w-full px-4">
      <div className="grid grid-cols-12 gap-2 justify-center">
        <div className="col-span-11 grid grid-cols-12 gap-2 justify-center">
          <h3 className="col-span-8 font-semibold text-md">Name</h3>
          <h3 className="col-span-4 font-semibold text-md">Dice</h3>
        </div>
        <div className="col-span-1 flex flex-row gap-2 justify-center"></div>
        {actions.map((action, i) => {
          return (<>
            <div className={`col-span-11 grid grid-cols-12 gap-2 justify-center ${action.deleted ? 'bg-red-400' : ''}`}>
              <div className="col-span-8">
                <input type="text" name={"action-name-" + i} id={"action-name-" + i}
                  value={action.name} onChange={e => nameChange(e, i)}
                  placeholder={getRandomActionName()}
                  className={`shadow-inner rounded-sm border border-slate-400 bg-transparent w-full ${action.deleted ? 'line-through' : ''}`}
                />
              </div>
              <div className="col-span-4">
                <input type="text" name={"action-value-" + i} id={"action-value-" + i}
                  value={action.dice} onChange={e => diceChange(e, i)}
                  placeholder="1d20"
                  className={`shadow-inner rounded-sm border border-slate-400 bg-transparent w-full ${action.deleted ? 'line-through' : ''}`}
                />
              </div>
            </div>
            <div className="col-span-1 flex flex-row justify-center">
              <Button type="button" onClick={e => markActionAsDeleted(e, i, !action.deleted)}>
                {action.deleted ? <ArrowBackUp /> : <Trash />}
              </Button>
            </div>
          </>);
        })}

        <div className="lastRow col-span-12 flex flex-row justify-center">

          <Button
            size={'none'} variant={'add'}
            type="button"
            className=" my-2 p-2 font-bold "
            onClick={addAction}
          >
            <Plus size={24} strokeWidth={2} color="white" />
          </Button>
        </div>
      </div>
    </div>
  </>);


  return (<>
    <button hidden ref={ref} onClick={submitted} />
    <div className="min-h-0 max-h-full h-fit flex flex-col gap-4 justify-start border-2 border-slate-700">
      <h2 className='hover:cursor-pointer hover:underline w-full px-2 py-4 text-left bg-slate-700 text-slate-50'
        onClick={e => { setCollapsed(prev => !prev) }}>
        Actions
      </h2>
      {collapsed ? null : renderEdit}


    </div>
  </>);

})