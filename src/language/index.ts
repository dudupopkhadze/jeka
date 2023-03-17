import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  delimitedIndent,
} from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
import { buildParser } from "@lezer/generator";

const parser = buildParser(`
      @top Program { expression* }

      @skip { space | LineComment }

      expression {
        Identifier |
        Application { "(" expression* ")" }
      }

      @tokens {
        Identifier { "turnRight" | "moveForward" }

        LineComment { "//" ![\n]* }

        space { $[ \t\n\r]+ }

        "(" ")"
      }

      @detectDelim
`);

export const JekaLanguageDefined = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({ closing: ")", align: false }),
      }),
      foldNodeProp.add({
        Application: foldInside,
      }),
      styleTags({
        Identifier: t.keyword,
        Boolean: t.bool,
        String: t.string,
        LineComment: t.lineComment,
        "( )": t.paren,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: ";" },
  },
});

export function JekaLanguage() {
  return new LanguageSupport(JekaLanguageDefined);
}
