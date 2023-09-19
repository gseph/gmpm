import { TopBar } from "@/features/top-bar/TopBar";
import { DiceRollerWindow } from "@/features/dice-roll-history/DiceRollerWindow";
import { ReactNode } from "react";

const Layout = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <div className='flex flex-row h-screen'>
        <div className="z-10 max-w-[16rem] shadow-slate-100 border-r-2 border-slate-800">
          <DiceRollerWindow />
        </div>
        <div className='flex flex-col flex-1 overflow-auto'>
          <TopBar />
          <div className='flex flex-row flex-1 overflow-auto'>
            <div className="flex-1">
              {children}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}


export default Layout;