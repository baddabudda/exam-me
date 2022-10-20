export interface person{
    id: string,
    name: string,
    login: string,
    password: string,
    group?: string,
}

export interface question{
    id: string,
    name: string,
    aouthor: string[],
    date_create: Date,
    answer?: string
}

export interface subject{
    id: string,
    name: string,
    question_List: question[]
}