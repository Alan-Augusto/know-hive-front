import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
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
        loadComponent: () => import('./features/home-page/home-page.component').then(m => m.HomePageComponent),
        data: {showMenu: true}

    },
    {
      path: 'profile',
      loadComponent: () => import('./features/user-edit/user-edit.component').then(m => m.UserEditComponent),
    },
    {
      path: 'questions',
      loadComponent: () => import('./features/questions/questions.component').then(m => m.QuestionsComponent),
      data: {showMenu: true}
    },
    {
      path: 'collections',
      loadComponent: () => import('./features/collections/collections.component').then(m => m.CollectionsComponent),
      data: {showMenu: true}
    },
    {
      path: 'shared-with-me',
      loadComponent: () => import('./features/shared-with-me/shared-with-me.component').then(m => m.SharedWithMeComponent),
      data: {showMenu: true}
    },
    {
      path: 'statistics',
      loadComponent: () => import('./features/statistics/statistics.component').then(m => m.StatisticsComponent),
      data: {showMenu: true}
    },
    {
        path: 'color-preview',
        loadComponent: () => import('./features/color-preview/color-preview.component').then(m => m.ColorPreviewComponent)
    }
];
