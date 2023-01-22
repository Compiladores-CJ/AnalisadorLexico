const Gramatica = {
	0:  {"naoTerminal": 'P\'',    "producao": 'P'},
	1:  {"naoTerminal": 'P',      "producao": 'inicio V A'},
  2:  {"naoTerminal": 'V',      "producao": 'varinicio LV'},
  3:  {"naoTerminal": 'LV',     "producao": 'D LV'},
  4:  {"naoTerminal": 'LV',     "producao": 'varfim pt_v'},
  5:  {"naoTerminal": 'D',      "producao": 'TIPO L pt_v'},
	6:  {"naoTerminal": 'L',      "producao": 'id vir L'},
  7:  {"naoTerminal": 'L',      "producao": 'id'},
  8:  {"naoTerminal": 'TIPO',   "producao": 'inteiro'},
  9:  {"naoTerminal": 'TIPO',   "producao": 'real'},
  10: {"naoTerminal": 'TIPO',   "producao": 'literal'},
	11: {"naoTerminal": 'A',      "producao": 'ES A'},
  12: {"naoTerminal": 'ES',     "producao": 'leia id pt_v'},
  13: {"naoTerminal": 'ES',     "producao": 'escreva ARG pt_v'},
  14: {"naoTerminal": 'ARG',    "producao": 'lit'},
  15: {"naoTerminal": 'ARG',    "producao": 'num'},
	16: {"naoTerminal": 'ARG',    "producao": 'id'},
  17: {"naoTerminal": 'A',      "producao": 'CMD A'},
  18: {"naoTerminal": 'CMD',    "producao": 'id atr LD pt_v'},
  19: {"naoTerminal": 'LD',     "producao": 'OPRD opa OPRD'},
  20: {"naoTerminal": 'LD',     "producao": 'OPRD'},
	21: {"naoTerminal": 'OPRD',   "producao": 'id'},
  22: {"naoTerminal": 'OPRD',   "producao": 'num'},
  23: {"naoTerminal": 'A',      "producao": 'COND A'},
  24: {"naoTerminal": 'COND',   "producao": 'CAB CP'},
  25: {"naoTerminal": 'CAB',    "producao": 'se ab_p EXP_R fc_p então'},
	26: {"naoTerminal": 'EXP_R',  "producao": 'OPRD opr OPRD'},
  27: {"naoTerminal": 'CP',     "producao": 'ES CP'},
  28: {"naoTerminal": 'CP',     "producao": 'CMD CP'},
  29: {"naoTerminal": 'CP',     "producao": 'COND CP'},
  30: {"naoTerminal": 'CP',     "producao": 'fimse'},
  31: {"naoTerminal": 'A',      "producao": 'fim'}
}

module.exports = {
	Gramatica
}