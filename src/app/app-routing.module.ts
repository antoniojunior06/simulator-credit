import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { PathLocationStrategy, LocationStrategy } from '@angular/common'



const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class AppRoutingModule { }
