import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { concatMap, tap } from 'rxjs';
import { Faculty, Group, list, Program, subject, user } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { InfoService } from 'src/app/services/info.service';
import { ListService } from 'src/app/services/list.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
    selector: 'group',
    templateUrl: 'group.component.html',
    styleUrls: ['./group.component.less', '../subject/subject.component.less']
})

export class GroupComponent implements OnInit {

    group?: Group;
    user?: user;
    groupCreation = false;
    listCreation = false;
    newGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        course: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(50)]),
        faculty: new FormControl(null, Validators.required),
        program: new FormControl(null, Validators.required)
    })

    newList = new FormGroup({
        name: new FormControl('', Validators.required),
        subject: new FormControl(null, Validators.required),
        public: new FormControl(false),
        semester: new FormControl(1, [Validators.required, Validators.min(0)])
    })
    faculties: Faculty[] = [];
    programs: Program[] = [];
    subjects: subject[] = [];
    constructor(
        private groupService: GroupService,
        private infoService: InfoService,
        private listService: ListService,
        private auth: AuthService,
        private subjectService: SubjectService
    ) { 
        auth.currentUser.subscribe(u => this.user = u ? u : undefined)
        if(this.user && this.user.group_id){
            groupService.getGroup().subscribe(gr => this.group = gr);
        }
        this.infoService.getFaculties().subscribe(res => this.faculties = res);
        this.infoService.getPrograms().subscribe(res => this.programs = res);
        this.subjectService.getSubjects().subscribe(res => this.subjects = res);
    }

    ngOnInit() { }
    onNewGroup(){
        const controls = this.newGroup.controls;
        this.groupService.postGroup({
            group_name: controls.name.value,
            course: controls.course.value,
            faculty_id: controls.faculty.value,
            program_id: controls.program.value
        } as any).subscribe(res => window.location.reload())

    }
    onCreation(){
        this.groupCreation = true;
    }

    getFaculty(id: number){
        return this.faculties.find(f => f.faculty_id == id)?.faculty_name
    }
    getProgram(id: number){
        return this.programs.find(p => p.program_id == id)?.program_name
    }
    getSubj(id: number){
        return this.subjects.find(p => p.subject_id == id)?.subject_name
    }
    getAdmin(){
        return !!this.user && !!this.group && this.user.user_id == this.group.group_admin;
    }
    addList(){
        if(!this.group) return;
        const controls = this.newList.controls;
        this.listService.createList({
            list_name: controls.name.value,
            is_public: controls.public.value,
            semester: controls.semester.value,
            subject_id: controls.subject.value,
            group_id: this.group.group_id
        } as any).subscribe((res: any) => {
            this.newList.reset();
            this.listCreation = false;
            this.listService.getList(res.id, true).subscribe(res => this.group?.lists.push(res));
        })
    }

    onEditGroup(){
        if(!this.group) return;
        this.groupCreation = true;
        this.newGroup.patchValue({
            name: this.group.group_name,
            course: this.group.course || 1
        })
    }

    onSaveGroup(){
        if(!this.group) return;
        const updated = {...this.group, group_name: this.newGroup.controls.name.value, course: this.newGroup.controls.course.value};
        
        this.groupCreation = false;
        this.groupService.editGroup(this.group.group_id, {
            group_name: this.newGroup.controls.name.value,
            course: this.newGroup.controls.course.value
        }).subscribe(res=> window.location.reload())
    }
}