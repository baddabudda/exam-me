import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnswerComponent } from './components/answer/answer.component';
import { GroupComponent } from './components/group/group.component';
import { JoinComponent } from './components/join.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { QuestionComponent } from './components/question/question.component';
import { SubjectComponent } from './components/subject/subject.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  {path:"", redirectTo:"welcome", pathMatch: 'full'},
  {path:"welcome", component:WelcomeComponent},
  {path:"subject", component:SubjectComponent},
  {path:"list", children:[
    {path:":list_id", children:[
      {path:"", component:QuestionComponent},
      {path:":question_id", component:AnswerComponent}
    ]}
  ]},
  {path:"login", component: LoginComponent, canActivate: [AuthGuard]},
  {path:'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path:'group', component: GroupComponent, canActivate: [AuthGuard]},
  {path: 'join/:token', component: JoinComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
