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

function isCaractereNaoReconhecido(caractere) {
	if([":","!","?","\\","[","]","\'",].includes(caractere))
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
  
  // Vamos implementar o automato criado pelo Julio
const maquinaDeterministica = {
	estado: 0,
	// token: {
	// 	classeToken: '', tipoToken: '', lexemaToken: ''
	// },
	lexema: "",
	transitions: {
	  0: {
			readCharacter: function(data){
				console.log("HEEEEEY:", data.caractere)
				this.verificacaoComum(data.caractere, () => {
					if(isLetra(data.caractere)){
						console.log("HEEEEEY:", data.caractere)
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
					} else {
						console.log("EITA, COMO VIM PARAR AQUI!")
					}
				})
				return {};
			}
			},
	  1: {
			readCharacter: function(data){
				this.verificacaoComum(data.caractere, () => {
					if(isLetra(data.caractere) || isDigito(data.caractere) || data.caractere == '_'){
						this.expandirLexema(data.caractere);
						return {};
					} else{
						return {classeToken: 'ID', tipoToken: 'NULO', lexemaToken: lexema};
					}
				})
			}
	  },
	  2:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  3:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  4:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  5:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  6: {
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  7:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  8:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  9:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  10:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  11: {
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  12:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  13:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  14:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  15:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  16:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  17:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  18:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  19:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  20:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  },
	  21:{
			readCharacter: function(data){
				if(data.caractere === undefined)
					return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
				else{

				}
			}
	  }
	},
	dispatch(actionName, ...payload){
	  const actions = this.transitions[this.estado];
	  const action = this.transitions[this.estado][actionName];
	  let result
	  
	  if(action){
			result = action.apply(maquinaDeterministica, ...payload);
			return result;
	  } else {
		//action is not valid for current state
	  }
	},
	verificacaoComum(caractere, verificacaoEspecifica){
		if(caractere === undefined)
			return {classeToken: 'EOF', tipoToken: 'NULO', lexemaToken: ''};
		else{
			if(isAlfabeto(caractere)){
				if(isCaractereNaoReconhecido(caractere)){
					this.changeState(0);
					console.log("ERRO LÉXICO – Palavra não reconhecida. Linha " + linha + ", coluna " + coluna)
					return {classeToken: 'ERROR', tipoToken: 'NULO', lexemaToken: lexema};
				} else if(isCaractereDeQuebra(caractere)){
					this.changeState(0);
					return {};
				} else {
					verificacaoEspecifica();
				}
			} else{
				this.changeState(0);
				console.log("ERRO LÉXICO - Caractere inválido na linguagem. Linha " + linha + ", coluna " + coluna)
				return {classeToken: 'ERROR', tipoToken: 'NULO', lexemaToken: lexema};
			}
		}
	},
	changeState(novoEstado){
	  this.estado = novoEstado;
	},
	expandirLexema(caractere){
		this.lexema = this.lexema + caractere;
	},
	resetarLexema(){
	  this.lexema = '';
	}
}
  
function SCANNER(data, maquina){
let token = {};

	for(let i = cabecote; i < data.length + 1; i++){
		console.log("scanner:|" + data[i] + '|' + typeof data[i]);
		token = maquina.dispatch("readCharacter", [{caractere: data[i]}]);
		
		if(data[i] != undefined)
			updateLinhaEColuna(data[i]);

		// if(token !== {}){
		// 	cabecote = i
		// 	if(token.classeToken === 'ERROR'){
		// 		cabecote = i + 1
		// 		updateLinhaEColuna(data[i]);
		// 	}
		// 	else 
		// 		return token
		// }
		console.log('TOKEN NA SCANNER:', token);
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
  
function main(){
	const fs = require('fs');
	const data = fs.readFileSync('./teste.txt', {encoding:'utf8', flag:'r'});
	//const data = fs.readFileSync('./exemplo.txt', {encoding:'utf8', flag:'r'});
	let maquina = Object.create(maquinaDeterministica);
	
	while(true){
	  let token = SCANNER(data, maquina)
	  
	  //if(token?.classeToken == "ERRO") continue
	  
	  //console.log("Classe: " + token?.classeToken + ", Lexema: " + token?.lexemaToken + ", Tipo: " + token?.tipoToken)
	  //console.table(tabelaDeSimbolos);
	  
	  if(token.classeToken === 'EOF') break;
	}
}
  
main()
console.table(tabelaDeSimbolos)