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
  readonly width: number = 800;
  readonly border: number = 20;

  constructor() {
  }

  draw(): void {
    // Find maximum and minimum values of remaining funds and build a linear array from the dual column data
    let maxFunds = 0;
    let minFunds = 0;
    let drawDownDataLinear: YearTotalSingle[] = [];

    let graphCanvas: HTMLCanvasElement = this.graphCanvasEl.nativeElement;
    this.graphCtx = graphCanvas.getContext('2d');

    this.drawdownData.forEach((yearTotal: YearTotal) => {
      if (yearTotal.remainingFunds > maxFunds)
        maxFunds = yearTotal.remainingFunds;
      else if (yearTotal.remainingFunds < minFunds)
        minFunds = yearTotal.remainingFunds;

      if (yearTotal.remainingFundsRight > maxFunds)
        maxFunds = yearTotal.remainingFundsRight;
      else if (yearTotal.remainingFundsRight < minFunds)
        minFunds = yearTotal.remainingFundsRight;

      drawDownDataLinear.push(new YearTotalSingle(yearTotal.yearNum, yearTotal.remainingFunds, yearTotal.annualIncome));
    });

    this.drawdownData.forEach((yearTotal: YearTotal) => {
      drawDownDataLinear.push(new YearTotalSingle(yearTotal.yearNumRight, yearTotal.remainingFundsRight, yearTotal.annualIncomeRight));
    });

    const yScale: number = -(this.height-2*this.border) / maxFunds;
    const yOffset: number = this.height-this.border;
    const xScale: number = (this.width-2*this.border) / drawDownDataLinear.length;
    const xOffset = this.border;

    // set up the x calibration
    const years: number = drawDownDataLinear.length;
    this.graphCtx?.beginPath();
    for(let i = 0; i < years; ++i)
    {
      let x = i * xScale + xOffset;
      this.graphCtx?.moveTo(x, this.height);
      this.graphCtx?.lineTo(x, this.border);
    }
    this.graphCtx?.stroke();


    this.graphCtx?.clearRect(this.border, this.border, this.width-2*this.border, this.height-2*this.border+1);

    if(this.graphCtx)
      this.graphCtx.strokeStyle= '#fd0042';

    this.graphCtx?.beginPath();
    this.graphCtx?.moveTo(drawDownDataLinear[0].yearNum * xScale+xOffset, drawDownDataLinear[0].remainingFunds*yScale+yOffset);
    drawDownDataLinear.forEach((yearTotals: YearTotalSingle) => {
      this.graphCtx?.lineTo(yearTotals.yearNum * xScale + xOffset, yearTotals.remainingFunds * yScale + yOffset);
    });

    this.graphCtx?.stroke();
  }

  showValues($event: MouseEvent) {
    let rect = this.graphCanvasEl.nativeElement.getBoundingClientRect();
    let x = $event.clientX - rect.left;
    let y = $event.clientY - rect.top;

    console.log("Left? : " + x  + " ; Top? : " + y + ".");

  }


  ngOnInit(): void {
  }

}
