import React, { useState } from 'react';

export default function PatternCreator() {
    const [entry, setEntry] = useState([{
        type: 'speed',
        value: '0',
        unit: '%'
    },
    {
        type: 'duration',
        value: '0',
        unit: 'sec'
    },
    {
        type: 'transition',
        value: '0',
        unit: 'sec'
    }]);

    function handleChange(event) {
        const { name, value } = event.target;
        let type = name.match(/(speed|duration|transition|unit)(?=[\d]+)/gm)[0];
        let index = name.match(/(?<=speed|duration|transition|unit)[\d]+/gm)[0];
        index = Number(index);
        let newEntry = entry;
        if (type == 'unit') {
            newEntry[index].value = unitConversion(entry[index], value, entry[index].value);
            newEntry[index].unit = value;
        }
        else {
            newEntry[index] = ({ ...entry[index], ['value']: value });
        }
        setEntry(newEntry);
        //console.log(entry);
    }

    function generateCode() {
        let code = '';
        entry.forEach(item => {
            let val = '';
            if (item.type == 'speed') {
                val = `${item.value}`
                if (item.unit != 'int') {
                    val = unitConversion(item.unit, 'int', item.value);
                }
            }
            else if (item.type == 'duration') {
                //Convert to seconds
                val = `|${item.value}`
            }
            else if (item.type == 'transition') {
                //Convert to seconds
                val = `[${item.value}]`
            }

            code += val;
        });
        return code;
    }

    function unitConversion(from, to, value) {
        let num = Number(value);
        let newValue;
        if (from == '%' && to == 'int') {
            newValue = Math.round(num * 2.55);
        }
        else if (from == 'int' && to == '%') {
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

    return (
        <main>
            <h2>Pattern Creator</h2>
            <div>Code Text: {generateCode()}</div>
            <form>
                {(entry || []).map((item, index) => (
                    <>
                    <input key={index} className={item.type} name={`${item.type}${index}`} type='number' min='0' step={getStep(item.unit)} onChange={handleChange} autoComplete='off'/>
                    <select name={`unit${index}`} onChange={handleChange}>
                        {item.type == 'speed' ? <option value='int'>Int</option> : <></>}
                        {item.type == 'speed' ? <option value='%'>%</option> : <></>}
                        {item.type == 'duration' ? <option value='sec'>Sec</option> : <></>}
                        {item.type == 'transition' ? <option value='sec'>Sec</option> : <></>}
                    </select>
                    </>
                ))}
            </form>
        </main>
    );
}