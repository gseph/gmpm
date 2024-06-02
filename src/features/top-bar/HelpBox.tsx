import { useState } from 'react';
import { Pencil, Plus, Trash } from 'tabler-icons-react';

const Collapsable = ({ title, children, ...props }) => {
    const [collapsed, setCollapsed] = useState(false);
    return (<>
        <div className='flex flex-col gap-4 min-h-0 max-h-full h-fit justify-start border-2 border-slate-700'>

            <h2 className='hover:cursor-pointer hover:underline w-full px-2 py-4 text-left bg-slate-700 text-slate-50'
                onClick={e => { setCollapsed(prev => !prev) }}>
                {title}
            </h2>

            {collapsed ? null : <div className='p-2'>
                {children}
            </div>}
        </div>
    </>)
}

export const HelpBox = () => {
    return (<>
        <div className='px-4 py-2'>

            <h1 className='pb-0'>GMPM - Game Master's Party Manager</h1>
            <h3 className='text-slate-800 pt-0 pb-2'>The system-agnostic fine addition to your game master screen</h3>
            <p className='py-1'>
                This tool is meant to be used as a helper in order to quickly visualize and manage your TTRPG party.
                Everything is stored in the local storage of your browser, so you won't have to worry about manually saving.
                An import and export functionality is provided anyway.
                Beware that using incognito mode by default inhibits the persistence of the local storage between sessions: if you close the browser, data will be lost.
            </p>
            <div className='flex flex-col gap-8 pt-2 justify-start'>
                <section>

                    <Collapsable title={'Main flow'} >
                        <p className='py-1'>
                            Click the
                            <Plus className='inline mx-1 p-1 rounded-full bg-slate-950 text-slate-50' />
                            icon to open the character creator. Select the character's name and start adding stuff!
                        </p>
                        <p className='py-1'>
                            When creating or editing a character, you can mark items as deleted using the
                            <Trash className='inline mx-1 p-1 rounded-full' />
                            icon. The item will be deleted once you click the Confirm button.
                        </p>
                        <p className='py-1'>
                            To edit an existing character, click the
                            <Pencil className='inline mx-1 p-1 rounded-full' />
                            icon near the name of the character, on the character card.
                            By clicking the
                            <Trash className='inline mx-1 p-1 rounded-full' />
                            icon you can delete the character.
                        </p>
                        <h3 className='py-2'>Characters</h3>
                        <p className='py-1'>
                            <strong>A character</strong> is nothing more that an entity in your game. It might represent a player character, the whole party, an NPC, a faction and so on.
                        </p>
                        <h3 className='py-2'>Attributes</h3>
                        <p className='py-1'>
                            <strong>Attributes</strong> are meant to represent character's "stats", for example the passive perception score, the sanity score and anything that comes to your mind.
                        </p>
                        <h3 className='py-2'>Actions</h3>
                        <p className='py-1'>
                            <strong>Actions</strong> are meant to be "things that player characters can do".
                            For example, swinging a sowrd at an enemy, trying to convince someone and so on.
                            The obvious assumption is that GMs won't use this feature that much since these kind of things are completely
                            in the hands of players (<strong>as they should</strong>).
                            Nontheless, I believe that it's good to have the chance to do some things behind the screen, as the GM sees fit.
                            An action is composed of a formula in standard dice notation. When you execute the action, the die is tossed.
                        </p>
                        <h3 className='py-2'>Progresses</h3>
                        <p className='py-1'>
                            <strong>Progresses</strong> are the main concept that spawned the whole idea for this tool.
                            It's a way to represent and advance the state of something related to a character.
                            The state changes based on a die toss defined by a formula in standard dice notation and can go both in a positive or negative direction.
                            For example, you can define the progress for a character's affinity with a faction. Let's explore twi examples, starting with the faction affinity one.
                        </p>    <ul className='list-disc list-inside py-2'>
                            <li>
                                Let's say that you want to track the affinity for a character with the elves of Rivendell. You set the dice formula, let's say it's "1d20" (meaning "toss 1 die with 20 sides").
                                Now, as a lower bound you could set -100 and upper bound to 100. You set the starting point and the current value to 0.
                                The starting value is used to reset the progresses.
                                If the character does something to gain affinity with the faction, you can roll the die (or dice) going in a positive direction. You can roll the die in a negative direction otherwise.
                                If you want to reset the value, you'll have a button to do so.
                            </li>
                            <li>
                                Let's explore another example: the character's weapon durability.
                                Set the progress name to "Weapon durability", you could set the upper bound to 100 and lower bound to 0. The starting value and current value to 100 to represent a newly bought weapon.
                                Chose the dice formula that you feel fits best, let's say, for example, it's "2d8".
                                Now, everytime the weapon gets damaged, you could roll in a negative direction and the tool will subtract the outcome of 2d8 dice roll from the current value.
                                If the caracter fixes their weapon you could reset the value to the starting point (which is 100).
                            </li>
                        </ul>
                    </Collapsable>
                </section>
                <section>
                    <Collapsable title={'Free dice window'}>
                        <p className='py-1'>
                            Every roll (up to 50) is stored in the left dice window.
                            You can also use the text input to write a dice formula and press ENTER to roll it.
                        </p>
                    </Collapsable>
                </section>
                <section>
                    <Collapsable title={'Search bar, Import and Export'}><p className='py-1'>
                        The search bar can be used to filter out items based on the input text.
                        You can use the Import and Export buttons to extract and load the tool json data. USeful if you want to switch browser or are not saving data to local storage for whatever reason.
                    </p>
                    </Collapsable>
                </section>

                <section>
                    <Collapsable title={'Known issues'}>
                        <p className='py-1'>
                            The GMPM tool is not perfect and is actively in development. While the tool is mostly usable, there are a few issues I'm aware about. I'm working on it, don't worry.
                        </p>
                        <ul className='list-disc list-inside py-2'>
                            <li>Long dice results are cut from the left box and only the final result is visible, while some of the single dice results are not.</li>
                            <li>When in character creation or edit, pressing ENTER will result in strange saving behaviour. Manually click the Confirm button to save.</li>
                            <li>There is no check on values for progresses being between lower and upper bounds.</li>
                        </ul>
                    </Collapsable>
                </section>

            </div>
        </div>
    </>);
}


