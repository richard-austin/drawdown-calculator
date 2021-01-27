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
  _textHeight!: number;

  get textHeight() : number
  {
      return this.scale > 0.75 ? this._textHeight : this._textHeight *1.5;
  }
  set textHeight(value: number)
  {
      this._textHeight = value;
  }
  scale: number = 1;
}
