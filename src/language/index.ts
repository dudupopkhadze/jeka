import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  delimitedIndent,
} from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { buildParser } from "@lezer/generator";
import { completeFromList } from "@codemirror/autocomplete";
import { JekaGrammar } from "./grammar";

const parser = buildParser(JekaGrammar);

export const JekaLanguageDefined = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({ closing: ")", align: false }),
      }),
      foldNodeProp.add({
        Application: foldInside,
      }),

      // completely unrelated mapping, just used for styles
      styleTags({
        BitwiseExpression: tags.bitwiseOperator,
        Semicolon: tags.className,
        VarDeclaration: tags.macroName,
        Keyword: tags.function(tags.keyword),
        JekaExpression: tags.keyword,
        Number: tags.number,
        Identifier: tags.keyword,
        Boolean: tags.bool,
        LineComment: tags.lineComment,
        Braces: tags.character,
        Branch: tags.atom,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "//" },
  },
});

export const jekaAutoComplete = JekaLanguageDefined.data.of({
  autocomplete: completeFromList([
    { label: "turnLeft", type: "keyword", info: "turnLeft()" },
    { label: "moveForward", type: "keyword", info: "moveForward()" },
    { label: "woof", type: "keyword", info: "woof()" },
    { label: "frontIsClear", type: "keyword", info: "frontIsClear()" },
    { label: "while", type: "keyword", info: "while (condition) { }" },
    { label: "for", type: "keyword", info: "for (var i = 0; i < 10; i++) { }" },
    { label: "if", type: "keyword", info: "if (condition) { }" },
    { label: "else", type: "keyword", info: "else { }" },
    { label: "var", type: "keyword", info: "var variableName = 0;" },
    { label: "fun", type: "keyword", info: "fun functionName() { }" },
    { label: "pickBone", type: "keyword", info: "pickBone()" },
    { label: "putBone", type: "keyword", info: "putBone()" },
  ]),
});

export function JekaLanguage() {
  return new LanguageSupport(JekaLanguageDefined, [jekaAutoComplete]);
}
