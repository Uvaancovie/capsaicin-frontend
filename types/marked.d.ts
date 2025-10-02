declare module 'marked' {
  export function parse(input: string): string;
  export function parseInline(input: string): string;
  const _default: {
    parse: (s: string) => string;
    parseInline: (s: string) => string;
  };
  export default _default;
}
