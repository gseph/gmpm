import { ReactNode } from "react";
import { Button } from "./Button";
import { X } from "tabler-icons-react";

export const Modal = ({ title, show, onClose, onAbort, onConfirm, children }:
  { show: boolean, children?: ReactNode, title?: string }) => {

  function close(e) {
    if (e.target.id === 'modal') {
      return onClose(e);
    }

  }
  if (show === false) {
    return <></>;
  }
  return (<>
    <div id='modal' className="fixed w-screen h-screen inset-0 flex flex-row items-center justify-center bg-black backdrop-blur-sm bg-opacity-20 p-12 z-50"
      onClick={close}
    >
      <div className="flex flex-col justify-center min-h-0 max-h-full h-fit min-w-0 max-w-full w-fit">
        <div className="flex-grow flex flex-col basis-1/3 justify-between max-w-full gap-2 bg-white max-h-full w-full min-h-0 h-fit">

          <div className="flex flex-row justify-between gap-2 bg-slate-900 text-slate-50 px-4 py-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <Button
              onClick={onClose}
            >
              <X size={24} />

            </Button>
          </div>
          <div className="h-[80%] p-4 overflow-auto">
            <div className="h-fit">
              {children}
            </div>
          </div>
          <div className='flex basis-0 justify-end gap-16 px-16 bg-slate-50 text-slate-950 py-2'>
            {onAbort !== undefined ?
              <Button
              variant={'secondary'} size={'main'}
                onClick={onAbort}
              >
                Cancel
              </Button>
              : null}

            <Button
              variant={'primary'} size={'main'}
              onClick={onConfirm}
            >
              {onAbort !== undefined ? 'Confirm': 'Ok'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </>);

}