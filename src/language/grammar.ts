export const JekaGrammar = `

    @top Program { expression }

    expression {   Number  | JekaExpression | LineComment  | Keyword | Semicolon | Boolean | Braces | BitwiseExpression | Branch | VarDeclaration }


    @tokens {

      BitwiseExpression { "==" | "!=" | "<" | ">" | "<=" | ">=" | "&&" | "||" | "+" | "-" | "*"  | "%" | "!" | "&" | "|" | "^" | "~" | "<<" | ">>" | ">>>" }

      Boolean { "true" | "false" }

      VarDeclaration { "var" }

      Branch { "if" | "else" | "while" | "for" }

      Braces { "(" | ")" }

      Semicolon { ";" }

      Keyword { "fun" }
      
      LineComment { "//" ![\n]* }

      JekaExpression { "turnLeft" | "moveForward" | "woof" | "frontIsClear" | "pickBone" | "putBone" }
    
      Number { @digit+ }

    }

    @detectDelim

`;
