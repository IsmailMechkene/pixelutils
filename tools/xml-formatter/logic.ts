import {
  DOMParser,
  XMLSerializer,
  type Document,
  type Element,
  type Node,
} from "@xmldom/xmldom";

export type XmlFormatResult =
  | { readonly ok: true; readonly value: string }
  | { readonly ok: false; readonly error: string };

function formatElement(element: Element, depth: number): string {
  const serializer = new XMLSerializer();
  const indent = "  ".repeat(depth);
  const attributes = Array.from(element.attributes)
    .map((attribute) => ` ${attribute.name}="${attribute.value}"`)
    .join("");
  const children = Array.from(element.childNodes);
  if (children.length === 0) return `${indent}<${element.tagName}${attributes}/>`;

  const hasStructuralChild = children.some((child) => child.nodeType !== 3);
  const hasMeaningfulText = children.some(
    (child) => child.nodeType === 3 && child.nodeValue?.trim(),
  );
  if (!hasStructuralChild || hasMeaningfulText) {
    return `${indent}${serializer.serializeToString(element)}`;
  }

  const formattedChildren = children
    .filter((child) => child.nodeType !== 3 || child.nodeValue?.trim())
    .map((child) => formatNode(child, depth + 1))
    .join("\n");
  return `${indent}<${element.tagName}${attributes}>\n${formattedChildren}\n${indent}</${element.tagName}>`;
}

function formatNode(node: Node, depth: number): string {
  const serializer = new XMLSerializer();
  if (node.nodeType === 1) return formatElement(node as Element, depth);
  return `${"  ".repeat(depth)}${serializer.serializeToString(node)}`;
}

export function formatXml(input: string): XmlFormatResult {
  if (!input.trim()) return { ok: false, error: "Enter XML to format." };

  const errors: string[] = [];
  let document: Document;
  try {
    document = new DOMParser({
      onError: (level, message) => {
        if (level !== "warning") errors.push(message);
      },
    }).parseFromString(input, "application/xml");
  } catch (error) {
    return {
      ok: false,
      error: `Invalid XML: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  if (errors.length > 0 || !document.documentElement) {
    return { ok: false, error: `Invalid XML: ${errors[0] ?? "no document element found."}` };
  }

  const declaration = input.match(/^\s*(<\?xml\s[^?]*\?>)/i)?.[1];
  const value = formatElement(document.documentElement, 0);
  return { ok: true, value: declaration ? `${declaration}\n${value}` : value };
}
