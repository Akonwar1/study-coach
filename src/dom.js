/** Builds an element: el("p", { className, text, attrs }, [children]). Text is never parsed as HTML. */
export function el(tag, { className, text, attrs } = {}, children = []) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  for (const [name, value] of Object.entries(attrs ?? {})) node.setAttribute(name, value);
  for (const child of children) node.append(child);
  return node;
}

export function button(label, { primary = false, onClick, disabled = false } = {}) {
  const node = el("button", { className: `btn${primary ? " primary" : ""}`, text: label, attrs: { type: "button" } });
  node.disabled = disabled;
  if (onClick) node.addEventListener("click", onClick);
  return node;
}
