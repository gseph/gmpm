import { ReactNode } from "react";

export const TextLoading = ({ children }: {children?: ReactNode}) => {
    return (<>
        <div className="animate-pulse rounded-md h-full w-full">
            {children}
        </div>
    </>);
}