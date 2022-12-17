export interface subject{
    subject_name: string,
    subject_id: number
    }

export interface list{
    list_id: number,
    group_id?: number,
    group_name: string,
    subject_id: number,
    subject_name: string,
    list_name: string,
    is_public: boolean,
    semester?: number
    }

export interface question{
    id: number,
    name: string,
    list_id: number,
    last_change: string,
    order: number,
    body: string,
    }

export interface user{
    id: number,
    name: string,
    Lastname: string,
    Fname: string,
    group_id: number,
    sid: string
}