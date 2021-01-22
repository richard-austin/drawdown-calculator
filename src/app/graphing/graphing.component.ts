import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { YearTotal } from "../classes/YearTotal";

@Component({
  selector: 'app-graphing',
  templateUrl: './graphing.component.html',
  styleUrls: ['./graphing.component.scss']
})
export class GraphingComponent implements OnInit, AfterViewInit {
  @ViewChild('graph', { read: ElementRef }) graphCanvasEl!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fundsRemainingBox', { read: ElementRef }) fundsRemainingBoxEl!: ElementRef<HTMLDivElement>;
  @ViewChild('annualIncomeBox', { read: ElementRef }) annualIncomeBoxEl!: ElementRef<HTMLDivElement>;

  @Input() drawdownData!: YearTotal[];

  private graphCtx!: CanvasRenderingContext2D | null;

  readonly height: number = 400;
  readonly width: number = 950;
  readonly border: number = 20;
  readonly leftBorder: number = 90;
  readonly rightBorder: number = 70;
  readonly bottomBorder: number = 60;

  yScale!: number;
  yOffset!: number;
  xScale!: number;
  yScaleInc!: number;
  xOffset!: number;

  yearNum!: number;
  remainingFunds!: string;
  annualIncome!: string;
  remainingFundsBox!: HTMLDivElement;
  annualIncomeBox!: HTMLDivElement;

  constructor() {
  }

  draw(): void {
    // Find maximum and minimum values of remaining funds and build a linear array from the dual column data
    let maxFunds = 0;
    let minFunds = 0;
    let maxIncome = this.drawdownData[0].annualIncome;
    let minIncome = maxIncome;

    let graphCanvas: HTMLCanvasElement = this.graphCanvasEl.nativeElement;
    this.graphCtx = graphCanvas.getContext('2d');

    if (this.graphCtx) {
      // Find the max and min funds and income amounts
      this.drawdownData.forEach((yearTotal: YearTotal) => {
        if (yearTotal.remainingFunds > maxFunds)
          maxFunds = yearTotal.remainingFunds;
        else if (yearTotal.remainingFunds < minFunds)
          minFunds = yearTotal.remainingFunds;

        if (yearTotal.annualIncome > maxIncome)
          maxIncome = yearTotal.annualIncome;
        else if (yearTotal.annualIncome < minIncome)
          minIncome = yearTotal.annualIncome;
      });

      this.yScale = -(this.height - this.border - this.bottomBorder) / maxFunds;
      this.yOffset = this.height - this.bottomBorder;
      this.xScale = (this.width - this.rightBorder - this.leftBorder) / this.drawdownData.length;
      this.xOffset = this.leftBorder;

      const labelIndent = 15;

      this.yScaleInc = -(this.height - this.border - this.bottomBorder) / maxIncome;

      let textHeight: number = 10;

      let gradient: CanvasGradient = this.graphCtx.createLinearGradient(0, 0, this.width, this.height);
      gradient.addColorStop(0, '#d8d8ee');
      gradient.addColorStop(1, '#ffffff');
      this.graphCtx.fillStyle = gradient;
      this.graphCtx.fillRect(0, 0, this.width, this.height);
      this.graphCtx.fillStyle = '#000000';
      // set up the x calibration
      const years: number = this.drawdownData.length;
      this.graphCtx.beginPath();
      this.graphCtx.lineWidth = 0.25;
      this.graphCtx.strokeStyle = '#474646';
      this.graphCtx.font = textHeight + "px Arial";

      // x axis calibration
      for (let i = 0; i <= years; i += 5) {
        let x = i * this.xScale + this.xOffset;
        this.graphCtx.moveTo(x, this.height - this.bottomBorder);
        this.graphCtx.lineTo(x, this.border);
        let yearNum: string = i.toString();
        this.graphCtx.fillText(yearNum, x - this.graphCtx.measureText(yearNum).width / 2, this.height - this.bottomBorder + textHeight);
      }
      this.graphCtx.stroke();

      // y axis calibration (funds)
      for (let i: number = 0; i <= maxFunds; i += maxFunds / 5) {
        this.graphCtx.moveTo(this.leftBorder, i * this.yScale + this.yOffset);
        this.graphCtx.lineTo(this.width - this.rightBorder, i * this.yScale + this.yOffset);
        let textMetrics: TextMetrics = this.graphCtx.measureText(i.toFixed(1));
        let textWidth: number = textMetrics.width;
        this.graphCtx.fillText(i.toFixed(0), this.leftBorder - textWidth, i * this.yScale + this.yOffset + textHeight / 2);
      }
      // y axis left label (remaining funds)
      this.graphCtx.save();
      this.graphCtx.font = textHeight + "px Arial";
      this.graphCtx.translate(0, (this.border + this.height - this.bottomBorder) / 2);
      //  this.graphCtx.rotate(Math.PI / 2);
      this.graphCtx.textAlign = 'left';
      this.graphCtx.fillText("Remaining", labelIndent, -textHeight / 2);
      this.graphCtx.fillText("Funds", labelIndent, textHeight / 2);
      this.graphCtx.restore();

      // y axis calibration (Annual income)
      for (let i: number = 0, j: number = 0; j < 6; i += maxIncome / 5, ++j) {
        this.graphCtx.fillText(i.toFixed(0), this.width - this.rightBorder, i * this.yScaleInc + this.yOffset + textHeight / 2);
      }

      // y axis right label (annual income)
      this.graphCtx.save();
      this.graphCtx.translate(this.width - this.rightBorder, (this.border + this.height - this.bottomBorder) / 2);
      //     this.graphCtx.rotate(-Math.PI / 2);
      this.graphCtx.textAlign = 'left';
      this.graphCtx.fillText("Annual", labelIndent, -textHeight / 2);
      this.graphCtx.fillText("Income", labelIndent, textHeight / 2);
      this.graphCtx.stroke();
      this.graphCtx.restore();

      // x axis label
      this.graphCtx.save();
      this.graphCtx.translate(this.leftBorder + (this.width - this.leftBorder - this.rightBorder)/2, (this.height - this.bottomBorder/2));
      //     this.graphCtx.rotate(-Math.PI / 2);
      this.graphCtx.textAlign = 'center';
      this.graphCtx.fillText("Year Number", 0, 0);

      this.graphCtx.stroke();
      this.graphCtx.restore();


      this.graphCtx.lineWidth = 0.5;
      this.graphCtx.strokeStyle = '#fd0000';

      this.graphCtx.moveTo(this.drawdownData[0].yearNum * this.xScale + this.xOffset, this.drawdownData[0].annualIncome * this.yScaleInc + this.yOffset);
      this.graphCtx.beginPath();
      this.drawdownData.forEach((yearTotals: YearTotal) => {
        // @ts-ignore  Otherwise it complains that graphCtx could be null
        this.graphCtx.lineTo(yearTotals.yearNum * this.xScale + this.xOffset, yearTotals.annualIncome * this.yScaleInc + this.yOffset);
      });
      this.graphCtx.stroke();

      this.graphCtx.strokeStyle = '#ff00ff';
      this.graphCtx.moveTo(this.drawdownData[0].yearNum * this.xScale + this.xOffset, this.drawdownData[0].remainingFunds * this.yScale + this.yOffset);
      this.graphCtx.beginPath();
      this.drawdownData.forEach((yearTotals: YearTotal) => {
        // @ts-ignore  Otherwise it complains that graphCtx could be null
        this.graphCtx.lineTo(yearTotals.yearNum * this.xScale + this.xOffset, yearTotals.remainingFunds * this.yScale + this.yOffset);
      });
      this.graphCtx.stroke();
    }
  }

  showValues($event: MouseEvent):void {
    let rect: DOMRect = this.graphCanvasEl.nativeElement.getBoundingClientRect();
    let x:number = $event.clientX - rect.left;
 //   let y = $event.clientY - rect.top;

    if (this.fundsRemainingBoxEl && !this.remainingFundsBox)
      this.remainingFundsBox = this.fundsRemainingBoxEl.nativeElement;

    if(this.annualIncomeBoxEl && !this.annualIncomeBox)
      this.annualIncomeBox = this.annualIncomeBoxEl.nativeElement;

    let yearNum: number = Math.ceil((x - this.xOffset) / this.xScale);

    if (yearNum >= 0 && yearNum < 40) {
      // Remaining funds floating box
      this.remainingFundsBox.style.visibility = 'visible';
      //this.remainingFundsBox.style.top
      this.yearNum = yearNum;
      this.remainingFunds = this.drawdownData[yearNum].remainingFunds.toFixed(2);
      let rfbRect:DOMRect = this.remainingFundsBox.getBoundingClientRect();
      let rfbWidth: number = rfbRect.width;
      let padding =3.2;
      this.remainingFundsBox.style.top = (this.drawdownData[yearNum].remainingFunds * this.yScale + this.yOffset-this.height).toString() + 'px';

      // Centre the pointer on top of the box
      (<HTMLDivElement>this.remainingFundsBox.children[0]).style.left = (rfbWidth/2-padding).toString()+'px';

      // Set the box so its horizontal centre lines up with the x position
      this.remainingFundsBox.style.left = (x - this.remainingFundsBox.clientWidth/2 - padding).toString() + 'px';

      // Annual income floating box
      this.annualIncomeBox.style.visibility = 'visible';
      this.annualIncome = this.drawdownData[yearNum].annualIncome.toFixed(2);
      rfbRect = this.annualIncomeBox.getBoundingClientRect();
      rfbWidth = rfbRect.width;
      this.annualIncomeBox.style.top = (this.drawdownData[yearNum].annualIncome * this.yScaleInc + this.yOffset-this.height).toString() + 'px';

      // Centre the pointer on top of the box
      (<HTMLDivElement>this.annualIncomeBox.children[0]).style.left = (rfbWidth/2-padding).toString()+'px';

      // Set the box so its horizontal centre lines up with the x position
      this.annualIncomeBox.style.left = (x - this.annualIncomeBox.clientWidth/2 - padding).toString() + 'px';
    }
    else
      this.remainingFundsBox.style.visibility = 'hidden';
  }

  figuresOff(): void{
    this.remainingFundsBox.style.visibility = 'hidden';
    this.annualIncomeBox.style.visibility = 'hidden';
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

}
