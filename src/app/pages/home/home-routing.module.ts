import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    // resolve: { mediaItems: HomeResolver },
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: MainComponent },
      // { path: 'bookmarked', component: BookmarkedComponent },
      // { path: 'movies', component: MoviesComponent },
      // { path: 'tv-series', component: TvSeriesComponent },
    ],
    // canActivate: [AuthGuard],
  },
  // { path: '', component: HomeComponent, canActivate: [AuthGuard] }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
