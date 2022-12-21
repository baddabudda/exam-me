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
    user_id: number,
    vk_id: number,
    user_fname: string,
    user_lname: string,
    user_pname: string,
    status: boolean
    group_id: number,
}

export interface Group{
    group_id: number,
    faculty_id: number,
    program_id: number,
    group_admin: number,
    group_name: string,
    course: number,
}