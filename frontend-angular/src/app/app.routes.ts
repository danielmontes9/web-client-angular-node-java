import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  {
		path: "",
		redirectTo: "login",
		pathMatch: "full",
	},
  {
    path: "login",
    loadChildren: () => import("./modules/auth/auth.module").then((m) => m.AuthModule),
    canActivate: [loginGuard],
  },
  {
    path: "home",
    loadChildren: () => import("./modules/dashboard/dashboard.module").then((m) => m.DashboardModule),
    canActivate: [authGuard],
  },
  {
    path: "**",
    redirectTo: "login",
  }
];
