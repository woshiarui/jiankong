export interface FMPRecodeData {
  time: number
  domScore: number
}

export type HTMLElementWithCss = HTMLElement & {
  readonly style?: CSSStyleDeclaration
}