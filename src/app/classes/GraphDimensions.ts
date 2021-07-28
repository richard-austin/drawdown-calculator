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
  readonly xCalOffset!: number;  // Downward offset for years calibration
  readonly yCalOffsetAi!: number; // Leftward offset for annual income calibration
  readonly yCalOffsetRf!: number; // Leftward offset for remaining funds calibration
  readonly yOffsetBoxRf!: number; // Downward offset for floating remaining funds box
  readonly yOffsetBoxAi!: number; // Downward offset for floating annual income box

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
