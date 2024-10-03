import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthGuard } from '../auth/auth.guard';
import { HomeComponent } from './home.component';
import { DetailComponent } from './detail/detail.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    // resolve: { mediaItems: HomeResolver },
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: MainComponent },
      { path: 'detail', component: DetailComponent },
      { path: 'profile', component: ProfileComponent },
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
