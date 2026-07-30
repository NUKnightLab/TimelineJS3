import { Props } from './timelinejs3'

declare module '@knight-lab/timelinejs' {
  export class Timeline {
    constructor(
      containerId: string,
      data: Props.Data,
      options?: Props.Options
    )
  }
}
