import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  delimitedIndent,
  HighlightStyle,
} from "@codemirror/language";
import { styleTags, tags } from "@lezer/highlight";
import { buildParser } from "@lezer/generator";
import { completeFromList } from "@codemirror/autocomplete";
import { JekaGrammar } from "./grammar";

const parser = buildParser(JekaGrammar);

const myHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#fc6" },
  { tag: tags.comment, color: "#f5d", fontStyle: "italic" },
]);

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
    { label: "while", type: "keyword", info: "while (condition) { }" },
    { label: "for", type: "keyword", info: "for (var i = 0; i < 10; i++) { }" },
    { label: "if", type: "keyword", info: "if (condition) { }" },
    { label: "else", type: "keyword", info: "else { }" },
    { label: "fun", type: "keyword", info: "fun functionName() { }" },
  ]),
});

export function JekaLanguage() {
  return new LanguageSupport(JekaLanguageDefined, [jekaAutoComplete]);
}
