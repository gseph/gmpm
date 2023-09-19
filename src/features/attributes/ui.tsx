import React, { forwardRef, useState } from "react";
import { Attribute } from "@/app/types";
import { TextLoading } from "@/ui/loading";
import { useDispatch, useSelector } from "react-redux";
import { add, edit, getAttributesByCharacterId, remove } from "./attributesSlice";
import { Button } from "@/ui/Button";
import { getRandomAttributeName, getRandomNumber } from "@/app/utils";
import { ArrowBackUp, Plus, Trash } from "tabler-icons-react";

export const AttributeComponent = ({ attribute }: { attribute: Attribute }) => {
  return (<>
    <div className={`flex gap-2 flex-row justify-between px-4 py-2 border-t-2 border-gray-500
      `}>

      <div className="flex-1">
        {attribute.name}
      </div>
      <div>
        {attribute.value}
      </div>
    </div>

  </>);
}

export const AttributeComponentLoading = () => {
  return <div className={`flex gap-2 flex-row justify-between p-1 h-8 border-t-2 border-gray-500
  `}>

    <div className="basis-3/4 flex-grow">
      <TextLoading> <div className='bg-slate-700 h-full w-full rounded-sm' /> </TextLoading>
    </div>
    <div className="basis-1/4 flex-grow">
      <TextLoading> <div className='bg-slate-700 h-full w-full rounded-sm' /> </TextLoading>
    </div>
  </div>
}
export const Attributes = ({ attributes }: { attributes: Attribute[] }) => {
  const [shown, setShown] = useState(true);

  const attributesRender = (<>
    <div className="transition-opacity ease-in-out">

      {attributes.map((attribute, attr_i) => {
        return <AttributeComponent attribute={attribute} key={'attribute-component-' + attr_i + attribute.id} />
      })}
    </div>
  </>);
  return (<>
    <div className="flex flex-col border-slate-600 border ">
      <h2 className='w-full px-2 py-4 text-xl font-semibold text-left bg-slate-700 text-slate-50 hover:underline cursor-pointer'
        onClick={() => { setShown(prev => !prev) }}
      >
        {shown ? '-' : '+'} Attributes
      </h2>
      {shown ? attributesRender : null}
    </div>
  </>);
}

export const AttributesLoading = () => {
  return (<>

    <div className="flex flex-col border-slate-600 border ">
      <h2 className='w-full px-2 py-4 text-xl font-semibold text-left bg-slate-700 text-slate-50 hover:underline cursor-pointer'>
        Attributes
      </h2>
      <div className="transition-opacity ease-in-out">

        {[0, 1].map((i) => {
          return <AttributeComponentLoading key={'attribute-loading-elem-' + i} />
        })}
      </div>
    </div>

  </>);
}


interface DeletableAttribute extends Attribute {
  deleted?: boolean,
  valueString?: string
}

export const CharacterFormAttributeColumn = forwardRef(({ character, ...props }, ref) => {
  const dispatch = useDispatch();
  const sliceAttributes = useSelector(state => getAttributesByCharacterId(state, character?.id ?? ''));
  const [attributes, setAttributes] = useState<DeletableAttribute[]>([...(sliceAttributes.map((a: Attribute) => {
    return {
      id: a.id,
      characterId: a.characterId,
      name: a.name,
      value: a.value,
      valueString: a.value.toString(),
      deleted: false
    }
  }))]);
  const [collapsed, setCollapsed] = useState(false);

  const submitted = (e) => {
    e.preventDefault();
    attributes
      .filter(a => a.name !== '')
      .forEach((attribute, i) => {
        if (attribute.deleted) {
          dispatch(remove({
            id: attribute.id
          }))
        }
        else if (attribute.id === '') {
          dispatch(add({
            characterId: character.id,
            name: attribute.name,
            value: parseInt(attribute.valueString!)
          }))
        }
        else {
          dispatch(edit({
            id: attribute.id,
            name: attribute.name,
            value: parseInt(attribute.valueString!)
          }))
        }
      })
  }

  const addAttribute = e => {
    e.preventDefault();
    setAttributes([...attributes, { id: '', characterId: character.id, name: '', value: 0, valueString: '' }])
  }

  const nameChange = (e, i) => {
    e.preventDefault();
    const a = attributes;
    a[i].name = e.target.value;
    setAttributes([...a])
  }
  const valueChange = (e, i) => {
    e.preventDefault();
    const a = attributes;
    a[i].valueString = e.target.value;
    setAttributes([...a])
  }

  const markAttributeAsDeleted = (e, i, deleted = true) => {
    e.preventDefault();
    const a = attributes;
    a[i].deleted = deleted;
    setAttributes([...a])
  }

  const renderEdit_flex = (<>
    <div className="container flex flex-col gap-1 justify-start">
      <div className="row0 flex flex-row basis-0 gap-2 mx-2 justify-between">
        <h3 className="basis-8/12">Name</h3>
        <h3 className="basis-4/12">Value</h3>
      </div>
      {attributes.map((attribute, i) => {
        return (<>
          <div className={`rows flex flex-row basis-0 gap-2 mx-2`}>
            <div className="basis-10/12">
              <input type="text" name={"attribute-name-" + i} id={"attribute-name-" + i}
                value={attribute.name} onChange={e => nameChange(e, i)}
                placeholder={getRandomAttributeName()}
                className={`w-full ${attribute.deleted ? 'line-through' : ''}`}
              />
            </div>
            <div className="basis-0">
              <input type="text" name={"attribute-value-" + i} id={"attribute-value-" + i}
                value={attribute.valueString} onChange={e => valueChange(e, i)}
                placeholder={getRandomNumber(1, 42).toLocaleString()}
                className={`min-w-0 ${attribute.deleted ? 'line-through' : ''}`}
              />
            </div>
            <div className="basis-0">
              <Button type="button" onClick={e => markAttributeAsDeleted(e, i, !attribute.deleted)}>
                {attribute.deleted ? <ArrowBackUp /> : <Trash />}
              </Button>
            </div>
          </div>
        </>);
      })}

      <div className="lastRow text-center">

        <Button size={'none'} type="button"
          className=" my-2 rounded-full p-2 font-bold text-center transition duration-200 ease-in-out shadow-md bg-slate-950 text-slate-100 hover:bg-slate-900 hover:text-cyan-50 hover:scale-125 hover:rotate-[360deg]"
          onClick={addAttribute}
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
          <h3 className="col-span-9 font-semibold text-md">Name</h3>
          <h3 className="col-span-3 font-semibold text-md">Value</h3>
        </div>
        <div className="col-span-1 flex flex-row gap-2 justify-center"></div>
        {attributes.map((attribute, i) => {
          return (<>
            <div className={`col-span-11 grid grid-cols-12 gap-2 justify-center ${attribute.deleted ? 'bg-red-400' : ''}`}>
              <div className="col-span-9">
                <input type="text" name={"attribute-name-" + i} id={"attribute-name-" + i}
                  value={attribute.name} onChange={e => nameChange(e, i)}
                  placeholder={getRandomAttributeName()}
                  className={`shadow-inner rounded-sm border border-slate-400 bg-transparent w-full ${attribute.deleted ? 'line-through' : ''}`}
                />
              </div>
              <div className="col-span-3">
                <input type="text" inputMode="numeric" name={"attribute-value-" + i} id={"attribute-value-" + i}
                  value={attribute.valueString} onChange={e => valueChange(e, i)}
                  placeholder={getRandomNumber(1, 42).toLocaleString()}
                  className={`shadow-inner rounded-sm border border-slate-400 bg-transparent w-full ${attribute.deleted ? 'line-through' : ''}`}
                />
              </div>
            </div>
            <div className="col-span-1 flex flex-row justify-center">
              <Button type="button" onClick={e => markAttributeAsDeleted(e, i, !attribute.deleted)}>
                {attribute.deleted ? <ArrowBackUp /> : <Trash />}
              </Button>
            </div>
          </>);
        })}

        <div className="lastRow col-span-12 flex flex-row justify-center">

          <Button
            size={'none'} variant={'add'}
            type="button"
            className=" my-2 p-2 font-bold "
            onClick={addAttribute}
          >
            <Plus size={24} strokeWidth={2} color="white" />
          </Button>
        </div>
      </div>
    </div>
  </>);

  return (<>
    <button hidden ref={ref} onClick={submitted} />
    <div className="flex flex-col gap-4 min-h-0 max-h-full h-fit justify-start border-2 border-slate-700">
      <h2 className='hover:cursor-pointer hover:underline w-full px-2 py-4 text-left bg-slate-700 text-slate-50'
        onClick={e => { setCollapsed(prev => !prev) }}>
        Attributes
      </h2>

      {collapsed ? null : renderEdit}

    </div>
  </>);

})