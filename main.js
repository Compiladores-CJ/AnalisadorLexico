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
	{classeToken: 'inicio'    ,tipoToken: 'inicio'    ,lexemaToken: 'inicio'},
	{classeToken: 'varinicio' ,tipoToken: 'varinicio' ,lexemaToken: 'varinicio'},
	{classeToken: 'varfim'    ,tipoToken: 'varfim'    ,lexemaToken: 'varfim'},
	{classeToken: 'escreva'   ,tipoToken: 'escreva'   ,lexemaToken: 'escreva'},
  {classeToken: 'leia'      ,tipoToken: 'leia'      ,lexemaToken: 'leia'},
  {classeToken: 'se'        ,tipoToken: 'se'        ,lexemaToken: 'se'},
  {classeToken: 'entao'     ,tipoToken: 'entao'     ,lexemaToken: 'entao'},
  {classeToken: 'fimse'     ,tipoToken: 'fimse'     ,lexemaToken: 'fimse'},
  {classeToken: 'fim'       ,tipoToken: 'fim'       ,lexemaToken: 'fim'},
  {classeToken: 'inteiro'   ,tipoToken: 'inteiro'   ,lexemaToken: 'inteiro'},
  {classeToken: 'literal'   ,tipoToken: 'literal'   ,lexemaToken: 'literal'},
  {classeToken: 'real'      ,tipoToken: 'real'      ,lexemaToken: 'real'}
]

// Vamos implementar o automato criado pelo Julio
const maquinaDeterministica = {
  estado: 0,
  token: {
    classeToken: '', tipoToken: '', lexemaToken: ''
  },
  transitions: {
    0: {
      readCharacter: function(data){
        console.log("ESTADO:|" + this.estado + "| CARACTERE:|" + data.caractere + '|');
        console.table(tabelaDeSimbolos);
        if(data.caractere == undefined){
          this.token.classeToken = 'EOF';
          this.token.tipoToken = 'NULO';
          this.token.lexemaToken = '';
          return this.token;
        }
        
        this.token.lexemaToken = data.caractere;
        
        if(isAlfabeto(data.caractere)){
          if(isLetra(data.caractere)){
            this.token.classeToken = 'ID';
            this.token.tipoToken = 'NULO'; 
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
          }  
        }
        else{
          this.changeState(0);
          console.log("ERRO LÉXICO - Caractere inválido na linguagem. Linha " + linha + ", coluna " + coluna)
          this.token.classeToken = 'ERROR';
          this.token.tipoToken = 'NULO';
          return this.token;
        } 
      }
    },
    1: {
      readCharacter: function(data){
        if(data.caractere != undefined){
          if(isLetra(data.caractere) || isDigito(data.caractere) || data.caractere == '_'){
            this.token.lexemaToken = this.token.lexemaToken + data.caractere;
            console.log("        ESTADO:|" + this.estado + "| CARACTERE:|" + data.caractere + '|');
            console.table(tabelaDeSimbolos);
            return null;
          }
          else{
            let tokenParaInserir = this.token;
            console.log("UPDATE TOKEN ZOADO:", tokenParaInserir)
            if(SEARCH(tokenParaInserir)){ 
              //console.log("    ELE ESTA NA TABELA DE SIMBOLOS")
              // let updatedToken = UPDATE(this.token)
              // this.token = updatedToken;
              console.log("UPDATE TOKEN ZOADO:", tokenParaInserir)
              UPDATE(tokenParaInserir)
            }
            else {
              //console.log("     ELE NAO ESTA NA TABELA DE SIMBOLOS, INSERINDO O TOKEN: " + this.token.lexemaToken)
              console.log("INSERT TOKEN ZOADO:", tokenParaInserir)
              INSERT(tokenParaInserir);
            }


          }
          
          //console.log("  ACHEI UM ID: " + this.token.lexemaToken)
          //console.log("  Tabela de Simbolos antes da SEARCH")
          //console.table(tabelaDeSimbolos);
        
        }
        this.changeState(0)
        console.log("ESTADO:|" + this.estado + "| CARACTERE:|" + data.caractere + '|');
        console.table(tabelaDeSimbolos);
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
        console.log("ERRO LÉXICO – Palavra não pertence à linguagem. Linha " + linha + ", coluna " + coluna)
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
        console.log("ERRO LÉXICO – Palavra não pertence à linguagem. Linha " + linha + ", coluna " + coluna)
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
          if(data.caractere == "+" || data.caractere == "-"){
            this.token.lexemaToken = this.token.lexemaToken + data.caractere;
            this.changeState(16)
            return null;
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
        console.log("ERRO LÉXICO – Palavra não pertence à linguagem. Linha " + linha + ", coluna " + coluna)
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
  }
}

function SCANNER(data){
  let maquina = Object.create(maquinaDeterministica)
  let token
  
  //console.log("\nMAQUINA PRIMEIRO ESTADO: " + maquina.estado);
  //console.log('DATA LENGTH:' + data.length);
  for(let i = cabecote; i < data.length + 1; i++){
    token = maquina.dispatch("readCharacter", [{caractere: data[i]}]);
    
    if(token == null){
      if(i != data.length) updateLinhaEColuna(data[i]);
      continue
    }
    else {
      cabecote = i
      if(token.classeToken == 'ERROR' && isAlfabeto(token.lexemaToken) == false){
        cabecote = i + 1
        updateLinhaEColuna(data[i]);
      }
      else return token
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

function INSERT(token){
  //console.log("ANTES DO INSERT");
  //console.table(tabelaDeSimbolos);
  
  let newToken = token;
  //newToken = token;
  tabelaDeSimbolos.push(newToken)
  
  //console.log("DEPOIS DO INSERT");
  //console.table(tabelaDeSimbolos);
}

function SEARCH(token){
  //console.log("SEARCH(token):", token)
  for(let i = 0; i < tabelaDeSimbolos.length; i++){
    //console.log("i:|" + i + "| tabelaDeSimbolos[i].lexemaToken:|" + tabelaDeSimbolos[i].lexemaToken + "|")
    if(tabelaDeSimbolos[i].lexemaToken == token.lexemaToken)
      return true;
  }
    
  return false;
}

function UPDATE(token){
  for(let i = 0; i < tabelaDeSimbolos.length; i++) {
    if(tabelaDeSimbolos[i].lexemaToken == token.lexemaToken){
      return{
        classeToken: tabelaDeSimbolos[i].classeToken,
        tipoToken: tabelaDeSimbolos[i].tipoToken,
        lexemaToken: tabelaDeSimbolos[i].lexemaToken
      }
    }
  }
  console.log("UPDATE FOI CHAMADA!")
}

function main(){
  const fs = require('fs')
  const data = fs.readFileSync('./teste.txt', {encoding:'utf8', flag:'r'});
  //const data = fs.readFileSync('./exemplo.txt', {encoding:'utf8', flag:'r'});
  
  while(true){
    let token = SCANNER(data)
    
    if(token?.classeToken == "ERRO") continue
    
    console.log("Classe: " + token?.classeToken + ", Lexema: " + token?.lexemaToken + ", Tipo: " + token?.tipoToken)
    if(token?.classeToken == 'EOF') break 
  }
}

main()
console.table(tabelaDeSimbolos)
console.log(isAlfabeto(' '))
console.log(isLetra(' '))
console.log(isDigito(' '))
console.log(isCaractereDeQuebra(' '))

let tabelaTeste = [
	{classeToken: 'classe1'    ,tipoToken: 'tipo1'    ,lexemaToken: 'lexema1'},
	{classeToken: 'classe2' ,tipoToken: 'tipo2' ,lexemaToken: 'lexema2'},
	{classeToken: 'classe3'    ,tipoToken: 'tipo3'    ,lexemaToken: 'lexema3'},

]

console.table(tabelaTeste);
objetoTeste = {classeToken: 'classe4'    ,tipoToken: 'tipo4'    ,lexemaToken: 'lexema4'}
objetoTeste2 = {classeToken: 'classe5'    ,tipoToken: 'tipo5'    ,lexemaToken: 'lexema5'}
tabelaTeste.push(objetoTeste);
tabelaTeste.push(objetoTeste2);
objetoTeste2 = {classeToken: 'mudado'    ,tipoToken: 'mudado'    ,lexemaToken: 'mudado'}
tabelaTeste.push(objetoTeste2);
console.table(tabelaTeste);