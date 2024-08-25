import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { ConvertResponse, Currency, CurrencyResponse } from "../types/currency";
import Select from "./CurrencySelect";
import Input from "./Input";
import useDebouncedValue from "../hooks/debounce";

const Conventer = () => {
    const [from, setFrom] = useState<string>('')
    const [fromAmount, setFromAmount] = useState<string>('');
    const [to, setTo] = useState<string>('');
    const [toAmount, setToAmount] = useState<string>('')
    const [currencies, setCurrencies] = useState<Currency[]>([]);

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
            setValue(data.response.value.toString());
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
    </>)
}

export default Conventer;
