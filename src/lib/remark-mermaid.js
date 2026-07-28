import { visit } from "unist-util-visit";

/**
 * Rewrites ```mermaid fences into `<Mermaid chart={"..."} />` MDX elements so
 * they reach the client-side renderer instead of the shiki highlighter.
 *
 * Must run before any code-highlighting rehype plugin.
 */
export function remarkMermaid() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      if (!parent || node.lang !== "mermaid") return;

      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "Mermaid",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "chart",
            value: {
              type: "mdxJsxAttributeValueExpression",
              value: JSON.stringify(node.value),
              data: {
                estree: {
                  type: "Program",
                  sourceType: "module",
                  body: [
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "Literal",
                        value: node.value,
                        raw: JSON.stringify(node.value),
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
        children: [],
      };
    });
  };
}

export default remarkMermaid;
