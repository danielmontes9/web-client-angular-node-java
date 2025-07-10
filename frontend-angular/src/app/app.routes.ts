import { Routes } from '@angular/router';

export const routes: Routes = [
  {
		path: "",
		redirectTo: "login",
		pathMatch: "full",
	},
  {
    path: 'login',
    loadChildren: () => import("./modules/auth/auth.module").then((m) => m.AuthModule),
  }
];
