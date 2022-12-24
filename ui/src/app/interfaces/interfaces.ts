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
    question_id: number,
    list_id: number, 
    user_id: number, 
    edit_date: string, 
    question_order: number, 
    question_title: string, 
    question_body: string, 
    is_deleted: boolean
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
    members: user[],
    lists: list[]
}

export interface Faculty{
    faculty_id: number,
    faculty_name: string,
}

export interface Program{
    program_id: number,
    program_name: string,
}