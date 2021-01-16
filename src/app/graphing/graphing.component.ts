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

  readonly height:number = 400;
  readonly width:number = 800;
  readonly origin:number = 0;

  constructor() {
  }

  draw():void
  {
    // Find maximum and minimum values of remaining funds and build a linear array from the dual column data
    let maxFunds = 0;
    let minFunds = 0;
    let drawDownDataLinear:YearTotalSingle[] = [];

    let graphCanvas: HTMLCanvasElement = this.graphCanvasEl.nativeElement;
    this.graphCtx = graphCanvas.getContext('2d');

    this.drawdownData.forEach((yearTotal:YearTotal) => {
      if(yearTotal.remainingFunds > maxFunds)
        maxFunds = yearTotal.remainingFunds;
      else if (yearTotal.remainingFunds < minFunds)
        minFunds = yearTotal.remainingFunds;

      if(yearTotal.remainingFundsRight > maxFunds)
        maxFunds = yearTotal.remainingFundsRight;
      else if (yearTotal.remainingFundsRight < minFunds)
        minFunds = yearTotal.remainingFundsRight;

      drawDownDataLinear.push(new YearTotalSingle(yearTotal.yearNum, yearTotal.remainingFunds, yearTotal.annualIncome));
    });

    this.drawdownData.forEach((yearTotal:YearTotal) => {
      drawDownDataLinear.push(new YearTotalSingle(yearTotal.yearNumRight, yearTotal.remainingFundsRight, yearTotal.annualIncomeRight));
    });

    const xScale:number = this.height/(maxFunds-minFunds);
    const xOffset: number = -minFunds*xScale;

    this.graphCtx?.moveTo(0, this.origin);

    let x:number = 0;

    drawDownDataLinear.forEach((yearTotals:YearTotalSingle) => {
      this.graphCtx?.lineTo(x, yearTotals.remainingFunds*xScale+xOffset);
      x += 4;
    });

    this.graphCtx?.stroke();
  }

  ngOnInit(): void {
  }
}
