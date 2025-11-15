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
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProdutoService, ProdutoResponse, ProdutoRequest } from '../produto.service';

@Component({
  selector: 'app-produtos',
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
    InputNumberModule,
    ConfirmDialogModule
  ],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {

  produtos: ProdutoResponse[] = [];
  produtoDialog: boolean = false;
  produtoForm: FormGroup;
  modoEdicao: boolean = false;
  produtoIdAtual?: number;

  constructor(
    private produtoService: ProdutoService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.produtoForm = this.fb.group({
      nome: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      precoUnitario: [null, [Validators.required, Validators.min(0.01)]],
      quantidadeEmEstoque: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listarProdutos().subscribe({
      next: (data) => this.produtos = data,
      error: (err) => this.showError('Erro ao carregar produtos')
    });
  }


  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.produtoForm.reset();
    this.produtoDialog = true;
  }

  abrirModalEditar(produto: ProdutoResponse): void {
    this.modoEdicao = true;
    this.produtoIdAtual = produto.id;
    this.produtoForm.patchValue(produto);
    this.produtoDialog = true;
  }

  fecharModal(): void {
    this.produtoDialog = false;
  }


  onSubmitProduto(): void {
    if (this.produtoForm.invalid) {
      this.produtoForm.markAllAsTouched();
      return;
    }

    const dto: ProdutoRequest = this.produtoForm.value;

    if (this.modoEdicao && this.produtoIdAtual) {
      this.produtoService.atualizarProduto(this.produtoIdAtual, dto).subscribe({
        next: () => {
          this.showSuccess('Produto atualizado com sucesso!');
          this.fecharModal();
          this.carregarProdutos();
        },
        error: (err) => this.showError(err.error?.message || 'Erro ao atualizar produto')
      });
    } else {
      // CRIAR
      this.produtoService.criarProduto(dto).subscribe({
        next: () => {
          this.showSuccess('Produto criado com sucesso!');
          this.fecharModal();
          this.carregarProdutos();
        },
        error: (err) => this.showError(err.error?.message || 'Erro ao criar produto')
      });
    }
  }

  onDeletarProduto(produto: ProdutoResponse): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o produto "${produto.nome}"? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.produtoService.deletarProduto(produto.id).subscribe({
          next: () => {
            this.showSuccess('Produto excluído com sucesso!');
            this.carregarProdutos();
          },
          error: (err) => this.showError(err.error?.message || 'Erro ao excluir produto')
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