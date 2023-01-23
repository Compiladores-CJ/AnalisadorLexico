const { Console } = require('console');
const objetoGramatica = require('./gramatica')
const tab1 = require('./tabelaSLRAction');
const tab2 = require('./tabelaSLRGoto');

const tabela = Object.assign({}, tab1, tab2);
const gramatica = objetoGramatica.Gramatica;

function isCaractereDeQuebra(caractere) {
  codASCII = caractere.charCodeAt(0);
  // código ASCII para ['quebra de linha', 'Carriage return', 'espaço']
  const caracteresDeQuebra = [10, 13, 32];
  if(caracteresDeQuebra.includes(codASCII))
    return true;
  
  return false;
}

function isDigito(caractere) {
  codASCII = caractere.charCodeAt(0);
  if(codASCII >= 48 && codASCII <= 57)
    return true;
  
  return false;
}

function isLetra(caractere) {
  codASCII = caractere.charCodeAt(0);
  if((codASCII >= 65 && codASCII <= 90) || (codASCII >= 97 && codASCII <= 122))
    return true;
   
  return false;
}

function isDemaisCaracteres(caractere) {
  codASCII = caractere.charCodeAt(0);
  const demaisCaracteres = [44, 59, 58, 46, 33, 63, 92, 42, 43, 45, 47, 40, 41, 123, 125, 91, 93, 60, 62, 61, 39, 34, 95]
  if(demaisCaracteres.includes(codASCII))
    return true;
  
  return false;
}

function isAlfabeto(caractere) {
  if(isDigito(caractere) || isLetra(caractere) || isCaractereDeQuebra(caractere) || isDemaisCaracteres(caractere))
    return true;
  
  return false;
}

let linha = 1
let coluna = 1
let cabecote = 0

let tabelaDeSimbolos = [
	{classeToken: 'inicio'    ,tipoToken: 'inicio'    ,lexemaToken: 'inicio'    },
	{classeToken: 'varinicio' ,tipoToken: 'varinicio' ,lexemaToken: 'varinicio' },
	{classeToken: 'varfim'    ,tipoToken: 'varfim'    ,lexemaToken: 'varfim'    },
	{classeToken: 'escreva'   ,tipoToken: 'escreva'   ,lexemaToken: 'escreva'   },
  {classeToken: 'leia'      ,tipoToken: 'leia'      ,lexemaToken: 'leia'      },
  {classeToken: 'se'        ,tipoToken: 'se'        ,lexemaToken: 'se'        },
  {classeToken: 'entao'     ,tipoToken: 'entao'     ,lexemaToken: 'entao'     },
  {classeToken: 'fimse'     ,tipoToken: 'fimse'     ,lexemaToken: 'fimse'     },
  {classeToken: 'fim'       ,tipoToken: 'fim'       ,lexemaToken: 'fim'       },
  {classeToken: 'inteiro'   ,tipoToken: 'inteiro'   ,lexemaToken: 'inteiro'   },
  {classeToken: 'literal'   ,tipoToken: 'literal'   ,lexemaToken: 'literal'   },
  {classeToken: 'real'      ,tipoToken: 'real'      ,lexemaToken: 'real'      }
];

let tabelaDeTokens = [];

// Vamos implementar o automato criado pelo Julio
const maquinaDeterministica = {
  estado: 0,
  token: {
    classeToken: '', tipoToken: '', lexemaToken: ''
  },
  transitions: {
    0: {
      readCharacter: function(data){
        this.resetToken();
        
        if(data.caractere === undefined){
          this.token.classeToken = 'EOF';
          this.token.tipoToken = 'NULO';
          return this.token;
        }
        
        this.token.lexemaToken = data.caractere;
        
        if(isAlfabeto(data.caractere)){
          if(isLetra(data.caractere)){
            this.changeState(1);
          } else if(data.caractere == '<'){
            this.changeState(2); 
          } else if(data.caractere == '='){
            this.changeState(3); 
          } else if(data.caractere == '>'){
            this.changeState(5); 
          } else if(['+','-','*','/'].includes(data.caractere)){
            this.changeState(6); 
          } else if(data.caractere == '\"'){
            this.changeState(7); 
          } else if(data.caractere == ';'){
            this.changeState(9); 
          } else if(data.caractere == ','){
            this.changeState(10); 
          } else if(isDigito(data.caractere)){
            this.changeState(11);
            this.token.tipoToken = 'INTEIRO'; 
          } else if(data.caractere == '('){
            this.changeState(18); 
          } else if(data.caractere == ')'){
            this.changeState(19); 
          } else if(data.caractere == '{'){
            this.changeState(20); 
          } else if(isCaractereDeQuebra(data.caractere)){
            this.changeState(0);
          } else if(isDemaisCaracteres(data.caractere)){
            this.changeState(0);
            console.log("ERRO LÉXICO – Palavra \"" + this.token.lexemaToken + "\" não reconhecida. Linha " + linha + ", coluna " + coluna)
            this.token.classeToken = 'ERROR';
            this.token.tipoToken = 'NULO';
            return this.token;
          }
        }
        else{
          this.changeState(0);
          console.log("ERRO LÉXICO - Caractere \"" + this.token.lexemaToken + "\" inválido na linguagem. Linha " + linha + ", coluna " + coluna)
          this.token.classeToken = 'ERROR';
          this.token.tipoToken = 'NULO';
          return this.token;
        } 
      }
    },
    1: {
      readCharacter: function(data){
        this.token.classeToken = 'ID';
        this.token.tipoToken = 'NULO'; 
        if(data.caractere !== undefined){
          if(isLetra(data.caractere) || isDigito(data.caractere) || data.caractere == '_'){
            this.token.lexemaToken = this.token.lexemaToken + data.caractere;
            return null;
          } 
        }
       
        let result = tabelaDeSimbolos.find(({ lexemaToken }) => lexemaToken === this.token.lexemaToken);
        if(result !== undefined){
          this.token = Object.assign({}, result);
        }
        else {
          tabelaDeSimbolos.push(Object.assign({}, this.token));
        }

        this.changeState(0)
        return this.token;
      }
    },
    2:{
      readCharacter: function(data){
        if(data.caractere == '-'){
          this.token.lexemaToken = this.token.lexemaToken + data.caractere;
          this.changeState(4)
          return null;
        }
        if(data.caractere == '=' || data.caractere == '>'){
          this.token.lexemaToken = this.token.lexemaToken + data.caractere;
          this.changeState(3)
          return null;
        }
        else{
          this.changeState(0)
          this.token.classeToken = 'OPR';
          this.token.tipoToken = 'NULO';
          return this.token;
        }
      }
    },
    3:{
      readCharacter: function(data){
        this.changeState(0)
        this.token.classeToken = 'OPR';
        this.token.tipoToken = 'NULO';
        return this.token;
      }
    },
    4:{
      readCharacter: function(data){
        this.changeState(0)
        this.token.classeToken = 'ATR';
        this.token.tipoToken = 'NULO';
        return this.token;
      }
    },
    5:{
      readCharacter: function(data){
        if(data.caractere == '='){
          this.token.lexemaToken = this.token.lexemaToken + data.caractere;
          this.changeState(3)
          return null;
        }
        else {
          this.changeState(0)
          this.token.classeToken = 'OPR';
          this.token.tipoToken = 'NULO';
          return this.token;
        }
      }
    },
    6: {
      readCharacter: function(data){
        this.changeState(0)
        this.token.classeToken = 'OPA';
        this.token.tipoToken = 'NULO';
        return this.token;
      }
    },
    7:{
      readCharacter: function(data){
        this.token.lexemaToken = this.token.lexemaToken + data.caractere;
        if(data.caractere == '\"'){
          this.changeState(8)
          return null;
        }
        else return null; 
      }
    },
    8:{
      readCharacter: function(data){
        this.changeState(0)
        this.token.classeToken = 'LIT';
        this.token.tipoToken = 'LITERAL';
        return this.token;
      }
    },
    9:{
      readCharacter: function(data){
        this.changeState(0)
        this.token.classeToken = 'PT_V';
        this.token.tipoToken = 'NULO';
        return this.token;
      }
    },
    10:{
      readCharacter: function(data){
        this.changeState(0)
        this.token.classeToken = 'VIR';
        this.token.tipoToken = 'NULO';
        return this.token;
      }
    },
    11: {
      readCharacter: function(data){
        if(data.caractere != undefined){
          if(isDigito(data.caractere)){
            this.token.lexemaToken = this.token.lexemaToken + data.caractere;
            return null;
          } 
          else{
            if(data.caractere == "."){
              this.token.lexemaToken = this.token.lexemaToken + data.caractere;
              this.token.tipoToken = 'REAL';
              this.changeState(12)
              return null; 
            }
            if(data.caractere == "e" || data.caractere == "E"){
              this.token.lexemaToken = this.token.lexemaToken + data.caractere;
              this.changeState(14)
              return null;
            }
          }
        }
        this.changeState(0)
        this.token.classeToken = 'NUM';
        return this.token;
      }
    },
    12:{
      readCharacter: function(data){
        if(data.caractere != undefined){
          if(isDigito(data.caractere)){
            this.token.lexemaToken = this.token.lexemaToken + data.caractere;
            this.changeState(13)
            return null;
          }
        }
        console.log("ERRO LÉXICO – Palavra \"" + this.token.lexemaToken + "\" não reconhecida. Linha " + linha + ", coluna " + coluna)
        this.changeState(0);
        this.token.classeToken = 'ERROR';
        this.token.tipoToken = 'NULO';
        return this.token; 
      }
    },
    13:{
      readCharacter: function(data){
        if(data.caractere != undefined){
          if(isDigito(data.caractere)) {
            this.token.lexemaToken = this.token.lexemaToken + data.caractere;
            return null;
          }
          if(data.caractere == "e" || data.caractere == "E"){
            this.token.lexemaToken = this.token.lexemaToken + data.caractere;
            this.changeState(14)
            return null;
          }
        }
        this.changeState(0)
        this.token.classeToken = 'NUM';
        return this.token; 
      }
    },
    14:{
      readCharacter: function(data){
        if(data.caractere != undefined){
          if(isDigito(data.caractere)){
            this.token.lexemaToken = this.token.lexemaToken + data.caractere;
            this.changeState(15)
            return null;
          }
          if(data.caractere == "+" || data.caractere == "-"){
            this.token.lexemaToken = this.token.lexemaToken + data.caractere;
            this.changeState(16)
            return null;
          }
        }
        console.log("ERRO LÉXICO – Palavra \"" + this.token.lexemaToken + "\" não reconhecida. Linha " + linha + ", coluna " + coluna)
        this.changeState(0);
        this.token.classeToken = 'ERROR';
        this.token.tipoToken = 'NULO';
        return this.token;    
      }
    },
    15:{
      readCharacter: function(data){
        if(data.caractere != undefined){
          if(isDigito(data.caractere)){
            this.token.lexemaToken = this.token.lexemaToken + data.caractere;
            return null
          }  
        }
        this.changeState(0)
        this.token.classeToken = 'NUM';
        return this.token;
      }
    },
    16:{
      readCharacter: function(data){
        if(data.caractere != undefined){
          if(isDigito(data.caractere)){
            this.token.lexemaToken = this.token.lexemaToken + data.caractere;
            this.changeState(15)
            return null;
          }
        }
        console.log("ERRO LÉXICO – Palavra \"" + this.token.lexemaToken + "\" não reconhecida. Linha " + linha + ", coluna " + coluna)
        this.changeState(0);
        this.token.classeToken = 'ERROR';
        this.token.tipoToken = 'NULO';
        return this.token;
      }
    },
    17:{
      readCharacter: function(data){
        this.changeState(0)
        this.token.classeToken = 'EOF';
        this.token.tipoToken = 'NULO';
        return this.token;
      }
    },
    18:{
      readCharacter: function(data){
        this.changeState(0)
        this.token.classeToken = 'AB_P';
        this.token.tipoToken = 'NULO';
        return this.token;
      }
    },
    19:{
      readCharacter: function(data){
        this.changeState(0)
        this.token.classeToken = 'FC_P';
        this.token.tipoToken = 'NULO';
        return this.token;
      }
    },
    20:{
      readCharacter: function(data){
        if(data.caractere != undefined){
          this.token.lexemaToken = this.token.lexemaToken + data.caractere;
          if(data.caractere == '}'){
            this.changeState(21);
            return null;
          }
          if(data.caractere == " "){
            return null;
          } 
        }
        else {
          console.log("ERRO LÉXICO – Comentário não foi fechado, linha " + linha + ", coluna " + coluna)
          this.changeState(0);
          this.token.classeToken = 'ERROR';
          this.token.tipoToken = 'NULO';
          return this.token;
        } 
      }
    },
    21:{
      readCharacter: function(data){
        this.changeState(0)
        this.token.classeToken = 'COMENTÁRIO';
        this.token.tipoToken = 'NULO';
        return null;
      }
    }
  },
  dispatch(actionName, ...payload){
    const actions = this.transitions[this.estado];
    const action = this.transitions[this.estado][actionName];
    let result
    
    if(action){
      result = action.apply(maquinaDeterministica, ...payload);
      return result
    } else {
      //action is not valid for current state
    }
  },
  changeState(novoEstado){
    this.estado = novoEstado;
  },
  resetToken(){
    this.token.classeToken = '';
    this.token.lexemaToken = '';
    this.token.tipoToken = '';
  }
}

function SCANNER(data, maquina){
  let token = null;
  
  for(let i = cabecote; i < data.length + 1; i++){
    token = maquina.dispatch("readCharacter", [{caractere: data[i]}]);
    
    if(token === null || token === undefined){
      if(i !== data.length) updateLinhaEColuna(data[i]);
    }
    else {
      cabecote = i
      if(token.classeToken == 'ERROR' && (!isAlfabeto(token.lexemaToken) || isDemaisCaracteres(token.lexemaToken))){
        if(data[i] != undefined)cabecote = i + 1
        if(i !== data.length) updateLinhaEColuna(data[i]);
      }
      return token
    }
  }
  
  function updateLinhaEColuna(caractere){
    codigoASCII = caractere.charCodeAt(0);
    coluna++;
    
    if(codigoASCII == '10'){
      linha++;
      coluna = 1;
    }
  }
}

function PARSER(){
  let cont = 1
  const fs = require('fs');
  // const data = fs.readFileSync('./teste.txt', {encoding:'utf8', flag:'r'});
  const data = fs.readFileSync('./exemplo.txt', {encoding:'utf8', flag:'r'});
  
  //lexico
  let maquina = Object.create(maquinaDeterministica);
  //sintatico
  let pilha = [];
  pilha.push("S")
  pilha.push("0")
  
  let token = SCANNER(data, maquina)
  tabelaDeTokens.push(Object.assign({}, token));
  let action
  let regra
  let estado
  let contadorDeReducao = 1;
  //Variavel temporaria para debbug do projeto

  while(true){
    console.log("\n-------------------------------------------\nIteração: " + cont)
    cont++;
    estado = pilha[pilha.length - 1];
    console.log("--- VARIAVEIS INICIO---")
    console.log("       PILHA: ", {pilha})
    console.log("       TOKEN: ", {token})
    console.log("       ESTADO: ", {estado})
    console.log("--- VARIAVEIS INICIO---")

    if(isTerminal(token)) {
      console.log("Acessando a tabela de Ações!!");
      action = tabela.SLRAction[estado][token.classeToken.toLowerCase()]
    }
    else {
      console.log("Acessando a tabela GoTo!!");
      action = tabela.SLRGoto[estado][token.classeToken]
    }
    console.log({action});
    
    if(action !== '' && action[0] === 'S'){
      console.log("FAZENDO SHIFT!");
      // empilha um estado
      pilha.push(action.slice(1));
      token = SCANNER(data, maquina)
      //console.log("TOKEN DIRETO DO SCANNER:", token);
      
    } else if(action !== '' && action[0] === 'R'){
      console.log("FAZENDO REDUCE!");
      // reduzir uma regra
      regra = gramatica[action.slice(1)].producao;

      let removeDaPilha = regra.split(" ").length;
      //console.log(removeDaPilha);
      pilha.splice(-removeDaPilha, removeDaPilha);
      //console.log({pilha})

      estado = pilha[pilha.length - 1];
    
      //errado! Arruma
      //console.log({estado})
      //console.log('action.slice(1):', action.slice(1))
      pilha.push(tabela.SLRGoto[estado][gramatica[action.slice(1)].naoTerminal].toString());
      //errado, arrumar

      console.log(contadorDeReducao + " - Redução feita: " + gramatica[action.slice(1)].naoTerminal + " -> " + gramatica[action.slice(1)].producao)
      contadorDeReducao++;
    }else if(action !== '' && action === 'Acc') {
      //Análise Finalizada e Aceita
      console.log("Análise Terminou")
    }else {
      //ERRO
      console.log("ERRO ERRO ERRO ERRO ERRO ERRO ERRO ERRO ERRO")
      break;
    }
    if(token?.classeToken === 'EOF') break;
  }

  function pertenceATabelaDeSimbolos(tokenTeste) {
    let result = tabelaDeSimbolos.find(element => element.lexemaToken === tokenTeste.lexemaToken)

    if(result !== undefined)
      return true;
    else
      return false;
  }

  function isTerminal(tokenTeste) {
    terminais = ["inicio", "varinicio", "varfim", "inteiro", "real", "literal",  "leia", "escreva", "pt_v", "vir",  "lit",  "num", "id",   "atr",  "opa", "se", "ab_p", "fc_p", "entao","opr", "fimse", "fim", "S"]
    if(terminais.includes(token.classeToken.toLowerCase()))
      return true;
    else
      return false;
  }
}

// console.table(tabelaDeTokens)
// console.table(tabelaDeSimbolos)
// console.log(tabela.SLRAction);

PARSER()


// const array1 = [
// 	{classeToken: 'inicio'    ,tipoToken: 'inicio'    ,lexemaToken: 'inicio'    },
// 	{classeToken: 'varinicio' ,tipoToken: 'varinicio' ,lexemaToken: 'varinicio' },
// 	{classeToken: 'varfim'    ,tipoToken: 'varfim'    ,lexemaToken: 'varfim'    },
// ];

// const objeto1 = {classeToken: 'inicio'    ,tipoToken: 'inicio'    ,lexemaToken: 'inicio'    };

// let result = tabelaDeSimbolos.find(element => element.classeToken === objeto1.classeToken)

// if(result !== undefined)
//   console.log("Existe esse objeto no Array", result)
// else
//   console.log("Não existe o objeto no array");

// console.log(tabela.SLRAction[0].inicio);

// pilha = [ '$', '0', '2', '4', '50' ]
// pilha.splice(-1, 3)
// console.log(pilha);

