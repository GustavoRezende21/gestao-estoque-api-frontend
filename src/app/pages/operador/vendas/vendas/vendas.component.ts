import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProdutoService } from '../../../admin/produtos/produto.service';
import { VendaService } from '../venda.service';

interface Produto {
  id: number;
  nome: string;
  precoUnitario: number;
  quantidadeEmEstoque: number;
}

interface ItemCarrinho {
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

@Component({
  selector: 'app-vendas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    AutoCompleteModule
  ],
  templateUrl: './vendas.component.html',
  styleUrl: './vendas.component.scss'
})
export class VendasComponent {

  itensCarrinho: ItemCarrinho[] = [];
  valorTotal: number = 0;

  addItemForm: FormGroup;

  pagamentoForm: FormGroup;

  produtosSugeridos: Produto[] = [];

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private vendaService: VendaService,
    private messageService: MessageService
  ) {
    this.addItemForm = this.fb.group({
      produto: [null, [Validators.required]],
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });

    this.pagamentoForm = this.fb.group({
      valorRecebido: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  buscarProdutos(event: any): void {
    this.produtoService.listarProdutos().subscribe(
      (produtos: Produto[]) => {
        this.produtosSugeridos = produtos;
      }
    );
  }

  adicionarAoCarrinho(): void {
    if (this.addItemForm.invalid) return;

    const produtoSelecionado: Produto = this.addItemForm.value.produto;
    const quantidade: number = this.addItemForm.value.quantidade;

    if (quantidade > produtoSelecionado.quantidadeEmEstoque) {
      this.showError(`Estoque insuficiente. Disponível: ${produtoSelecionado.quantidadeEmEstoque}`);
      return;
    }

    const itemExistente = this.itensCarrinho.find(i => i.produtoId === produtoSelecionado.id);
    if (itemExistente) {
      itemExistente.quantidade += quantidade;
      itemExistente.subtotal = itemExistente.quantidade * itemExistente.precoUnitario;
    } else {
      this.itensCarrinho.push({
        produtoId: produtoSelecionado.id,
        nome: produtoSelecionado.nome,
        quantidade: quantidade,
        precoUnitario: produtoSelecionado.precoUnitario,
        subtotal: quantidade * produtoSelecionado.precoUnitario
      });
    }

    this.itensCarrinho = [...this.itensCarrinho]; 

    this.calcularTotal();
    this.addItemForm.reset({ quantidade: 1 });
  }

  removerDoCarrinho(produtoId: number): void {
    this.itensCarrinho = this.itensCarrinho.filter(i => i.produtoId !== produtoId);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.valorTotal = this.itensCarrinho.reduce((acc, item) => acc + item.subtotal, 0);
  }

  finalizarVenda(): void {
    if (this.pagamentoForm.invalid || this.itensCarrinho.length === 0) {
      this.showError('Verifique o valor recebido e o carrinho.');
      return;
    }

    const valorRecebido = this.pagamentoForm.value.valorRecebido;

    const dto = {
      valorRecebido: valorRecebido,
      itens: this.itensCarrinho.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade
      }))
    };

    this.vendaService.registrarVenda(dto).subscribe({
      next: (vendaConcluida) => {
        this.showSuccess(`Venda #${vendaConcluida.id} registrada! Troco: ${vendaConcluida.troco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
        this.resetarCaixa();
      },
      error: (err) => this.showError(err.error?.message || 'Erro ao fechar a venda')
    });
  }

  resetarCaixa(): void {
    this.itensCarrinho = [];
    this.valorTotal = 0;
    this.addItemForm.reset({ quantidade: 1 });
    this.pagamentoForm.reset();
  }

  showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: detail });
  }

  showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: detail });
  }
}