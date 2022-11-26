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

//const digitos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
//const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
//const demaisCaracteres = [',', ';', ':', '.', '!', '?', '\\', '*', '+', '-', '/', '(', ')', '{', '}', '[', ']', '<', '>', '=', '\'', '\"', '_']

let linha = 1
let coluna = 0
let cabecote
let palavra = ""

let tabelaDeSimbolos = [
	{classeToken: 'inicio', tipoToken: 'inicio', lexemaToken: 'inicio'},
	{classeToken: 'varinicio', tipoToken: 'varinicio', lexemaToken: 'varinicio'},
	{classeToken: 'varfim', tipoToken: 'varfim', lexemaToken: 'varfim'},
	{classeToken: 'escreva', tipoToken: 'escreva', lexemaToken: 'escreva'},
  {classeToken: 'leia', tipoToken: 'leia', lexemaToken: 'leia'},
  {classeToken: 'se', tipoToken: 'se', lexemaToken: 'se'},
  {classeToken: 'entao', tipoToken: 'entao', lexemaToken: 'entao'},
  {classeToken: 'fimse', tipoToken: 'fimse', lexemaToken: 'fimse'},
  {classeToken: 'fim', tipoToken: 'fim', lexemaToken: 'fim'},
  {classeToken: 'inteiro', tipoToken: 'inteiro', lexemaToken: 'inteiro'},
  {classeToken: 'literal', tipoToken: 'literal', lexemaToken: 'literal'},
  {classeToken: 'real', tipoToken: 'real', lexemaToken: 'real'}
]

// Vamos implementar o automato criado pelo Julio
const maquinaDeterministica = {
  estado: 0,
  transitions: {
    0: {
      readCharacter: function(data){
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
          } else if(data.caractere == '('){
            this.changeState(18); 
          } else if(data.caractere == ')'){
            this.changeState(19); 
          } else if(data.caractere == '{'){
            this.changeState(20); 
          } else if(isCaractereDeQuebra(data.caractere)){
            return -2;
          } else if(data.caractere == 0){
            this.changeState(17);
          } 
          return -1;
        }
        // erro
        else return 22;
      }
    },
    1: {
      readCharacter: function(data){
        if(isLetra(data.caractere) || isDigito(data.caractere) || data.caractere == '_') return -1;
        else{
          this.changeState(0)
          return 1;  
        }
      }
    },
    2:{
      readCharacter: function(data){
        if(data.caractere == '-'){
          this.changeState(4)
          return -1;
        }
        if(data.caractere == '=' || data.caractere == '>'){
          this.changeState(3)
          return -1;
        }
      }
    },
    3:{
      readCharacter: function(data){
        this.changeState(0)
        return 3;
      }
    },
    4:{
      readCharacter: function(data){
        this.changeState(0)
        return 4;
      }
    },
    5:{
      readCharacter: function(data){
        if(data.caractere == '='){
          this.changeState(3)
          return -1;
        }
        else{
          this.changeState(0)
          return 5;
        }
      }
    },
    6: {
      readCharacter: function(data){
        this.changeState(0)
        return 6;
      }
    },
    7:{
      readCharacter: function(data){
        if(data.caractere == '\"'){
          this.changeState(8)
          return -1;
        }
        else return -1; 
      }
    },
    8:{
      readCharacter: function(data){
        this.changeState(0)
        return 8;
      }
    },
    9:{
      readCharacter: function(data){
        this.changeState(0)
        return 9;
      }
    },
    10:{
      readCharacter: function(data){
        this.changeState(0)
        return 10;
      }
    },
    11: {
      readCharacter: function(data){
        if(isAlfabeto(data.caractere)){
          if(isDigito(data.caractere)) return -1;
          if(isCaractereDeQuebra(data.caractere) || data.caractere == 0){
            this.changeState(0)
            return 11;
          }
          if(data.caractere == "."){
            this.changeState(12)
            return -1; 
          }
          if(data.caractere == "e" || data.caractere == "E"){
            this.changeState(14)
            return -1;
          }
        }
        else{
          this.changeState(0)
          return 11;
        }
      }
    },
    12:{
      readCharacter: function(data){
        if(isDigito(data.caractere)){
          this.changeState(13)
          return -1;
        }
        else{
          this.changeState(22)
          return -1;
        }    
      }
    },
    13:{
      readCharacter: function(data){
        if(isAlfabeto(data.caractere)){
          if(isDigito(data.caractere)) return -1;
          if(data.caractere == "e" || data.caractere == "E"){
            this.changeState(14)
            return -1;
          }
        }
        else{
          this.changeState(0)
          return 13;
        }
      }
    },
    14:{
      readCharacter: function(data){
        if(isAlfabeto(data.caractere)){
          if(isDigito(data.caractere)){
            this.changeState(15)
            return -1;
          }
          if(data.caractere == "+" || data.caractere == "-"){
            this.changeState(16)
            return -1;
          }
        }
        else{
          this.changeState(0)
          return 22;
        }
      }
    },
    15:{
      readCharacter: function(data){
        if(isAlfabeto(data.caractere)){
          if(isDigito(data.caractere)) return -1;
          if(data.caractere == "+" || data.caractere == "-"){
            this.changeState(16)
            return -1;
          }
        }
        else{
          this.changeState(0)
          return 15;
        }
      }
    },
    16:{
      readCharacter: function(data){
        if(isAlfabeto(data.caractere)){
          if(isDigito(data.caractere)){
            this.changeState(15)
            return -1;
          }
        }
        else{
          this.changeState(0)
          return 22;
        }
      }
    },
    17: {
      readCharacter: function(data){
        this.changeState(0)
        return 17;
      }
    },
    18:{
      readCharacter: function(data){
        this.changeState(0)
        return 18;
      }
    },
    19:{
      readCharacter: function(data){
        this.changeState(0)
        return 19;
      }
    },
    20:{
      readCharacter: function(data){
        if(isAlfabeto(data.caractere)){
          if(data.caractere == '}'){
            this.changeState(21);
            return -1;
          }
          if(data.caractere == 0){
            console.log("ERRO LÉXICO – Comentário não foi fechado, linha " + linha + ", coluna " + coluna)
            this.changeState(0);
            return 22;
          }
          else return -1;
        }
        else{
          console.log("ERRO LÉXICO – Caractere inválido na linguagem, linha " + linha + ", coluna " + coluna)
            this.changeState(0);
            return 22;
        } 
      }
    },
    21:{
      readCharacter: function(data){
        this.changeState(0);
        return 21; 
      }
    }
  },
  dispatch(actionName, ...payload){
    const actions = this.transitions[this.estado];
    const action = this.transitions[this.estado][actionName];
    let result
    
    if(action){
      result = action.apply(maquinaDeterministica, ...payload);
      console.log("Estado atual: " + this.estado + "\n")
      if(result === 1){
        return {
          classeToken: 'ID',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result === 2){
        return {
          classeToken: 'OPR',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result === 3){
        return {
          classeToken: 'OPR',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result === 4){
        return {
          classeToken: 'ATR',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result === 5){
        return {
          classeToken: 'OPR',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result === 6){
        return {
          classeToken: 'OPA',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result === 8){
        return {
          classeToken: 'LIT',
          tipoToken: 'literal',
          lexemaToken: ""
        }
      }
      if(result === 9){
        return {
          classeToken: 'PT_V',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result === 10){
        return {
          classeToken: 'VIR',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result === 11){
        return {
          classeToken: 'NUM',
          tipoToken: 'inteiro',
          lexemaToken: ""
        }
      }
      if(result === 13){
        return {
          classeToken: 'NUM',
          tipoToken: 'real',
          lexemaToken: ""
        }
      }
      if(result === 15){
        return {
          classeToken: 'NUM',
          tipoToken: 'inteiro',
          lexemaToken: ""
        }
      }
      if(result === 17){
        return {
          classeToken: 'EOF',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result === 18){
        return {
          classeToken: 'AB_P',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result === 19){
        return {
          classeToken: 'FC_P',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result === 21){
        return {
          classeToken: 'COMENTÁRIO',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result == 22){
        return {
          classeToken: 'ERROR',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      if(result == -2){
        return {
          classeToken: 'IGNORAR',
          tipoToken: 'NULO',
          lexemaToken: ""
        }
      }
      else{
        return null
      }
    }else{
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
  palavra = ""
  //console.log("MAQUINA PRIMEIRO ESTADO: " + maquina.estado);

  for(let i = cabecote; i < data.length; i++){
    //console.log("Passo:|" + i + "| Estado:|" + maquina.estado + '| LINHA:|' + linha + '| COLUNA:|' + coluna + "| Lexema:|" + palavra + "|")
    updateLinhaEColuna(data[i]);
    
    token = maquina.dispatch("readCharacter", [{caractere: data[i]}]);
    
    if(token == null) palavra = palavra + data[i]
    else{
      if(token.classeToken != 'IGNORAR'){
        token.lexemaToken = token.lexemaToken + palavra
        cabecote = i
        
        //verificar se está na tabela de simbolos
        if(token.classeToken == 'ID' && SEARCH(token)) token = UPDATE(token.lexemaToken)
  
        return token
      }
      else cabecote = i+1
    }
  }
  
  function updateLinhaEColuna(caractere){
    codigoASCII = caractere.charCodeAt(0);
    /*
    if(codigoASCII == '13')
      console.log('Caractere:|' + '<-' + '| ASCII:|' + codigoASCII + '| LINHA:|' + linha + '| COLUNA:|' + coluna + '|');
    else if(codigoASCII == '10')
      console.log('Caractere:|' + '\\n' + '| ASCII:|' + codigoASCII + '| LINHA:|' + linha + '| COLUNA:|' + coluna + '|');
    else
      console.log('Caractere:|' + caractere + '| ASCII:|' + codigoASCII + '| LINHA:|' + linha + '| COLUNA:|' + coluna + '|');
    */
    coluna++;
    if(codigoASCII == '10'){
      linha++;
      coluna = 0;
    }
  }
}

function INSERT(token){
  tabelaDeSimbolos.push(token)
}

function SEARCH(token){
  for(let i = 0; i < tabelaDeSimbolos.length; i++) {
    if(tabelaDeSimbolos[i].lexemaToken == token.lexemaToken) return true
    else{
      INSERT(token)
      return false
    }  
  }
}

function UPDATE(){
  for(let i = 0; i < tabelaDeSimbolos.length; i++) {
    if(tabelaDeSimbolos[i].lexemaToken == token.lexemaToken){
      return{
        classeToken: tabelaDeSimbolos[i].classeToken,
        tipoToken: tabelaDeSimbolos[i].tipoToken,
        lexemaToken: tabelaDeSimbolos[i].lexemaToken
      }
    }
  }
}

function main(){
  const fs = require('fs')
  const data = fs.readFileSync('./teste2.txt', {encoding:'utf8', flag:'r'});
  cabecote = 0
  console.log(data + "\n")
  //while(true){
	for(let i = 0; i < 7; i++){
    let token = SCANNER(data)
    if(token?.classeToken == "ERRO"){
      continue
    }
    else{
      console.log("Classe: " + token?.classeToken + ", Lexema: " + token?.lexemaToken + ", Tipo:" + token?.tipoToken)
      if(token?.classeToken == "EOF") break
    }
  }
}

main()
//console.log(tabelaDeSimbolos)