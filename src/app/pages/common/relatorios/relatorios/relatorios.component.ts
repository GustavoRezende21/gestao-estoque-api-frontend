import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';

import { RelatorioService, RelatorioResponse } from '../relatorio.service';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    CalendarModule,
    InputNumberModule
  ],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss'
})
export class RelatoriosComponent {

  filtroForm: FormGroup;
  relatorio: RelatorioResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private relatorioService: RelatorioService,
    private messageService: MessageService
  ) {
    this.filtroForm = this.fb.group({
      dataInicial: [null],
      dataFinal: [null],
      valorMinimo: [null],
      valorMaximo: [null],
      usuarioId: [null]
    });
  }

  buscarRelatorio(): void {
    if (this.filtroForm.invalid) return;

    const filtros = this.filtroForm.value;

    const filtrosTratados = {
      ...filtros,
      dataInicial: filtros.dataInicial ? new Date(filtros.dataInicial).toISOString() : null,
      dataFinal: filtros.dataFinal ? new Date(filtros.dataFinal).toISOString() : null,
    };

    this.relatorioService.gerarRelatorio(filtrosTratados).subscribe({
      next: (data) => {
        this.relatorio = data;
        if (data.vendasFiltradas.length === 0) {
          this.showInfo('Nenhum resultado encontrado para os filtros aplicados.');
        }
      },
      error: (err) => this.showError('Erro ao buscar relatório.')
    });
  }

  limparFiltros(): void {
    this.filtroForm.reset();
    this.relatorio = null;
  }

  showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: detail });
  }
  showInfo(detail: string): void {
    this.messageService.add({ severity: 'info', summary: 'Aviso', detail: detail });
  }
}