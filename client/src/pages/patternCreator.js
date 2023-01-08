import React, { useState } from 'react';

export default function PatternCreator() {
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
        value: '0',
        unit: '%'
    },
    {
        type: 'duration',
        value: '0',
        unit: 'sec'
    }]);

    function handleChange(event){
        const { name, value } = event.target;
        let type = name.match(/(speed|duration|transition|unit)(?=[\d]+)/gm)[0];
        let index = name.match(/(?<=speed|duration|transition|unit)[\d]+/gm)[0];
        index = Number(index);
        let newEntry = entry;
        if (type === 'unit') {
            newEntry[index].value = unitConversion(entry[index], value, entry[index].value);
            newEntry[index].unit = value;
        }
        else {
            newEntry[index] = ({ ...entry[index], value: value });
        }
        setEntry(newEntry);
        console.log(entry);
    }

    function addSegment(event){
        event.preventDefault();
        let newEntry = entry;
        newEntry.push({
            type: 'transition',
            value: '1',
            unit: 'sec'
        });
        newEntry.push({
            type: 'speed',
            value: `${entry[entry.length-1].value}`,
            unit: `${entry[entry.length-1].unit}`
        });
        newEntry.push({
            type: 'duration',
            value: '5',
            unit: 'sec'
        });

        setEntry(newEntry);
    }

    function generateCode() {
        let newCode = '';
        entry.forEach(item => {
            let val = '';
            if (item.type === 'speed') {
                val = `${item.value}`
                if (item.unit !== 'int') {
                    val = unitConversion(item.unit, 'int', item.value);
                }
            }
            else if (item.type === 'duration') {
                //Convert to seconds
                val = `|${item.value}`
            }
            else if (item.type === 'transition') {
                //Convert to seconds
                val = `[${item.value}]`
            }

            newCode += val;
        });
        return newCode;
    }

    function unitConversion(from, to, value) {
        let num = Number(value);
        let newValue;
        if (from === '%' && to === 'int') {
            newValue = Math.round(num * 2.55);
        }
        else if (from === 'int' && to === '%') {
            newValue = (num / 255) * 100
            //round to two decimals.
            newValue = Math.round((newValue + Number.EPSILON) * 100) / 100;
        }
        return `${newValue}`;
    }

    function getStep(itemType){
        switch (itemType) {
            case '%':
                return '0.01'
            default:
                return '1'
        }
    }

    function getMax(itemType){
        switch (itemType) {
            case '%':
                return '100'
            case 'int':
                return '255'
            default:
                return '99999'
        }
    }

    return (
        <main>
            <h2>Pattern Creator</h2>
            <div>Code Text: {generateCode()}</div>
            <form>
                {(entry || []).map((item, index) => (
                    <>
                    <input key={index} className={item.type} name={`${item.type}${index}`} type='number' min='0' max={getMax(item.unit)} step={getStep(item.unit)} onChange={handleChange} autoComplete='off'/>
                    <select key={`unit${index}`} name={`unit${index}`} onChange={handleChange} value={item.unit}>
                        {item.type === 'speed' ? <option key={`${index}UnitChoice1`} value='int'>Int</option> : <></>}
                        {item.type === 'speed' ? <option key={`${index}UnitChoice2`} value='%'>%</option> : <></>}
                        {item.type === 'duration' ? <option key={`${index}UnitChoice1`} value='sec'>Sec</option> : <></>}
                        {item.type === 'transition' ? <option key={`${index}UnitChoice1`} value='sec'>Sec</option> : <></>}
                    </select>
                    </>
                ))}
                <button onClick={addSegment}>+</button>
            </form>
        </main>
    );
}