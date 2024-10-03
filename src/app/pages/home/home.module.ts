import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeroContentComponent } from './layout/hero-content/hero-content.component';
import { SharedModule } from "../../modules/shared/shared.module";
import { HomeComponent } from './home.component';
import { DetailComponent } from './detail/detail.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    FooterComponent,
    HeroContentComponent,
    HomeComponent,
    DetailComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ReactiveFormsModule,
]
})
export class HomeModule { }
