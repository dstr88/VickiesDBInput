declare module 'he' {
  export function encode(text: string, options?: any): string;
  export function decode(html: string, options?: any): string;
  export function escape(text: string): string;
  export function unescape(html: string): string;
}
