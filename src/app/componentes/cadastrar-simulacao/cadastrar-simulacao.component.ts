import { Component, OnInit } from '@angular/core';
import { SimuladorService } from '../service/simulador.service';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-cadastrar-simulacao',
  templateUrl: './cadastrar-simulacao.component.html',
  styleUrls: ['./cadastrar-simulacao.component.css'],
})
export class CadastrarSimulacaoComponent implements OnInit {
  formulario!: FormGroup;
  resultadoSimulacao: any[] = [];
  tipoSelecionado: string = 'PRICE';
  taxaJuros: string = '';
  valorPrestacoes: number[] = [];
  valorDesejado: number = 0;
  prazo: number = 0;
  valorTotal: number = 0;
  tipo: string = '';
  valorFormatado: string = '';
  valorPermitidoError: string | null = null;
  valorPrazoPermitidoError: string | null = null;
  prazoPermitidoError: string | null = null;
  mostrarTabela: boolean = true

  constructor(
    private service: SimuladorService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      valorDesejado: [null],
      prazo: [null],
      tipo: ['PRICE'],
    });


  }

  cadastraSimulacao() {
    this.valorPrestacoes = [];

    this.converteValorDeStringParaNumber();

    const valorDesejadoControl = this.formulario.get('valorDesejado');
    const prazoControl = this.formulario.get('prazo');

    if (
      valorDesejadoControl?.value === null ||
      valorDesejadoControl?.value === undefined
    ) {
      this.valorPrazoPermitidoError = 'Preenchimento obrigatório';
      return;
    }

    if (prazoControl?.value === null || prazoControl?.value === undefined) {
      this.valorPrazoPermitidoError = 'Preenchimento obrigatório';
      return;
    }

    const valorDesejado = parseFloat(valorDesejadoControl.value);
    const prazo = parseInt(prazoControl.value);

    this.validaCampos(valorDesejado, prazo);
    this.defineTaxaDeJuros(prazo, valorDesejado);


    this.valorDesejado = valorDesejadoControl?.value;
    this.prazo = prazoControl?.value;

    this.service.cadastra(this.formulario.value).subscribe((resultado) => {
      this.resultadoSimulacao = resultado.resultadoSimulacao.find(
        (simulacao: any) => simulacao.tipo === this.tipoSelecionado
      )?.parcelas;
      this.criaDescricaoETabelaDePrestacoes();
    });

    this.mostraTabela()
  }

  defineTaxaDeJuros(prazo: number, valorDesejado: number): void {
    if (prazo > 0 && prazo <= 24) {
      this.taxaJuros = '1,79%';
    }
    if (prazo > 24 && prazo <= 48) {
      this.taxaJuros = '1,75%';
    }
    if (prazo > 48 && prazo <= 96) {
      this.taxaJuros = '1,82%';
    }
    if (prazo >= 96 && valorDesejado >= 1000000.01) {
      this.taxaJuros = '1,51%';
    }
  }

  criaDescricaoETabelaDePrestacoes(): void {
    for (let parcela of this.resultadoSimulacao) {
      this.valorPrestacoes.push(parcela.valorPrestacao);
    }

    const valorTotal = this.valorPrestacoes.reduce(
      (acumulador, valorAtual) => acumulador + valorAtual
    );

    this.valorTotal = valorTotal;


    this.tipo = this.formulario.get('tipo')?.value;
  }

  converteValorDeStringParaNumber(): void {
    let valor = this.formulario.get('valorDesejado')?.value;

    if (typeof valor === 'string') {
      valor = parseFloat(valor.replace(/\D/g, '')) / 100;
      this.formulario.get('valorDesejado')?.setValue(valor);
    }
  }

  validaCampos(valorDesejado: number, prazo: number) {
    if (valorDesejado < 200) {
      this.valorPrazoPermitidoError = 'Valor mínimo: R$ 200,00';

    }
    if (valorDesejado >= 200 && valorDesejado <= 10000 && prazo > 24) {
      this.valorPrazoPermitidoError = 'Até R$ 10.000,00 o prazo máximo é 24 meses';

    }
    if (valorDesejado >= 10000.01 && valorDesejado <= 100000 && (prazo < 25 || prazo > 48)) {
      this.valorPrazoPermitidoError = 'Entre R$ 10.000,01 e R$ 100.000,00 o prazo permitido é de 25 a 48 meses';

    }
    if (valorDesejado >= 100000.01 && valorDesejado <= 1000000 && (prazo < 49 || prazo > 96)) {
      this.valorPrazoPermitidoError = 'Entre R$ 100.000,01 e R$ 1.000.000,00 o prazo permitido é de 49 a 96 meses';

    }
  }

  mostraTabela() {
    if(this.valorPrazoPermitidoError != null) {
      this.mostrarTabela = false
    }else {
      this.mostrarTabela = true
    }
  }

  selecionaTipo(tipo: string) {
    this.tipoSelecionado = tipo;
  }

  formataMoeda(valor: number): string {
    const moedaBrasileira = {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    return valor.toLocaleString('pt-BR', moedaBrasileira);
  }

  atualizaValorDesejado(): number {
    let valor = this.formulario.get('valorDesejado')?.value;

    if (valor === null) {
      return 0;
    }

    const numero = parseFloat(valor.replace(/\D/g, '')) / 100;

    this.formulario.get('valorDesejado')?.setValue(this.formataMoeda(numero));

    return parseFloat(numero.toFixed(2));
  }

  limpaMensagemDeErroDeValidacao(): void {
    this.valorPrazoPermitidoError = null;
  }

}
