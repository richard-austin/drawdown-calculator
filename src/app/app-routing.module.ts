import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpComponent } from './input-form/help/help.component';
import { InputFormComponent } from './input-form/input-form.component';

const routes: Routes = [{path: '', component: InputFormComponent},
{path: 'help', component: HelpComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
