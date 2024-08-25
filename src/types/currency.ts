interface Meta {
    code: number;
    disclaimer: string;
}

export interface Currency {
    code: string;
    decimal_mark: string
    id: number;
    name: string;
    precision: number;
    short_code: string;
    subunit: number;
    symbol: string;
    symbol_first: boolean;
    thousands_separator: string;
}

export interface CurrencyResponse extends Array<Currency> {
    meta: Meta;
    response: Currency[];
}



interface Convert {
    amount: string;
    date: string;
    from: string;
    timestamp: number;
    to: string;
    value: number;
}

export interface ConvertResponse extends Convert {
    meta: Meta;
    response: Convert;
}