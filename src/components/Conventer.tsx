import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { ConvertResponse, Currency, CurrencyResponse } from "../types/currency";
import Select from "./CurrencySelect";
import Input from "./Input";
import useDebouncedValue from "../hooks/debounce";

interface ConvertHistory {
    from: string;
    fromAmount: string;
    to: string;
    toAmount: string;
}

const Conventer = () => {
    const [from, setFrom] = useState<string>('')
    const [fromAmount, setFromAmount] = useState<string>('');
    const [to, setTo] = useState<string>('');
    const [toAmount, setToAmount] = useState<string>('')
    const [currencies, setCurrencies] = useState<Currency[]>([]);

    const [history, setHistory] = useState<ConvertHistory[]>([]);

    const setNewHistory = (from: string, to: string, fromAmount: string, toAmount: string, maxHistory: number = import.meta.env.VITE_MAX_HISTORY_NUMBER) => {
        const data = { from, fromAmount, to, toAmount};
        setHistory((prev) => [data, ...prev.slice(0, maxHistory - 1)]);
    };

    const debouncedFromAmount = useDebouncedValue(fromAmount, 500);

    const fetchCurrencies = useCallback(async (signal: AbortSignal) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/currencies?api_key=${import.meta.env.VITE_API_KEY}&type=fiat`, { signal });
            const data: CurrencyResponse = await response.json();
            setCurrencies(data.response);
        } catch (err: unknown) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchCurrencies(controller.signal)

        return () => controller.abort();
    }, [fetchCurrencies]);

    const getRates = useCallback(async (from: string, to: string, amount: string, setValue: Dispatch<SetStateAction<string>>, signal: AbortSignal) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/convert?api_key=${import.meta.env.VITE_API_KEY}&from=${from}&to=${to}&amount=${amount}`, { signal });
            const data: ConvertResponse = await response.json();
            const toAmount = data.response.value.toString();
            setValue(toAmount);
            setNewHistory(from, amount, to, toAmount);
        } catch (err: unknown) {
            console.log(err);
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController();

        if (from && to && from === to) {
            setToAmount(fromAmount);
            return;
        }
       
        if (debouncedFromAmount && from && to) {
            getRates(from, to, debouncedFromAmount, setToAmount, controller.signal);
        }

        return () => controller.abort();
    }, [debouncedFromAmount, from, fromAmount, to, getRates]);

   
    return (<>
        <Select selected={from} setSelected={setFrom} options={currencies} label={'From'} />
        <Input setValue={setFromAmount} value={fromAmount} />
        <br/>
        <Select selected={to} setSelected={setTo} options={currencies} label={'To'} />
        <Input setValue={setToAmount} value={toAmount} readOnly={true} />
        <br/>


        { !!history.length && <>
            History:
            { history.map(({ from, fromAmount, to, toAmount }) => <p key={`${fromAmount}${from}-${toAmount}${to}`}>From: {fromAmount} {from} - To: {toAmount} {to}</p>)}
        </> }
    </>)
}

export default Conventer;
