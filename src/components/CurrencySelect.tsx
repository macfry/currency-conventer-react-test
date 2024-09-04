import { Dispatch, SetStateAction } from "react";
import { Currency } from "../types/currency";

interface SelectProps {
    selected: string;
    setSelected: Dispatch<SetStateAction<string>>;
    options: Currency[];
    label: string;
}

const Select = ({ selected, setSelected, options, label }: SelectProps) => {
    return (<>
        <label htmlFor={`select-${label.replace(' ', '-')}`}>{label}</label>
        <select
            id={`select-${label.replace(' ', '-')}`}
            value={selected}
            onChange={e => setSelected(e.target.value)}
        >
            <option value={""}>Choose option</option>
            { options.map(({ short_code, name }) => <option value={short_code} key={short_code}>{ name } ({short_code})</option>)}
        </select>
    </>);
}

export default Select;
