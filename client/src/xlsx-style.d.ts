declare module 'xlsx-style' {
  interface XlsxStyle {
    utils: {
      formatDate: (date: Date) => string;
      formatNumber: (number: number) => string;
    };
  }
}