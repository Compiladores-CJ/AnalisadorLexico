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
        console.log('ESTADO 0 readCharacter', data)
        //if((data.caractere == 0 && data.caractere != " ") || data.caractere == undefined){
        if((data.caractere != " " && data.caractere != "\n" && data.caractere == 0) || data.caractere == undefined){
          this.token.classeToken = 'EOF';
          this.token.tipoToken = 'NULO';
          this.token.lexemaToken = '';
          return this.token;
        }
        
        this.token.lexemaToken = data.caractere;
        //console.log("Caractere na Maquina: " + data.caractere)
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
          ///////////////////////////////////////////////////////////////////////////////////////////
          } else if(isCaractereDeQuebra(data.caractere)){
            console.log('HEY, O ERRO ESTAVA AQUI O TEMPO TODO!!!!!!!')
            
            //this.changeState(22);
            this.changeState(0);
          }  
        }
        else{
          console.log("ERRO LÉXICO - Caractere inválido na linguagem. Linha " + linha + ", coluna " + coluna)
          this.token.classeToken = 'ERROR';
          this.token.tipoToken = 'NULO';
          return this.token; 
        } 
      }
    },
    1: {
      readCharacter: function(data){
        console.log('ESTADO 1 readCharacter', data)
        if(data.caractere != undefined){
          this.token.classeToken = 'ID';
          this.token.tipoToken = 'NULO'; 
          if(isLetra(data.caractere) || isDigito(data.caractere) || data.caractere == '_'){
            this.token.lexemaToken = this.token.lexemaToken + data.caractere;
            return null;
          } 
          else{
            console.log('MACA MACA MACA MACA MACA', this.token);
            this.changeState(0)
            if(SEARCH(this.token)){ 
              console.log('BANANA BANANA BANANA BANANA');
              let updatedToken = UPDATE(this.token)
              this.token = updatedToken;
            }
            else{
              console.log('PERA PERA PERA PERA PERA PERA');
              this.token.classeToken = 'ID';
              this.token.tipoToken = 'NULO';      
            }
            INSERT(this.token);
            return this.token;  
          }
        }
        else{
          console.log("PRA QUE DIABOS SERVE ESSE OUTRO IF, VAMOS DESCOBRIR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        }
        // if(data.caractere != " "){
        //   this.changeState(0)
        //   if(SEARCH(this.token)){ 
        //     let updatedToken = UPDATE(this.token)
        //     this.token = updatedToken;
        //   }
        //   else{
        //     this.token.classeToken = 'ID';
        //     this.token.tipoToken = 'NULO';      
        //   }
        //   return this.token;  
        // }
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
          else{
            this.changeState(0)
            this.token.classeToken = 'NUM';
            return this.token;
          }
        }
      }
    },
    12:{
      readCharacter: function(data){
        this.token.lexemaToken = this.token.lexemaToken + data.caractere;
        if(isDigito(data.caractere)){
          this.changeState(13)
          return null;
        }
        else{
          console.log("ERRO LÉXICO – Palavra não pertence à linguagem")
          this.changeState(0);
          this.token.classeToken = 'ERROR';
          this.token.tipoToken = 'NULO';
          return this.token;
        }    
      }
    },
    13:{
      readCharacter: function(data){
        this.token.lexemaToken = this.token.lexemaToken + data.caractere;
        if(isDigito(data.caractere)) return null;
        else{
          if(data.caractere == "e" || data.caractere == "E"){
            this.changeState(14)
            return null;
          }
          else{
            this.changeState(0)
            this.token.classeToken = 'NUM';
            return this.token;
          }
        }
      }
    },
    14:{
      readCharacter: function(data){
        this.token.lexemaToken = this.token.lexemaToken + data.caractere;
        if(isDigito(data.caractere)){
          this.changeState(15)
          return null;
        }
        else{
          if(data.caractere == "+" || data.caractere == "-"){
            this.changeState(16)
            return null;
          }
          else{
            console.log("ERRO LÉXICO – Palavra não pertence à linguagem")
            this.changeState(0);
            this.token.classeToken = 'ERROR';
            this.token.tipoToken = 'NULO';
            return this.token;
          }
        }
      }
    },
    15:{
      readCharacter: function(data){
        this.token.lexemaToken = this.token.lexemaToken + data.caractere;
        if(isDigito(data.caractere)) return null;
        else{
          if(data.caractere == "+" || data.caractere == "-"){
            this.changeState(16)
            return null;
          }
          else{
            this.changeState(0)
            this.token.classeToken = 'NUM';
            return this.token;
          }
        }
      }
    },
    16:{
      readCharacter: function(data){
        this.token.lexemaToken = this.token.lexemaToken + data.caractere;
        if(isDigito(data.caractere)){
          this.changeState(15)
          return null;
        }
        else{
          console.log("ERRO LÉXICO – Palavra não pertence à linguagem")
          this.changeState(0);
          this.token.classeToken = 'ERROR';
          this.token.tipoToken = 'NULO';
          return this.token;
        }
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
        // arrumar o erro de comentário que nao fecha!
        this.token.lexemaToken = this.token.lexemaToken + data.caractere;
        if(data.caractere == '}'){
          this.changeState(21);
          return null;
        }
        else {
          /*if(data.caractere != 0 || isCaractereDeQuebra(data.caractere)){
            return null;
          } */
          if(data.caractere == 0 && data.caractere != " "){
            console.log("ERRO LÉXICO – Comentário não foi fechado, linha " + linha + ", coluna " + coluna)
            this.changeState(0);
            this.token.classeToken = 'ERROR';
            this.token.tipoToken = 'NULO';
            return this.token;
          }  
          if(data.caractere == " "){
            return null;
          } 
        } 
      }
    },
    21:{
      readCharacter: function(data){
        this.changeState(0)
        this.token.classeToken = 'COMENTÁRIO';
        this.token.tipoToken = 'NULO';
        return this.token;
      }
    },
    22:{
      readCharacter: function(data){
        this.token.lexemaToken = data.caractere;
        this.changeState(0)
        this.token.classeToken = 'IGNORAR';
        this.token.tipoToken = 'NULO';
        return this.token;
      }
    }
  },
  dispatch(actionName, ...payload){
    const actions = this.transitions[this.estado];
    const action = this.transitions[this.estado][actionName];
    let result
    
    if(action){
      result = action.apply(maquinaDeterministica, ...payload);
      //console.log("Estado atual: " + this.estado)
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
    this.token.tipoToken = '';
    this.token.lexemaToken = '';
  }
}

function SCANNER(data){
  let maquina = Object.create(maquinaDeterministica)
  let token
  
  //console.log("\nMAQUINA PRIMEIRO ESTADO: " + maquina.estado);
  console.log('DATA LENGTH:' + data.length);
  for(let i = cabecote; i < data.length + 1; i++){
    //console.log("Lendo caractere: " + data[i])
    if(i != data.length) updateLinhaEColuna(data[i]); 
    
    console.log('|' + data[i] + '|')
    token = maquina.dispatch("readCharacter", [{caractere: data[i]}]);
    
    console.log('TOKEN:');
    console.log(token);
    if(token == null) {
      //console.log('ENTRANDO AQUI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      continue
    }
    else {
      cabecote = i
      if(token.classeToken != 'IGNORAR') return token
      else {
        //console.log("Ignorando Espaço")
        //cabecote++
      }
    }
  }
  
  function updateLinhaEColuna(caractere){
    codigoASCII = caractere.charCodeAt(0);
    coluna++;
    
    if(codigoASCII == '10'){
      linha++;
      coluna = 0;
    }
  }
}

function INSERT(token){
  console.log("ANTES DO INSERT");
  console.table(tabelaDeSimbolos);
  tabelaDeSimbolos.push(token)
  
  console.log("DEPOIS DO INSERT");
  console.table(tabelaDeSimbolos);
}

function SEARCH(token){
  for(let i = 0; i < tabelaDeSimbolos.length; i++)
    if(tabelaDeSimbolos[i].lexemaToken == token.lexemaToken){
      console.log("SEARCH IF LOUCO ATIVAR", token);
      return true
    }
      
  console.log("SEARCH CHAMANDO INSERT E RETORNANDO FALSE");
  //INSERT(token)
  return false
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
}

function main(){
  const fs = require('fs')
  const data = fs.readFileSync('./teste2.txt', {encoding:'utf8', flag:'r'});
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