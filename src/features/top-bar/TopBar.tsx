import { useDispatch } from 'react-redux';
import { setAll as setAllCharacters } from '@/features/characters/charactersSlice';
import { setAll as setAllAttributes } from '@/features/attributes/attributesSlice';
import { setAll as setAllActions } from '@/features/actions/actionsSlice';
import { setAll as setAllProgresses } from '@/features/progresses/progressesSlice';
import { useEffect, useRef, useState } from 'react';
import { getCurrentTime, useGetAllData } from '@/app/utils';
import { Button } from '@/ui/Button';
import { updateSearch } from '@/features/top-bar/top-bar-slice';
import { QuestionMark, Search } from 'tabler-icons-react';
import { Modal } from '@/ui/Modal';
import { HelpBox } from './HelpBox';


export const TopBar = () => {
  const { characters, attributes, actions, progresses } = useGetAllData();
  const uploadRef = useRef(null);
  const dispatch = useDispatch();
  const [showHelpModal, setShowHelpModal] = useState(false);

  const downloadFile = () => {
    const exportData = {
      data: {
        characters: characters,
        attributes: attributes,
        actions: actions,
        progresses: progresses,
      }
    }
    // create file in browser
    const fileName = "gmpm-" + getCurrentTime();
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  const uploadFile = (e) => {
    e.preventDefault();
    uploadRef!.current!.click();
  }

  const uploadInputChanged = (e) => {
    e.preventDefault();
    const fileData = e.target.files[0];
    const reader = new FileReader();

    reader.readAsText(fileData);
    reader.addEventListener('load', () => {
      const data = (JSON.parse(reader.result as string)).data;
      const { characters, attributes, actions, progresses } = data;
      dispatch(setAllCharacters({ items: characters }));
      dispatch(setAllAttributes({ items: attributes }));
      dispatch(setAllActions({ items: actions }));
      dispatch(setAllProgresses({ items: progresses }));
    });

  }


  return (<>
    <div className='flex flex-row justify-between gap-4 px-8 py-4 bg-slate-950 shadow-2xl shadow-slate-800'>
      <div className='basis-7/12 flex-grow'>
        <SearchInput />
      </div>
      <input type='file' accept='.json'
        hidden
        onChange={uploadInputChanged}
        ref={uploadRef}
      />
      <div className='basis-1/12 flex-grow' />
      <Button variant={'top'} size={'top'} className='basis-1/12 flex-grow text-center ' onClick={uploadFile}>Import</Button>
      <Button variant={'top'} size={'top'} className='basis-1/12 flex-grow text-center ' onClick={downloadFile}>Export</Button>
      <Button variant={'top'} size={'top'}
        className='basis-0/12 max-w-fit max-h-fit text-md flex-grow p-2 font-bold '
        onClick={e => { setShowHelpModal(true) }}
      >
        <QuestionMark className='hover:scale-125 transition-all ease-in-out' size={24} strokeWidth={2} />
      </Button>

    </div>
    {showHelpModal && <Modal
      title="What's this?"
      show={showHelpModal}
      onClose={e => { setShowHelpModal(false) }}
      onConfirm={e => { setShowHelpModal(false) }}
    >
      <HelpBox />

    </Modal>}
  </>);
}


export const SearchInput = () => {

  const dispatch = useDispatch();
  const [searchQuery, setSearchQUery] = useState('');

  useEffect(() => {
    dispatch(updateSearch({
      search: searchQuery
    }))
  }, [dispatch, searchQuery]);

  const inputChanged = (e) => {
    e.preventDefault();
    const queryString = e.target.value;
    if (queryString === undefined || queryString === null) {
      setSearchQUery('');
    }
    else {
      setSearchQUery(queryString);
    }
  }

  return (<>
    <div className='flex flex-col justify-center'>

      <div className='flex gap-2 flex-row h-min-[8rem] w-full h-full px-8 bg-slate-100'>
        <div className='flex flex-col justify-center'>

          <div className='-ml-4 opacity-40 p-1'>

            <Search
              size={24}
              strokeWidth={2}
              color={'black'}
            />

          </div>
        </div>
        <div className='flex-1 py-1'>
          <input type="text" name="search" id="search" title='search' placeholder='E.g. "Weapon"'
            className='w-full h-full outline-none focus-within:border-current bg-slate-100'
            onChange={inputChanged}
          />
        </div>
      </div>
    </div>
  </>);
}