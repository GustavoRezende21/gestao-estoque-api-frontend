import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EstoqueService, TipoMovimentacao } from '../estoque.service';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    InputTextareaModule
  ],
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.scss'
})
export class EstoqueComponent implements OnInit {

  historico: any[] = [];
  movimentacaoForm: FormGroup;
  tiposMovimentacao: any[];

  constructor(
    private estoqueService: EstoqueService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.tiposMovimentacao = [
      { label: 'Entrada (Reposição)', value: 'ENTRADA' },
      { label: 'Ajuste (Correção)', value: 'AJUSTE' }
    ];

    this.movimentacaoForm = this.fb.group({
      produtoId: [null, [Validators.required, Validators.min(1)]],
      tipo: [null, [Validators.required]],
      quantidade: [null, [Validators.required, Validators.pattern(/^-?[1-9]\d*$/)]],
      motivo: ['']
    });
  }

  ngOnInit(): void {
    this.carregarHistorico();
  }

  carregarHistorico(): void {
    this.estoqueService.listarHistorico().subscribe({
      next: (data) => this.historico = data,
      error: (err) => this.showError('Erro ao carregar histórico')
    });
  }

  onSubmitMovimentacao(): void {
    if (this.movimentacaoForm.invalid) {
      this.movimentacaoForm.markAllAsTouched();
      return;
    }

    const formValues = this.movimentacaoForm.value;
    const dto = {
      produtoId: formValues.produtoId,
      tipo: formValues.tipo,
      quantidade: formValues.quantidade,
      motivo: formValues.motivo
    };

    if (dto.tipo === 'AJUSTE' && !dto.motivo) {
      this.showError('Motivo é obrigatório para Ajustes.');
      return;
    }

    this.estoqueService.registrarMovimentacao(dto).subscribe({
      next: () => {
        this.showSuccess('Movimentação registrada!');
        this.carregarHistorico();
        this.movimentacaoForm.reset();
      },
      error: (err) => this.showError(err.error?.message || 'Erro ao registrar movimentação')
    });
  }

  showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: detail });
  }

  showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: detail });
  }
}