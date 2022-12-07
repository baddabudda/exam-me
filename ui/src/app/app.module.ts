import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER } from "@taiga-ui/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaigaModule } from "./taiga.module";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FooterComponent } from "./components/footer.component";
import { SubjectComponent } from "./components/subject/subject.component";
import { QuestionComponent } from "./components/question/question.component";
import { AnswerComponent } from "./components/answer/answer.component";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    FooterComponent,
    SubjectComponent,
    QuestionComponent,
    AnswerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TaigaModule,
    FormsModule,
    ReactiveFormsModule,
],
  providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}],
  bootstrap: [AppComponent]
})
export class AppModule { }
