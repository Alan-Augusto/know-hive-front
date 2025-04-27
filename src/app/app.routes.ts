import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    // {
    //     path: '**',
    //     redirectTo: 'not-found',
    //     pathMatch: 'full'
    // },
    {
        path: 'not-found',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
        data: {showMenu: false}
    },
    {
        path: 'auth',
        loadComponent: () => import('./features/authentication/authentication.component').then(m => m.AuthenticationComponent),
        data: {showMenu: false}
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
        data: {showMenu: false}
    },
    {
        path: 'register',
        loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent),
        data: {showMenu: false}
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home-page/home-page.component').then(m => m.HomePageComponent)
        
    },
    {
        path: 'color-preview',
        loadComponent: () => import('./features/color-preview/color-preview.component').then(m => m.ColorPreviewComponent)
    }
];
