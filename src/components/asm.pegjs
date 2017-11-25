{
  function filledArray(count, value) {
    return Array.apply(null, new Array(count))
      .map(function() { return value; });
  }

  function extractOptional(optional, index) {
    return optional ? optional[index] : null;
  }

  function extractList(list, index) {
    return list.map(function(element) { return element[index]; });
  }

  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index));
  }

  function optionalList(value) {
    return value !== null ? value : [];
  }
}

start = 
  __ program:Program __ { return program }
  
Program =
  body:SourceElements? { return {type: "program", body: optionalList(body) } }
  
SourceElements = 
  head:SourceElement tail:(__ SourceElement)* { return buildList(head, tail, 1) }

SourceElement =
  instruction / 
  label
  
Comment = 
  ";" (!EOL .)* 
  
label = 
  id:identifier ":" __ {return {type:"label", name: id.name, line: location().start.line } }
  
identifier = 
  !opcode head:[a-zA-Z] tail:[a-zA-Z0-9]+ { return {type: "identifier", name: head + tail.join("") }; }

  
instruction "instruction" = 
  oc:opcode _ al:argumentlist? { return {type: "instruction", opcode: oc.toUpperCase(), arglist: al, line: location().start.line }}

opcode =
  "MOV"i / "CALL"i / "PUSH"i / "INC"i / "CMP"i / "JNZ"i / "POP"i / "RET"i / "JMP"i / "HLT"i / "DB"
  
argumentlist = 
  head:argument 
  tail:(__ ',' __ a:argument {return a})* 
  { return Array.prototype.concat.apply(head,tail) }
  
argument = 
  register /
  number /
  identifier / 
  string /
  '[' r:register ']' { r.type = "address"; return r }

string =
  '"' str:stringcharacter* '"' { return {type: "string", value: str.join("") } }
  
stringcharacter
  = !('"' / "\\" / EOL) . { return text() }
    
register = 
  c:registerName {return {type: "register", value: text()} }
  
registerName = 
  "A" / "B" / "C" / "D" 
  
number =
  n:[0-9]+ { return {type: "number", value: parseInt(n.join(""))} }

EOL = 
  '\r'? '\n' 

WhiteSpace =
  [ \t\n\r]
  
__ = 
  (WhiteSpace / EOL / Comment)*
  
_ =
  WhiteSpace*