import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const perfisPermitidos = route.data['roles'] as Array<string>;

  const perfilUsuario = authService.getPerfilUsuario();

  if (!perfilUsuario || !perfisPermitidos.includes(perfilUsuario)) {
    console.error('Acesso negado. Perfil de usuário não autorizado.');

    router.navigate(['/']); 

    return false;
  }

  return true; 
};