import { Routes } from '@angular/router';
import {LoginGuard} from "./core/auth/guards/login-guard";
import {LandingComponent} from "./components/landing/landing.component";

export const routes: Routes = [
  {path: '', component: LandingComponent, canActivate: [LoginGuard]},
];
