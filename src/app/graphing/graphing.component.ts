import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {YearTotal} from "../classes/YearTotal";
import {GraphDimensions} from "../classes/GraphDimensions";
import {fromEvent, Subscription, timer} from "rxjs";

@Component({
  selector: 'app-graphing',
  templateUrl: './graphing.component.html',
  styleUrls: ['./graphing.component.scss']
})
export class GraphingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('graph', {read: ElementRef}) graphCanvasEl!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fundsRemainingBox', {read: ElementRef}) fundsRemainingBoxEl!: ElementRef<HTMLDivElement>;
  @ViewChild('annualIncomeBox', {read: ElementRef}) annualIncomeBoxEl!: ElementRef<HTMLDivElement>;

  @Input() drawdownData!: YearTotal[];


  private graphCtx!: CanvasRenderingContext2D | null;

  private windowResizeHandle!: Subscription;

  readonly graphDimensions: GraphDimensions = new GraphDimensions({
    height: 400,
    width: 950,
    topBorder: 20,
    leftBorder: 90,
    rightBorder: 70,
    bottomBorder: 60,
    textHeight: 10,
    xCalOffset: 4,
    yCalOffsetAi: 4,
    yCalOffsetRf: 4,
    yOffsetBoxAi: 1,
    yOffsetBoxRf: 10
  });

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
  private timerHandle!: Subscription;
  width: number = this.graphDimensions.width;
  height: number = this.graphDimensions.height;
  private graphCanvas!: HTMLCanvasElement;

  constructor() {
  }

  draw(): void {
    this.graphCtx?.save();
    this.timerHandle?.unsubscribe();
    this.setScale();
    this.timerHandle = timer(1).subscribe(() => {
      this.doDraw();
      this.graphCtx?.restore();
    });
  }

  private doDraw(): void {
    // Find maximum and minimum values of remaining funds and build a linear array from the dual column data
    let maxFunds = 0;
    let minFunds = 0;

    if (this.drawdownData && this.drawdownData[0] && this.graphCtx) {
      let maxIncome = this.drawdownData[0].annualIncome;
      let minIncome = maxIncome;

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

      this.yScale = -(this.graphDimensions.height - this.graphDimensions.topBorder - this.graphDimensions.bottomBorder) / maxFunds;
      this.yOffset = this.graphDimensions.height - this.graphDimensions.bottomBorder;
      this.xScale = (this.graphDimensions.width - this.graphDimensions.rightBorder - this.graphDimensions.leftBorder) / this.drawdownData.length;
      this.xOffset = this.graphDimensions.leftBorder;

      const labelIndent = 15;

      this.yScaleInc = -(this.graphDimensions.height - this.graphDimensions.topBorder - this.graphDimensions.bottomBorder) / maxIncome;

      // Fill in the graph background
      let gradient: CanvasGradient = this.graphCtx.createLinearGradient(0, 0, this.graphDimensions.width, this.graphDimensions.height);
      gradient.addColorStop(0, '#323232');
      gradient.addColorStop(1, '#101010');
      this.graphCtx.fillStyle = gradient;
      this.graphCtx.fillRect(0, 0, this.graphDimensions.width, this.graphDimensions.height);

      // Label and calibrate the x and y exes
      this.labelAxes(maxFunds, maxIncome, labelIndent);

      // Draw the the annual income curve
      this.graphCtx.lineWidth = 1/this.graphDimensions.scale;
      this.graphCtx.strokeStyle = '#ffa0a0';

      this.graphCtx.moveTo(this.drawdownData[0].yearNum * this.xScale + this.xOffset, this.drawdownData[0].annualIncome * this.yScaleInc + this.yOffset);
      this.graphCtx.beginPath();
      this.drawdownData.forEach((yearTotals: YearTotal) => {
        // @ts-ignore  Otherwise it complains that graphCtx could be null
        this.graphCtx.lineTo(yearTotals.yearNum * this.xScale + this.xOffset, yearTotals.annualIncome * this.yScaleInc + this.yOffset);
      });
      this.graphCtx.stroke();

      // Draw the remaining funds curve
      this.graphCtx.strokeStyle = '#ffdcff';
      this.graphCtx.moveTo(this.drawdownData[0].yearNum * this.xScale + this.xOffset, this.drawdownData[0].remainingFunds * this.yScale + this.yOffset);
      this.graphCtx.beginPath();
      this.drawdownData.forEach((yearTotals: YearTotal) => {
        // @ts-ignore  Otherwise it complains that graphCtx could be null
        this.graphCtx.lineTo(yearTotals.yearNum * this.xScale + this.xOffset, yearTotals.remainingFunds * this.yScale + this.yOffset);
      });
      this.graphCtx.stroke();
    }
  }

  private labelAxes(maxFunds:number, maxIncome: number, labelIndent:number):void
  {
    if(this.graphCtx)
    {
      this.graphCtx.fillStyle = '#f8f8f8';

      // set up the x calibration
      const years: number = this.drawdownData.length;
      this.graphCtx.beginPath();
      this.graphCtx.lineWidth = 0.25 /this.graphDimensions.scale;
      this.graphCtx.strokeStyle = '#f8f8f8';
      this.graphCtx.font = this.graphDimensions.textHeight + "px Arial";
      // x axis calibration
      for (let i = 1; i <= years+1; i += i===1?4:5) {
        let x = i * this.xScale + this.xOffset;
        this.graphCtx.moveTo(x, this.graphDimensions.height - this.graphDimensions.bottomBorder);
        this.graphCtx.lineTo(x, this.graphDimensions.topBorder);
        let yearNum: string = i.toString();
        this.graphCtx.fillText(yearNum, x - this.graphCtx.measureText(yearNum).width / 2, this.graphDimensions.height - this.graphDimensions.bottomBorder + this.graphDimensions.textHeight+this.graphDimensions.xCalOffset);
      }
      this.graphCtx.stroke();

      // y axis calibration (funds)
      for (let i: number = 0; i <= maxFunds; i += maxFunds / 5) {
        this.graphCtx.moveTo(this.xScale + this.xOffset, i * this.yScale + this.yOffset);
        this.graphCtx.lineTo(years * this.xScale + this.xOffset, i * this.yScale + this.yOffset);
        let textMetrics: TextMetrics = this.graphCtx.measureText(i.toFixed(1));
        let textWidth: number = textMetrics.width;
        this.graphCtx.fillText(i.toFixed(0), this.xScale + this.xOffset - textWidth + this.graphDimensions.yCalOffsetRf, i * this.yScale + this.yOffset + this.graphDimensions.textHeight / 2);
      }
      // y axis left label (remaining funds)
      this.graphCtx.save();
      this.graphCtx.font = this.graphDimensions.textHeight + "px Arial";
      this.graphCtx.translate(0, (this.graphDimensions.topBorder + this.graphDimensions.height - this.graphDimensions.bottomBorder) / 2);
      //  this.graphCtx.rotate(Math.PI / 2);
      this.graphCtx.textAlign = 'left';
      this.graphCtx.fillText("Remaining", labelIndent, 0);
      this.graphCtx.fillText("Funds", labelIndent, this.graphDimensions.textHeight);
      this.graphCtx.restore();

      // y axis calibration (Annual income)
      for (let i: number = 0, j: number = 0; j < 6; i += maxIncome / 5, ++j) {
        this.graphCtx.fillText(i.toFixed(0), this.graphDimensions.width - this.graphDimensions.rightBorder + this.graphDimensions.yCalOffsetAi, i * this.yScaleInc + this.yOffset + this.graphDimensions.textHeight / 2);
      }

      // y axis right label (annual income)
      this.graphCtx.save();
      this.graphCtx.translate(this.graphDimensions.width - this.graphDimensions.rightBorder, (this.graphDimensions.topBorder + this.graphDimensions.height - this.graphDimensions.bottomBorder) / 2);
      //     this.graphCtx.rotate(-Math.PI / 2);
      this.graphCtx.textAlign = 'left';
      this.graphCtx.fillText("Annual", labelIndent, 0);
      this.graphCtx.fillText("Income", labelIndent, this.graphDimensions.textHeight);
      this.graphCtx.stroke();
      this.graphCtx.restore();

      // x axis label
      this.graphCtx.save();
      this.graphCtx.translate(this.xScale + this.xOffset + (this.graphDimensions.width - this.graphDimensions.leftBorder - this.graphDimensions.rightBorder) / 2, (this.graphDimensions.height - this.graphDimensions.bottomBorder / 2));
      //     this.graphCtx.rotate(-Math.PI / 2);
      this.graphCtx.textAlign = 'center';
      this.graphCtx.fillText("Year Number", 0, 0);

      this.graphCtx.stroke();
      this.graphCtx.restore();
    }

  }

  showValues($event: MouseEvent | TouchEvent): void {
    let rect: DOMRect = this.graphCanvasEl.nativeElement.getBoundingClientRect();
    let x: number = ($event instanceof MouseEvent ? $event.clientX : $event.touches[0].clientX)- rect.left;
    //   let y = $event.clientY - rect.top;

    if (this.fundsRemainingBoxEl && !this.remainingFundsBox)
      this.remainingFundsBox = this.fundsRemainingBoxEl.nativeElement;

    if (this.annualIncomeBoxEl && !this.annualIncomeBox)
      this.annualIncomeBox = this.annualIncomeBoxEl.nativeElement;

    let yearNum: number = Math.floor((x/this.graphDimensions.scale - this.xOffset) / this.xScale);

    if (yearNum >= 1 && yearNum <= 40) {
      // Remaining funds floating box
      this.remainingFundsBox.style.visibility = 'visible';
      //this.remainingFundsBox.style.top
      this.yearNum = yearNum;
      this.remainingFunds = this.drawdownData[yearNum-1]?.remainingFunds.toFixed(2);
      let rfbRect: DOMRect = this.remainingFundsBox.getBoundingClientRect();
      let rfbWidth: number = rfbRect.width;
      let padding = 3.2;
      this.remainingFundsBox.style.top = (this.drawdownData[yearNum-1]?.remainingFunds * this.yScale*this.graphDimensions.scale + this.yOffset*this.graphDimensions.scale - this.graphDimensions.height*this.graphDimensions.scale+this.graphDimensions.yOffsetBoxRf).toString() + 'px';

      // Centre the pointer on top of the box
      (<HTMLDivElement>this.remainingFundsBox.children[0]).style.left = (rfbWidth / 2 - padding).toString() + 'px';

      // Set the box so its horizontal centre lines up with the x position
      this.remainingFundsBox.style.left = (x - this.remainingFundsBox.clientWidth / 2 - padding).toString() + 'px';

      // Annual income floating box
      this.annualIncomeBox.style.visibility = 'visible';
      this.annualIncome = this.drawdownData[yearNum-1].annualIncome.toFixed(2);
      rfbRect = this.annualIncomeBox.getBoundingClientRect();
      rfbWidth = rfbRect.width;
      this.annualIncomeBox.style.top = (this.drawdownData[yearNum-1].annualIncome * this.yScaleInc*this.graphDimensions.scale + this.yOffset*this.graphDimensions.scale - this.graphDimensions.height*this.graphDimensions.scale+this.graphDimensions.yOffsetBoxAi).toString() + 'px';

      // Centre the pointer on top of the box
      (<HTMLDivElement>this.annualIncomeBox.children[0]).style.left = (rfbWidth / 2 - padding).toString() + 'px';

      // Set the box so its horizontal centre lines up with the x position
      this.annualIncomeBox.style.left = (x - this.annualIncomeBox.clientWidth / 2 - padding).toString() + 'px';
     }
    // else {
    //   this.annualIncomeBox.style.visibility = this.remainingFundsBox.style.visibility = 'hidden';
    // }
  }

  figuresOff(): void {
    this.remainingFundsBox.style.visibility = 'hidden';
    this.annualIncomeBox.style.visibility = 'hidden';
  }

  setScale(): void {
    const windowWidth: number = window.innerWidth;
    const margin: number = 27;

    this.graphDimensions.scale = (windowWidth-margin) < this.graphDimensions.width ? (windowWidth-margin) / this.graphDimensions.width : 1;
    this.graphCanvas.width = this.graphDimensions.width * this.graphDimensions.scale;
    this.graphCanvas.height = this.graphDimensions.height * this.graphDimensions.scale;
    this.graphCtx?.scale(this.graphDimensions.scale, this.graphDimensions.scale);
  }

  ngOnInit(): void {
    this.windowResizeHandle = fromEvent(window, 'resize').subscribe(() => {
      this.draw();
    });
  }

  ngAfterViewInit(): void {
    this.graphCanvas = this.graphCanvasEl.nativeElement;
    this.graphCtx = this.graphCanvas.getContext('2d');
  }

  ngOnDestroy(): void {
    this.windowResizeHandle?.unsubscribe();
    this.timerHandle?.unsubscribe();
  }
}
