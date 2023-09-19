export const ProgressBar = ({ value, min, max }: { value: number, min: number, max: number }) => {
    const perc = Math.floor((value - min) * 100 / (max - min));
    return (<>
        <div className='flex flex-row justify-between my-2 gap-10'>
            <div className="flex-grow flex flex-row justify-between px-1 text-center">
                <div className="basis-1/3 flex-grow">{min}</div>
                <div className="basis-1/3 flex-grow">{value}</div>
                <div className="basis-1/3 flex-grow">{max}</div>
            </div>
            <div><b>({perc}%)</b></div>

        </div>
        <div className='w-full h-2 mb-2 bg-gray-300 rounded-md' >
            <div className={`${perc <= 33 ? 'bg-red-400' : perc <= 66 ? 'bg-yellow-400' : perc < 100 ? 'bg-blue-400' : 'bg-green-400'} h-full text-white py-1 text-sm rounded-md transition-all ease-in-out`} style={{
                width: `${perc}%`
            }}>
            </div>
        </div>
    </>);

}