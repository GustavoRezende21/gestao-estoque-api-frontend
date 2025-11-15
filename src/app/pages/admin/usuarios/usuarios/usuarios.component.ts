import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UsuarioService, UsuarioResponse, UsuarioRequest, Perfil } from '../usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    CardModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    InputSwitchModule,
    ConfirmDialogModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {

  usuarios: UsuarioResponse[] = [];
  usuarioDialog: boolean = false;
  usuarioForm: FormGroup;
  modoEdicao: boolean = false;
  usuarioIdAtual?: number;
  opcoesPerfil: any[];

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.opcoesPerfil = [
      { label: 'Administrador', value: 'ADMIN' },
      { label: 'Operador', value: 'OPERADOR' }
    ];

    this.usuarioForm = this.fb.group({
      nomeCompleto: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.minLength(8)]],
      perfil: [null, [Validators.required]],
      ativo: [true, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => this.showError('Erro ao carregar usuários')
    });
  }


  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.usuarioForm.reset({ ativo: true });
    this.usuarioForm.get('senha')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.usuarioForm.get('senha')?.updateValueAndValidity();
    this.usuarioDialog = true;
  }

  abrirModalEditar(usuario: UsuarioResponse): void {
    this.modoEdicao = true;
    this.usuarioIdAtual = usuario.id;
    this.usuarioForm.patchValue(usuario);
    this.usuarioForm.get('senha')?.clearValidators();
    this.usuarioForm.get('senha')?.updateValueAndValidity();
    this.usuarioDialog = true;
  }

  fecharModal(): void {
    this.usuarioDialog = false;
  }


  onSubmitUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const dto: UsuarioRequest = this.usuarioForm.value;

    if (!dto.senha) {
      delete dto.senha;
    }

    if (this.modoEdicao && this.usuarioIdAtual) {
      this.usuarioService.atualizarUsuario(this.usuarioIdAtual, dto).subscribe({
        next: () => {
          this.showSuccess('Usuário atualizado com sucesso!');
          this.fecharModal();
          this.carregarUsuarios();
        },
        error: (err) => this.showError(err.error?.message || 'Erro ao atualizar usuário')
      });
    } else {
      this.usuarioService.criarUsuario(dto).subscribe({
        next: () => {
          this.showSuccess('Usuário criado com sucesso!');
          this.fecharModal();
          this.carregarUsuarios();
        },
        error: (err) => this.showError(err.error?.message || 'Erro ao criar usuário')
      });
    }
  }

  onDeletarUsuario(usuario: UsuarioResponse): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o usuário "${usuario.nomeCompleto}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.usuarioService.deletarUsuario(usuario.id).subscribe({
          next: () => {
            this.showSuccess('Usuário excluído com sucesso!');
            this.carregarUsuarios();
          },
          error: (err) => this.showError(err.error?.message || 'Erro ao excluir usuário')
        });
      }
    });
  }


  showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: detail });
  }
  showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: detail });
  }
}