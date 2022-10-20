import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionComponent } from './question/question.component';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { SubjectComponent } from './subject/subject.component';

const routes: Routes = [
  {path:'', redirectTo: '/subjects', pathMatch: 'full'},
  {path:'subject', children : [
    {path: ':Sid', component: SubjectComponent},
    {path: ':Sid/question/:Qid', component: QuestionComponent},
  ]},
  {path:'subjects', component: SubjectListComponent},
  // {path: 'subject/:id/question/:id', component: QuestionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }