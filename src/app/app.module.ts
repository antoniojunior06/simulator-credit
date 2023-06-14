import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CadastrarSimulacaoComponent } from './componentes/cadastrar-simulacao/cadastrar-simulacao.component';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { CabecalhoComponent } from './componentes/cabecalho/cabecalho.component';
import { RodapeComponent } from './componentes/rodape/rodape.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';





@NgModule({
  declarations: [
    AppComponent,
    CadastrarSimulacaoComponent,
    CabecalhoComponent,
    RodapeComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule

  ],
  providers: [CurrencyPipe, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
