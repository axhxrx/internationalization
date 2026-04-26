export const Fragment = Symbol.for('test.fragment');

export function jsx(
  type: unknown,
  props: Record<string, unknown> | null,
)
{
  return {
    type,
    props,
  };
}

export const jsxs = jsx;
