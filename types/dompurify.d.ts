declare module 'dompurify' {
  export function sanitize(markup: string): string;
  const DOMPurify: {
    sanitize: (s: string) => string;
  };
  export default DOMPurify;
}
