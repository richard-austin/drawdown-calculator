import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {YearTotal} from '../classes/YearTotal';
import {YearTotalSingle} from "../classes/YearTotalSingle";

@Component({
  selector: 'app-graphing',
  templateUrl: './graphing.component.html',
  styleUrls: ['./graphing.component.scss']
})
export class GraphingComponent implements OnInit {
  @ViewChild('graph', {read: ElementRef}) graphCanvasEl!: ElementRef<HTMLCanvasElement>;
  @Input() drawdownData!: YearTotal[];

  private graphCtx!: CanvasRenderingContext2D | null;

  readonly height: number = 400;
  readonly width: number = 950;
  readonly border: number = 20;
  readonly leftBorder: number = 120;
  readonly rightBorder: number = 140;
  readonly bottomBorder: number = 60;

  constructor() {
  }

  draw(): void {
    // Find maximum and minimum values of remaining funds and build a linear array from the dual column data
    let maxFunds = 0;
    let minFunds = 0;
    let maxIncome = this.drawdownData[0].annualIncome;
    let minIncome = maxIncome;

    let drawDownDataLinear: YearTotalSingle[] = [];

    let graphCanvas: HTMLCanvasElement = this.graphCanvasEl.nativeElement;
    this.graphCtx = graphCanvas.getContext('2d');

    if (this.graphCtx) {
      // Make a single column array from the dual column input.
      this.drawdownData.forEach((yearTotal: YearTotal) => {
        drawDownDataLinear.push(new YearTotalSingle(yearTotal.yearNum, yearTotal.remainingFunds, yearTotal.annualIncome));
      });

      this.drawdownData?.forEach((yearTotal: YearTotal) => {
        drawDownDataLinear.push(new YearTotalSingle(yearTotal.yearNumRight, yearTotal.remainingFundsRight, yearTotal.annualIncomeRight));
      });

      // Find th max and min funds and ncome amounts
      drawDownDataLinear.forEach((yearTotal: YearTotalSingle) =>
      {
        if (yearTotal.remainingFunds > maxFunds)
          maxFunds = yearTotal.remainingFunds;
        else if (yearTotal.remainingFunds < minFunds)
          minFunds = yearTotal.remainingFunds;

        if (yearTotal.annualIncome > maxIncome)
          maxIncome = yearTotal.annualIncome;
        else if (yearTotal.annualIncome < minIncome)
          minIncome = yearTotal.annualIncome;
      });

      const yScale: number = -(this.height - this.border - this.bottomBorder) / maxFunds;
      const yOffset: number = this.height - this.bottomBorder;
      const xScale: number = (this.width - this.rightBorder - this.leftBorder) / drawDownDataLinear.length;
      const xOffset = this.leftBorder;
      const labelIndent = 20;

      const yScaleInc: number = -(this.height - this.border - this.bottomBorder) / maxIncome;

      let textHeight: number = 10;

      let gradient:CanvasGradient = this.graphCtx.createLinearGradient(0, 0, this.width, this.height);
      gradient.addColorStop(0, '#d8d8ee');
      gradient.addColorStop(1, '#ffffff');
      this.graphCtx.fillStyle = gradient;
      this.graphCtx.fillRect(0, 0, this.width, this.height);  
      this.graphCtx.fillStyle = '#000000';
      // set up the x calibration
      const years: number = drawDownDataLinear.length;
      this.graphCtx.beginPath();
      this.graphCtx.lineWidth = 0.25;
      this.graphCtx.strokeStyle = '#474646';
      this.graphCtx.font = textHeight + "px Arial";

      // x axis calibration
      for (let i = 0; i <= years; i += 5) {
        let x = i * xScale + xOffset;
        this.graphCtx.moveTo(x, this.height - this.bottomBorder);
        this.graphCtx.lineTo(x, this.border);
        let yearNum: string = i.toString();
        this.graphCtx.fillText(yearNum, x - this.graphCtx.measureText(yearNum).width / 2, this.height - this.bottomBorder + textHeight);
      }
      this.graphCtx.stroke();

      // y axis calibration (funds)
      for (let i: number = 0; i <= maxFunds; i += maxFunds / 5) {
        this.graphCtx.moveTo(this.leftBorder, i * yScale + yOffset);
        this.graphCtx.lineTo(this.width - this.rightBorder, i * yScale + yOffset);
        let textMetrics: TextMetrics = this.graphCtx.measureText(i.toFixed(1));
        let textWidth: number = textMetrics.width;
        this.graphCtx.fillText(i.toFixed(0), this.leftBorder - textWidth, i * yScale + yOffset + textHeight / 2);
      }
      // y axis left label (remaining funds)
      this.graphCtx.save();
      this.graphCtx.font = textHeight + "px Arial";
      this.graphCtx.translate(0, (this.border+ this.height-this.bottomBorder)/ 2);
    //  this.graphCtx.rotate(Math.PI / 2);
      this.graphCtx.textAlign = 'left';
      this.graphCtx.fillText("Remaining", labelIndent, -textHeight/2);
      this.graphCtx.fillText("Funds", labelIndent, textHeight/2);
      this.graphCtx.restore();
      
      // y axis calibration (Annual income)
      for (let i: number = 0, j: number = 0; j < 6; i += maxIncome / 5, ++j) {
        let textMetrics: TextMetrics = this.graphCtx.measureText(i.toFixed(1));
        let textWidth: number = textMetrics.width;
        this.graphCtx.fillText(i.toFixed(0), this.width-this.rightBorder, i * yScaleInc + yOffset + textHeight / 2);
      }

      // y axis right label (annual income)
      this.graphCtx.save();
      this.graphCtx.translate(this.width-this.rightBorder, (this.border+ this.height-this.bottomBorder)/ 2);
       //     this.graphCtx.rotate(-Math.PI / 2);
      this.graphCtx.textAlign = 'left';
      this.graphCtx.fillText("Annual", labelIndent, -textHeight/2);
      this.graphCtx.fillText("Income", labelIndent, textHeight/2);
      this.graphCtx.stroke();
      this.graphCtx.restore();

      this.graphCtx.lineWidth = 0.5;
      this.graphCtx.strokeStyle = '#fd0000';

      this.graphCtx.moveTo(drawDownDataLinear[0].yearNum * xScale + xOffset, drawDownDataLinear[0].annualIncome * yScaleInc + yOffset);
      this.graphCtx.beginPath();
      drawDownDataLinear.forEach((yearTotals: YearTotalSingle) => {
        // @ts-ignore  Otherwise it complains that graphCtx could be null
        this.graphCtx.lineTo(yearTotals.yearNum * xScale + xOffset, yearTotals.annualIncome * yScaleInc + yOffset);
      });
      this.graphCtx.stroke();

      this.graphCtx.strokeStyle = '#ff00ff';     
      this.graphCtx.moveTo(drawDownDataLinear[0].yearNum * xScale + xOffset, drawDownDataLinear[0].remainingFunds * yScale + yOffset);
      this.graphCtx.beginPath();
      drawDownDataLinear.forEach((yearTotals: YearTotalSingle) => {
        // @ts-ignore  Otherwise it complains that graphCtx could be null
        this.graphCtx.lineTo(yearTotals.yearNum * xScale + xOffset, yearTotals.remainingFunds * yScale + yOffset);
      });
      this.graphCtx.stroke();

    }
  }

  showValues($event: MouseEvent) {
    let rect = this.graphCanvasEl.nativeElement.getBoundingClientRect();
    let x = $event.clientX - rect.left;
    let y = $event.clientY - rect.top;

    console.log("Left? : " + x + " ; Top? : " + y + ".");

  }

  ngOnInit(): void {
  }
}
