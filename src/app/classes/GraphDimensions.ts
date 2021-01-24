export class GraphDimensions
{
  constructor(init?:Partial<GraphDimensions>) {
    Object.assign(this, init) ;
  }
  readonly height!: number;
  readonly width!: number;
  readonly topBorder!: number;
  readonly leftBorder!: number;
  readonly rightBorder!: number;
  readonly bottomBorder!: number;
  readonly textHeight!: number;
}
