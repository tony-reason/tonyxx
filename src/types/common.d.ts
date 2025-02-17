type Id = number;
type AnyFunction = (...args: any[]) => any;
type Url = URL | string;

interface TObject<ValueType> {
    [key: string]: ValueType
}
