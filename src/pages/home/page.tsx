import { useEffect } from 'react'
import CharacterColumn, { CharacterColumnLoading } from '@/features/characters/ui';
import { useDispatch, useSelector } from 'react-redux';
import { fetch as fetchCharacters, getCharacters, getCharactersError, getCharactersIsLoading } from '@/features/characters/charactersSlice';
import { fetch as fetchAttributes } from '@/features/attributes/attributesSlice';
import { fetch as fetchProgresses } from '@/features/progresses/progressesSlice';
import { fetch as fetchActions } from '@/features/actions/actionsSlice';
import Layout from './layout';
import { AddCharacter } from './AddCharacter';
import { MoodSad } from 'tabler-icons-react';

export const MainView = () => {
  const dispatch = useDispatch()
  const characters = useSelector(getCharacters);
  const isLoading = useSelector(getCharactersIsLoading);
  const error = useSelector(getCharactersError);


  useEffect(() => {
    dispatch(fetchCharacters());
    dispatch(fetchAttributes());
    dispatch(fetchProgresses());
    dispatch(fetchActions());
  }, [dispatch])

  const renderCharacters = (<>
    {characters.map((character, i) => {
      return <CharacterColumn key={'character-' + i} character={character} />
    })}
    <AddCharacter />
  </>);

  const renderCharactersOrError = (<>
    {error === '' ? renderCharacters : 
    <div className='text-2xl flex flex-row gap-2 justify-center items-center align-middle text-center'>
      <div>Error</div>
      <div>
        <MoodSad size={96} strokeWidth={2}/>
      </div>
    </div>}
  </>);

  const renderLoading = (<>
    {Array(20).fill(0).map((_, i) => {
      return <CharacterColumnLoading key={'character-loading-' + i} />
    })}
  </>)

  return (
    <>
      <Layout>

        <div className='h-full max-w-[100%] p-4 -ml-4'>
          <div className='flex flex-row h-full gap-4 p-4 overflow-auto overflow-x-scroll overflow-y-scroll'>
            {isLoading ? renderLoading : renderCharactersOrError}
          </div>
        </div>

      </Layout>
    </>
  )
}
