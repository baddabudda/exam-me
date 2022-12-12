import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnswerComponent } from './components/answer/answer.component';
import { LoginComponent } from './components/login/login.component';
import { QuestionComponent } from './components/question/question.component';
import { SubjectComponent } from './components/subject/subject.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  {path:"", redirectTo:"welcome", pathMatch: 'full'},
  {path:"welcome", component:WelcomeComponent},
  {path:"subject", component:SubjectComponent},
  {path:"list", children:[
    {path:":list_id", children:[
      {path:"", component:QuestionComponent},
      {path:"question/:question_id", component:AnswerComponent}
    ]}
  ]},
  {path:"login", component:LoginComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
