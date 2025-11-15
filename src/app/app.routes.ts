import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { LayoutComponent } from './core/layout/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UsuariosComponent } from './pages/admin/usuarios/usuarios/usuarios.component'; 
import { ProdutosComponent } from './pages/admin/produtos/produtos/produtos.component'; 
import { EstoqueComponent } from './pages/admin/estoque/estoque/estoque.component'; 
import { VendasComponent } from './pages/operador/vendas/vendas/vendas.component'; 
import { RelatoriosComponent } from './pages/common/relatorios/relatorios/relatorios.component'; 
import { DashboardComponent } from './pages/common/dashboard/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [ authGuard ],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent 
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },

            { path: 'usuarios', component: UsuariosComponent, canActivate: [ roleGuard ], data: { roles: ['ADMIN'] } },
            { path: 'produtos', component: ProdutosComponent, canActivate: [ roleGuard ], data: { roles: ['ADMIN'] } },
            { path: 'estoque', component: EstoqueComponent, canActivate: [ roleGuard ], data: { roles: ['ADMIN'] } },
            { path: 'vendas', component: VendasComponent, canActivate: [ roleGuard ], data: { roles: ['OPERADOR'] } },
            { path: 'relatorios', component: RelatoriosComponent }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];