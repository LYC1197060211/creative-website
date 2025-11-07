// Type definitions for mammoth.js
declare module 'mammoth' {
  interface RawText {
    value: string
  }

  interface DocumentResult {
    value: string
    messages: Array<{
      type: string
      message: string
    }>
  }

  function convertToHtml(options: { arrayBuffer: ArrayBuffer }): Promise<DocumentResult>
  function convertToMarkdown(options: { arrayBuffer: ArrayBuffer }): Promise<DocumentResult>
  function convertToRawText(options: { arrayBuffer: ArrayBuffer }): Promise<RawText>
  function extractRawText(options: { path: string }): Promise<RawText>

  export = {
    convertToHtml,
    convertToMarkdown,
    convertToRawText,
    extractRawText
  }
}