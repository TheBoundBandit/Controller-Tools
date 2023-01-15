import React, { useState } from 'react';
import PatternGraph from '../components/patternGraph';


export default function PatternCreator() {
    const [play, setPlay] = useState(false);

    const togglePlay = () => {
        setPlay(!play)
    }

    const [code, setCode] = useState({
        primary: '',
        readOut: ''
    });
    const [entry, setEntry] = useState([{
        type: 'speed',
        value: '0',
        unit: '%'
    },
    {
        type: 'duration',
        value: '5',
        unit: 'sec'
    },
    {
        type: 'transition',
        value: '1',
        unit: 'sec'
    },
    {
        type: 'speed',
        value: '5',
        unit: '%'
    },
    {
        type: 'duration',
        value: '0',
        unit: 'sec'
    }]);

    function handleChange(event) {
        const { name, value } = event.target;
        let type = name.match(/(speed|duration|transition|unit)(?=[\d]+)/gm)[0];
        let index = name.match(/(?<=speed|duration|transition|unit)[\d]+/gm)[0];
        index = Number(index);
        let newEntry = entry;
        if (type === 'unit') {
            newEntry[index].value = unitConversion(entry[index].unit, value, entry[index].value);
            newEntry[index].unit = value;
        }
        else {
            newEntry[index] = ({ ...entry[index], value: value });
        }
        setEntry(newEntry);
        setCode({ ...code, primary: generateCode(newEntry), readOut: generateCode(newEntry, true) });
    }

    function addSegment(event) {
        event.preventDefault();
        let newEntry = entry;
        newEntry.push({
            type: 'transition',
            value: '1',
            unit: 'sec'
        });
        newEntry.push({
            type: 'speed',
            value: `${entry[entry.length - 3].value}`,
            unit: `${entry[entry.length - 3].unit}`
        });
        newEntry.push({
            type: 'duration',
            value: '5',
            unit: 'sec'
        });

        setEntry(newEntry);
        setCode({ ...code, primary: generateCode(newEntry), readOut: generateCode(newEntry, true) });
    }

    function removeSegment(event) {
        event.preventDefault();
        let newEntry = entry;
        if (newEntry.length > 5) {
            newEntry.pop();
            newEntry.pop();
            newEntry.pop();
        }

        setEntry(newEntry);
        setCode({ ...code, primary: generateCode(newEntry), readOut: generateCode(newEntry, true) });
    }

    function generateCode(list, extended = false) {
        let newCode = extended ? 'Set the vibe to ' : '';
        list.forEach(item => {
            let val = '';
            if (item.type === 'speed') {
                val = extended ? `${item.value}` : `${item.value}`
                if (item.unit !== 'int') {
                    val = extended ? `${item.value}%` : unitConversion(item.unit, 'int', item.value);
                }
            }
            else if (item.type === 'duration') {
                //Convert to seconds
                val = extended ? ` for a duration of ${item.value} seconds ` : `|${item.value}`
            }
            else if (item.type === 'transition') {
                //Convert to seconds
                val = extended ? `then gradually switch to the next speed over ${item.value} second(s). ` : `[${item.value}]`
            }

            newCode += val;
        });
        return newCode;
    }

    function unitConversion(from, to, value) {
        let num = Number(value);
        let newValue;
        console.log(`Num: ${num}`)
        if (from === '%' && to === 'int') {
            console.log('% to Int')
            newValue = Math.round(num * 2.55);
        }
        else if (from === 'int' && to === '%') {
            console.log('Int to %')
            newValue = (num / 255) * 100
            //round to two decimals.
            newValue = Math.round((newValue + Number.EPSILON) * 100) / 100;
        }
        console.log(`RoundsTo: ${newValue}`)
        return `${newValue}`;
    }

    function getStep(itemType) {
        switch (itemType) {
            case '%':
                return 'any'
            default:
                return '1'
        }
    }

    function getMax(itemType) {
        switch (itemType) {
            case '%':
                return '100.00'
            case 'int':
                return '255'
            default:
                return '99999'
        }
    }

    return (
        <main>
            <h2>Pattern Creator</h2>
            <div>Code Text: {code.primary}</div>
            {/* <div>Read Out: {code.readOut}</div> */}
            <form>
                {(entry || []).map((item, index) => (
                    <div key={index} className={`${item.type}-container input-container`}>
                        {item.type === 'speed' ? <div className='label'> Speed </div> : <></>}
                        {item.type === 'duration' ? <div className='label'> Duration </div> : <></>}
                        {item.type === 'transition' ? <div className='label'> Transition </div> : <></>}
                        <input key={`value${index}`} className={item.type} name={`${item.type}${index}`} value={item.value} type='number' min='0' max={getMax(item.unit)} step={getStep(item.unit)} onChange={handleChange} autoComplete='off' />
                        <select key={`unit${index}`} name={`unit${index}`} onChange={handleChange} value={item.unit}>
                            {item.type === 'speed' ? <option key={`${index}UnitChoice1`} value='int'>Int</option> : <></>}
                            {item.type === 'speed' ? <option key={`${index}UnitChoice2`} value='%'>%</option> : <></>}
                            {item.type === 'duration' ? <option key={`${index}UnitChoice1`} value='sec'>Sec</option> : <></>}
                            {item.type === 'transition' ? <option key={`${index}UnitChoice1`} value='sec'>Sec</option> : <></>}
                        </select>
                    </div>
                ))}
                <div className='btnGroup-vert'>
                    <button className='addBtn'onClick={addSegment}>+</button>
                    <button className='rmvBtn' onClick={removeSegment}>-</button>
                </div>
            </form>
            <PatternGraph entries={entry} play={play} />
            {!play ? <button className='playBtn' onClick={togglePlay}>&#9658;</button> : <button className='playBtn' onClick={togglePlay}>&#11035;</button>}
        </main>
    );
}