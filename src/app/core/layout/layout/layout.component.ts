import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToolbarModule,
    ButtonModule,
    SidebarModule,
    MenuModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  sidebarVisivel: boolean = false;
  nomeUsuario: string = '';
  menuItems: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.nomeUsuario = this.authService.getNomeUsuario() || 'Usuário';

    this.userMenuItems = [
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];

    this.definirMenuNavegacao();
  }

  definirMenuNavegacao(): void {
    const perfil = this.authService.getPerfilUsuario();

    let itens: MenuItem[] = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        command: () => this.navegarPara('/dashboard')
      },
      {
        label: 'Relatórios',
        icon: 'pi pi-chart-bar',
        command: () => this.navegarPara('/relatorios')
      }
    ];

    if (perfil === 'ADMIN') {
      itens.push(
        { 
          label: 'Usuários', 
          icon: 'pi pi-users', 
          command: () => this.navegarPara('/usuarios')
        },
        { 
          label: 'Produtos', 
          icon: 'pi pi-box', 
          command: () => this.navegarPara('/produtos')
        },
        { 
          label: 'Estoque', 
          icon: 'pi pi-database', 
          command: () => this.navegarPara('/estoque')
        }
      );
    }

    if (perfil === 'OPERADOR') {
      itens.push(
        { 
          label: 'Caixa / Vendas', 
          icon: 'pi pi-shopping-cart', 
          command: () => this.navegarPara('/vendas')
        }
      );
    }
    
    this.menuItems = itens.sort((a, b) => (a.label || '').localeCompare(b.label || ''));
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
    this.sidebarVisivel = false;
  }

  logout(): void {
    this.authService.logout();
  }
}