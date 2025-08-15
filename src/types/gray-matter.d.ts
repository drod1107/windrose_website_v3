declare module "gray-matter" {
  interface GrayMatterData {
    data: Record<
      string,
      string | number | boolean | string[] | null | undefined
    >;
    content: string;
    excerpt?: string;
    orig: string;
  }

  interface GrayMatterOptions {
    excerpt?:
      | boolean
      | ((input: string, options: GrayMatterOptions) => string | void);
    excerpt_separator?: string;
    engines?: Record<
      string,
      {
        parse?: (input: string) => unknown;
        stringify?: (data: unknown) => string;
      }
    >;
  }

  interface GrayMatterFn {
    (str: string, options?: GrayMatterOptions): GrayMatterData;
    read(filepath: string, options?: GrayMatterOptions): GrayMatterData;
  }

  const matter: GrayMatterFn;
  export default matter;
}
