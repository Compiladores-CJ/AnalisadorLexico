
const digitos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const demaisCaracteres = [',', ';', ':', '.', '!', '?', '\\', '*', '+', '-', '/', '(', ')', '{', '}', '[', ']', '<', '>', '=', '\'', '\"']
const caracteresDescatados = [' ', '	', '\n']

const alfabeto = digitos.concat(letras).concat(demaisCaracteres)
let linha = 0
let coluna = 0

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

function SCANNER(buffer){
	console.log("Entrei no scanner");
	buffer.on("data", (data) => {
		if(alfabeto.includes(data)){
			console.log("Caractere legal")
		}
    else{
      console.log("CARACTERE DESCONHECIDO NA LINGUAGEM: " + data);
    }
    return
  })
  
	return {
		classeToken: 'X',
		tipoToken: 'Y',
		lexemaToken: 'Z'
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
  const buffer = fs.createReadStream('./exemplo.txt', {
    encoding: "utf8",
    highWaterMark: 1,
  });
	
  //while(true){
	//for(let i=0; i< 10; i++){
    let token = SCANNER(buffer)
    if(token.classeToken == "ERRO"){
      //continue
    }
    //else{
      //if(token.classeToken == "EOF") //break
      //else console.log("Classe: " + token.classeToken + ", Lexema: " + token.lexemaToken + ", Tipo:" + token.tipoToken)
    //}
  //}
}

main()