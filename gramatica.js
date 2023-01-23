const Gramatica = {
	1:  {"naoTerminal": 'P\'',    "producao": 'P'},
	2:  {"naoTerminal": 'P',      "producao": 'inicio V A'},
  3:  {"naoTerminal": 'V',      "producao": 'varinicio LV'},
  4:  {"naoTerminal": 'LV',     "producao": 'D LV'},
  5:  {"naoTerminal": 'LV',     "producao": 'varfim pt_v'},
  6:  {"naoTerminal": 'D',      "producao": 'TIPO L pt_v'},
	7:  {"naoTerminal": 'L',      "producao": 'id vir L'},
  8:  {"naoTerminal": 'L',      "producao": 'id'},
  9:  {"naoTerminal": 'TIPO',   "producao": 'inteiro'},
  10: {"naoTerminal": 'TIPO',   "producao": 'real'},
  11: {"naoTerminal": 'TIPO',   "producao": 'literal'},
	12: {"naoTerminal": 'A',      "producao": 'ES A'},
  13: {"naoTerminal": 'ES',     "producao": 'leia id pt_v'},
  14: {"naoTerminal": 'ES',     "producao": 'escreva ARG pt_v'},
  15: {"naoTerminal": 'ARG',    "producao": 'lit'},
  16: {"naoTerminal": 'ARG',    "producao": 'num'},
	17: {"naoTerminal": 'ARG',    "producao": 'id'},
  18: {"naoTerminal": 'A',      "producao": 'CMD A'},
  19: {"naoTerminal": 'CMD',    "producao": 'id atr LD pt_v'},
  20: {"naoTerminal": 'LD',     "producao": 'OPRD opa OPRD'},
  21: {"naoTerminal": 'LD',     "producao": 'OPRD'},
	22: {"naoTerminal": 'OPRD',   "producao": 'id'},
  23: {"naoTerminal": 'OPRD',   "producao": 'num'},
  24: {"naoTerminal": 'A',      "producao": 'COND A'},
  25: {"naoTerminal": 'COND',   "producao": 'CAB CP'},
  26: {"naoTerminal": 'CAB',    "producao": 'se ab_p EXP_R fc_p então'},
	27: {"naoTerminal": 'EXP_R',  "producao": 'OPRD opr OPRD'},
  28: {"naoTerminal": 'CP',     "producao": 'ES CP'},
  29: {"naoTerminal": 'CP',     "producao": 'CMD CP'},
  30: {"naoTerminal": 'CP',     "producao": 'COND CP'},
  31: {"naoTerminal": 'CP',     "producao": 'fimse'},
  32: {"naoTerminal": 'A',      "producao": 'fim'}
}

module.exports = {
	Gramatica
}