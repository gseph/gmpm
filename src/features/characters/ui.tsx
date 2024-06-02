import React, { ReactNode, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { add as addCharacter, remove as deleteCharacter, edit as editCharacter } from '@/features/characters/charactersSlice';
import { Modal } from '@/ui/Modal';
import { Attributes, AttributesLoading, CharacterFormAttributeColumn } from '@/features/attributes/ui';
import { CharacterFormProgressColumn, Progresses, ProgressesLoading } from '@/features/progresses/ui';
import { Character } from '@/app/types';
import { TextLoading } from '@/ui/loading';
import { Actions, ActionsLoading, CharacterFormActionColumn } from '@/features/actions/ui';
import { useGetCharacterInfo } from '@/app/utils';
import { Button } from '@/ui/Button';
import { nanoid } from '@reduxjs/toolkit';
import { Pencil, Trash, X } from 'tabler-icons-react';


export const CharacterName = ({ children }: { children?: ReactNode }) => {
  return (<>

    <h1 className='px-2 flex flex-row justify-between items-center w-full gap-4 hover:underline transition-all text-center bg-slate-900 text-slate-50'>
      {children}
    </h1>
  </>);
}


export const CharacterNameLoading = ({ children }: { children?: ReactNode }) => {
  return (<>
    <h1 className='h-16 p-2 flex flex-row justify-between items-center w-full gap-4 hover:underline transition-all text-center bg-slate-900 text-slate-50'>
      {children}
    </h1>
  </>);
}


const CharacterColumn = ({ character }: { character: Character }) => {
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);


  const { filteredAttributes, attributesIsLoading, attributesError,
    filteredProgresses, progressesIsLoading, progressesError,
    filteredActions, actionsIsLoading, actionsError,
  } = useGetCharacterInfo(character.id);


  function del(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    dispatch(
      deleteCharacter({
        id: character.id
      })
    );
  }


  return (<>

    <div className='backdrop-blur-md bg-white bg-opacity-60 border-slate-900 border-2 shadow-sm shadow-slate-900 w-72 max-h-[100%] min-h-0 flex h-fit flex-col flex-grow-0 hover:bg-slate-200'>

      <CharacterName>
        <div className='basis-8/12 text-left p-2'>
          {character.name}
        </div>
        <Button variant={'ghost'}
          className='text-center basis-2/12 w-full h-full '
          type='button' onClick={(e) => setShowEditModal(true)}>
          <Pencil size={24} />
        </Button>
        <Button variant={'ghost'}
          className='text-center basis-2/12 w-full h-full '
          type='button' onClick={(e) => setShowDeleteModal(true)}>
          <Trash size={24} />
        </Button>
      </CharacterName>



      <div className='flex flex-col overflow-y-scroll overflow-x-hidden text-slate-950'>

        <div className="basis-0 flex flex-col justify-start px-4 gap-4 py-4">
          {attributesIsLoading ? <AttributesLoading /> : <Attributes attributes={filteredAttributes} />}
          {actionsIsLoading ? <ActionsLoading /> : <Actions actions={filteredActions} />}
          {progressesIsLoading ? <ProgressesLoading /> : <Progresses progresses={filteredProgresses} />}
        </div>
      </div>
    </div>
    {showEditModal && <CharacterFormModal character={character}
      show={showEditModal}
      onClose={(e) => setShowEditModal(false)}
      onAbort={(e) => setShowEditModal(false)}
    />}
    {showDeleteModal && <Modal show={showDeleteModal}
      title={`Delete character "${character.name}"?`}
      onClose={(e) => setShowDeleteModal(false)}
      onAbort={(e) => setShowDeleteModal(false)}
      onConfirm={(e) => { del(e); setShowDeleteModal(false) }}
    >
      <div>
        Do you want to delete the character "{character.name}"?
      </div>
      <div>
        This action will not be reversable!
      </div>
    </Modal>}
  </>);
}

export const CharacterColumnLoading = () => {
  return (<>
    <div className='backdrop-blur-md bg-white bg-opacity-60 border-slate-900 border-2 shadow-sm shadow-slate-900 w-72 max-h-[100%] min-h-0 flex h-fit flex-col flex-grow-0 hover:bg-slate-200'>
      <CharacterNameLoading>
        <div className='basis-8/12 text-left p-2 h-full'>
          <TextLoading > <div className='bg-slate-50 h-full w-full rounded-sm' /> </TextLoading>
        </div>
        <div
          className='text-center basis-2/12 w-full h-full '
        >
          <TextLoading > <div className='bg-slate-50 h-full w-full rounded-sm' /> </TextLoading>
        </div>
        <div
          className='text-center basis-2/12 w-full h-full '
        >
          <TextLoading > <div className='bg-slate-50 h-full w-full rounded-sm' /> </TextLoading>
        </div>
      </CharacterNameLoading>
      <div className='flex flex-col overflow-y-scroll overflow-x-hidden text-slate-950'>

        <div className="basis-0 flex flex-col justify-start px-4 gap-4 py-4">
          <AttributesLoading />
          <ActionsLoading />
          <ProgressesLoading />
        </div>
      </div>
    </div>
  </>);
}

export default CharacterColumn;

export const CharacterFormModal = ({ show, onClose, onAbort, character }) => {
  const title = character ? 'Edit character' : 'Create character';
  const [name, setName] = useState(character?.name ?? '');
  const dispatch = useDispatch();
  const attributesRef = useRef(null);
  const actionsRef = useRef(null);
  const progressesRef = useRef(null);

  const characterId = nanoid();

  const onConfirm = e => {
    e.preventDefault();
    if (name === '') return;
    attributesRef.current!.click();
    actionsRef.current!.click();
    progressesRef.current!.click();
    if (character !== undefined && character !== null) {
      dispatch(editCharacter({
        id: character.id,
        name: name
      }));
    }
    else {
      dispatch(addCharacter({
        id: characterId,
        name: name
      }))
    }
    onClose();
  };
  return (<>
    <Modal title={title} show={show} onClose={onClose} onAbort={onAbort} onConfirm={onConfirm} >
      <form onSubmit={onConfirm}>
        <div className='flex flex-col gap-8'>
          <section className='basis-0 flex-grow flex flex-row justify-start gap-2 px-8 '>
            <label htmlFor="char-name" className='min-w-fit basis-0 flex-grow text-2xl font-bold'>Character Name</label>
            <input type="text" name="char-name" id="char-name"
              value={name}
              onChange={(e) => { e.preventDefault(); setName(e.target.value) }}
              className={`basis-2/4 flex-grow shadow-inner rounded-sm border text-2xl border-slate-400 bg-transparent w-full`}
            />
          </section>
          <div className='flex flex-row gap-8 px-8 justify-between flex-wrap min-w-full'>
            <section className="basis-2/5 grow">
              <CharacterFormAttributeColumn character={character ?? { id: characterId, name: '' }} ref={attributesRef} />
            </section>
            <section className="basis-2/5 grow">
              <CharacterFormActionColumn character={character ?? { id: characterId, name: '' }} ref={actionsRef} />
            </section>
            <section className="basis-full">
              <CharacterFormProgressColumn character={character ?? { id: characterId, name: '' }} ref={progressesRef} />
            </section>
          </div>
        </div>

      </form>
    </Modal>
  </>);
}