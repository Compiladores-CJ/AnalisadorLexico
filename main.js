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
let coluna = 1
let cabecote
let palavra = []

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
//teste
// Vamos implementar o automato criado pelo Julio
const maquinaDeterministica = {
  estado: 0,
  transitions: {
    0: {
      readCharacter: function(data){
        if(isAlfabeto(data.caractere)){
          if(isLetra(data.caractere)){
            this.changeState(1);
          }
        }
        else{
          // erro, caracter nao identificado
          this.changeState(22);
        }
      }
    },
    1: {
      readCharacter: function(data){
        // console.log("tipo data:" + typeof data);
        // console.log("tipo data.caractere:" +  data.caractere);
        console.log("Estado atual: " + this.estado)
        // console.log("Codigo ASCII: "  + data.caractere)
        if(isLetra(data.caractere) || isDigito(data.caractere) || data.caractere == '_'){
          console.log("Ainda lendo um id")
        }
        else{
          if(isCaractereDeQuebra(data.caractere)){
            console.log("Lendo um espaço, quebra de linha ou tab. Ignorar...")
            this.changeState(0)
          }
          else{
            this.changeState(0)
          }
        }
      }
    },
    11: {

    },
    17: {

    },
    22: {

    }
  },
  dispatch(actionName, ...payload){
    const actions = this.transitions[this.estado];
    const action = this.transitions[this.estado][actionName];

    if(action){
      action.apply(maquinaDeterministica, ...payload);
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
  palavra = ""
  
  console.log("MAQUINA PRIMEIRO ESTADO: " + maquina.estado);

  for(let i = cabecote; i < data.length; i++){

    updateLinhaEColuna(data[i]);

    console.log("Passo: " + i + " Estado: " + maquina.estado + " Lexema: " + palavra)
    maquina.dispatch("readCharacter", [{caractere: data[i]}]);
    if(maquina.estado != 0){
      palavra = palavra + data[i]
    }
    else{
      cabecote = i+1
      //console.log("----> " + palavra)
      return {
        classeToken: 'id',
        tipoToken: 'NULO',
        lexemaToken: palavra
      }
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

function INSERT(){

}

function SEARCH(){

}

function UPDATE(){

}

function main(){
  const fs = require('fs')
  const data = fs.readFileSync('./teste.txt', {encoding:'utf8', flag:'r'});
  cabecote = 0

  
  // for(let i = 0; i<data.length; i++){
  //   if(data.charCodeAt(i) == '13')
  //     console.log('Caractere:|' + '<-' + '| ASCII:|' + data.charCodeAt(i) + '| LINHA:|' + linha + '| COLUNA:|' + coluna + '|')
  //   else if(data.charCodeAt(i) == '10')
  //     console.log('Caractere:|' + '\\n' + '| ASCII:|' + data.charCodeAt(i) + '| LINHA:|' + linha + '| COLUNA:|' + coluna + '|');
  //   else
  //     console.log('Caractere:|' + data[i] + '| ASCII:|' + data.charCodeAt(i) + '| LINHA:|' + linha + '| COLUNA:|' + coluna + '|');

  //   coluna++;
  //   if(data.charCodeAt(i) == '10'){
  //     linha++;
  //     coluna = 0;
  //   }
  // }

  //console.log(data)
  /*console.log(data.charAt(6))
  console.log(data.charCodeAt(6))
  if(alfabeto.includes(data.charCodeAt(6))){
    console.log("Tá aqui mesmo")
  }
  
  console.log(data.charAt(7))
  console.log(data.charCodeAt(7))
  if(alfabeto.includes(data.charCodeAt(7))){
    console.log("Tá aqui mesmo")
  }
  
  console.log(data.charAt(8))
  console.log(data.charCodeAt(8))

  console.log(data.charAt(9))
  console.log(data.charCodeAt(9))
  
  console.log(data.charAt(10))
  console.log(data.charCodeAt(10))
  if(alfabeto.includes(data[10])){
    console.log("Tá aqui mesmo")
  }
  */
  
  //while(true){



	for(let i=0; i< 2; i++){
    let token = SCANNER(data)
    if(token?.classeToken == "ERRO"){
      continue
    }
    else{
      if(token?.classeToken == "EOF") break
      else console.log("Classe: " + token?.classeToken + ", Lexema: " + token?.lexemaToken + ", Tipo:" + token?.tipoToken)
    }
  }

  
}

main()

/*const buffer = fs.createReadStream('./exemplo.txt', {
    encoding: "utf8",
    highWaterMark: 1,
  });*/
  /*buffer.on("data", (data) => {
		if(alfabeto.includes(data)){
			console.log("Caractere legal")
      return
    }
    else{
      console.log("CARACTERE DESCONHECIDO NA LINGUAGEM: " + data);
      return
    }
    
  })*/