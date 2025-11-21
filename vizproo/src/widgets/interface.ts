interface BaseParams {
    description: string;
}

export interface BaseTextParams extends BaseParams {
    value: string;
    placeholder: string;
    disabled: boolean;
}

export interface BaseTextInputParams extends BaseTextParams {
    setValue: (value: string) => void;
}


export interface ButtonParams extends BaseParams {
    disabled: boolean;
    setClicked: () => void;
}

export interface CheckboxParams extends BaseParams {
    setChecked: (state: { checked: boolean }) => void;
}

export interface DataRecord {
    [key: string]: any;
}
export interface DropdownParams extends BaseParams {
    data: DataRecord[];
    variable: string;
    options: string[];
    value: string;
    disabled: boolean;
    setValue: (value: string) => void;
}
export interface MarginParams {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export interface RangeSliderParams extends BaseParams {
    data: any[],
    variable: string,
    step: number,
    fromValue: number,
    toValue: number,
    minValue: number,
    maxValue: number,
    setValues: (from: number, to: number) => void,
    setMinMax: (min: number, max: number) => void,
    margin: MarginParams
}


export interface SelectColorParams {
    description: string;
    selectedPalette: string;
    selectedNumColors: number;
    disabled: boolean;
    setPaletteChanged: () => void;
}
