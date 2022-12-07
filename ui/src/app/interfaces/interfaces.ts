export interface subject{
    name: string,
    id: number
    }

export interface list{
    id: number,
    // group_id: number,
    group_name: string,
    subject_id: number,
    subject_name: string,
    name: string,
    // is_public: boolean,
    semestr?: number
    }

export interface question{
    id: number,
    name: string,
    list_id: number,
    last_change: string,
    order: number,
    body: string,
    }