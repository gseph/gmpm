import { useDispatch } from "react-redux";
import { add as addCharacter } from '@/features/characters/charactersSlice';
import { Button } from "@/ui/Button";
import { CharacterFormModal } from "@/features/characters/ui";
import { useState } from "react";
import { Plus } from "tabler-icons-react";

export const ButtonAddCharacter = ({
  onClickFunction,
  children
}) => {
  return (
    <button
      className="px-4 py-2 font-bold text-center transition duration-200 ease-in-out rounded-md shadow-md bg-blue-950 text-cyan-100 hover:bg-blue-800 hover:text-cyan-50 "
      onClick={(e) => onClickFunction(e)}
    >{children}</button>
  )
}

export const AddCharacter = () => {

  const [show, setShow] = useState(false);

  return (<>
    <div className="flex flex-row justify-center p-4 border-0 border-black h-fit text-4xl">
      <Button size={'none'} variant={'add'}
        className=" p-4 font-bold "
        onClick={(e) => { e.preventDefault(); setShow(true) }}
      >
        <Plus size={24} strokeWidth={4} />
      </Button>

    </div>
    {show && <CharacterFormModal character={null}
      show={show}
      onAbort={(e) => {setShow(false)}}
      onClose={(e) => {setShow(false)}}
    />}
  </>);
};
