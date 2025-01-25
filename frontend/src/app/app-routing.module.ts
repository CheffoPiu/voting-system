import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoteComponent } from './components/vote/vote.component';
import { ResultsComponent } from './components/results/results.component';

const routes: Routes = [
  { path: 'vote', component: VoteComponent },   // Ruta para la página de votación
  { path: 'results', component: ResultsComponent }, // Ruta para los resultados
  { path: '', redirectTo: '/vote', pathMatch: 'full' }, // Redirige la raíz a /vote
  { path: '**', redirectTo: '/vote' }, // Redirige rutas no encontradas a /vote
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

