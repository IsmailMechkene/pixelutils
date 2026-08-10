export type XmlFormatResult = { readonly ok: true; readonly value: string } | { readonly ok: false; readonly error: string };
const tokenPattern = /<!\[CDATA\[[\s\S]*?\]\]>|<!--[\s\S]*?-->|<\?[^]*?\?>|<[^>]+>|[^<]+/g;
export function formatXml(input: string): XmlFormatResult {
  if (!input.trim()) return { ok: false, error: "Enter XML to format." };
  const tokens = input.match(tokenPattern);
  if (!tokens || tokens.join("") !== input) return { ok: false, error: "Invalid XML: an element is not closed." };
  const output: string[] = []; const stack: string[] = [];
  for (const raw of tokens) {
    const token = raw.trim(); if (!token) continue;
    if (token.startsWith("</")) { const name = token.slice(2, -1).trim(); if (stack.pop() !== name) return { ok: false, error: `Invalid XML: unexpected closing tag </${name}>.` }; output.push(`${"  ".repeat(stack.length)}${token}`); }
    else if (token.startsWith("<") && !token.startsWith("<?") && !token.startsWith("<!--") && !token.startsWith("<![CDATA[") && !token.endsWith("/>")) { const name = /^<([\w:.-]+)/.exec(token)?.[1]; if (!name) return { ok: false, error: "Invalid XML: malformed opening tag." }; output.push(`${"  ".repeat(stack.length)}${token}`); stack.push(name); }
    else output.push(`${"  ".repeat(stack.length)}${token}`);
  }
  return stack.length ? { ok: false, error: `Invalid XML: <${stack.at(-1)}> is not closed.` } : { ok: true, value: output.join("\n") };
}
