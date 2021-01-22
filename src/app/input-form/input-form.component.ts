
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { YearTotalDualCol } from '../classes/YearTotalDualCol';
import {GraphingComponent} from "../graphing/graphing.component";
import {max, tap} from "rxjs/operators";
import {Subscription, timer} from "rxjs";
import {YearTotal} from "../classes/YearTotal";

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent implements OnInit, OnDestroy {
  @ViewChild('fundAmount', { read: ElementRef }) fundAmountEl!: ElementRef<HTMLInputElement>;
  @ViewChild('drawdownAmount', { read: ElementRef }) drawdownAmountEl!: ElementRef<HTMLInputElement>;
  @ViewChild('expectedAnnualFundGrowth', { read: ElementRef }) expectedAnnualFundGrowthEL!: ElementRef<HTMLInputElement>;
  @ViewChild('requiredAnnualIncomeGrowth', { read: ElementRef }) requiredAnnualIncomeGrowthEL!: ElementRef<HTMLInputElement>;
  @ViewChild(GraphingComponent) graph!:GraphingComponent;

  fundAmount!: number;
  drawdownAmount!: number;
  expectedAnnualFundGrowth!: number;
  requiredAnnualIncomeGrowth!: number;

  drawdownDataDualCol: YearTotalDualCol[] = [];
  drawdownData: YearTotal[] = [];

  displayedColumns: string[] = ['yearNum', 'remainingFunds', 'annualIncome', 'yearNumRight', 'remainingFundsRight', 'annualIncomeRight'];

  drawDownDataForm!: FormGroup;
  timerSub:Subscription | null= null;
  bIsGraph: boolean = false;
  constructor() { }

 cancel() {
    this.drawdownDataDualCol = [];
  }

  formSubmitted() {
    this.fundAmount = parseFloat(this.fundAmountEl?.nativeElement.value.toString())
    this.drawdownAmount = parseFloat(this.drawdownAmountEl?.nativeElement.value.toString())
    this.expectedAnnualFundGrowth = parseFloat(this.expectedAnnualFundGrowthEL?.nativeElement.value.toString())
    this.requiredAnnualIncomeGrowth = parseFloat(this.requiredAnnualIncomeGrowthEL?.nativeElement.value.toString())
    this.calculateDrawdown();
  }

  /**
   * calculateDrawdown: Calculate the the balance for each year, starting from the initial fund
   */
  calculateDrawdown() {
    this.drawdownDataDualCol = [];
    const totalYears: number = 40;
    const maxRows: number = totalYears / 2;

    // Build the drawdown data array
    this.drawdownData = [];
    for (let i = 0; i < totalYears; ++i) {
      if (this.fundAmount > 0) {
        this.drawdownData.push(new YearTotal({
          yearNum: i,
          remainingFunds: this.fundAmount,
          annualIncome: this.drawdownAmount > this.fundAmount ? this.fundAmount : this.drawdownAmount
        }));
      } else {
        this.drawdownData.push(new YearTotal({yearNum: i, remainingFunds: 0, annualIncome: 0}));
      }
      this.depreciateOneYear();
    }

    // Build the drawdown data array for the dual column table
    this.drawdownDataDualCol = this.transformToDualCol(this.drawdownData, maxRows);

    this.timerSub?.unsubscribe();
    this.timerSub = timer(100).pipe(tap(() => this.graph.draw())).subscribe();
  }

  /**
   * depreciateOneYear: Take one years money from the fund applying the expected annual fund growth
   *
   */
  depreciateOneYear() {
    let monthlyFundGrowth: number = Math.pow((1 + this.expectedAnnualFundGrowth / 100), 1 / 12);
    let monthlyDrawdown: number = this.drawdownAmount / 12;

    for (let i = 0; i < 12; ++i) {
      this.fundAmount = this.fundAmount * monthlyFundGrowth;
      this.fundAmount -= monthlyDrawdown;
    }

    // Increase by the expected annual income growth
    this.drawdownAmount += this.drawdownAmount * this.requiredAnnualIncomeGrowth / 100;
  }

  hasError = (controlName: string, errorName: string):boolean =>{
    return this.drawDownDataForm.controls[controlName].hasError(errorName);
  }

  setIsGraph(checked: boolean):void {
    this.bIsGraph = checked;
  }

  transformToDualCol(drawdownData: YearTotal[], maxRows: number): YearTotalDualCol[]
  {
    let retVal: YearTotalDualCol[] = [];
    let i = 0;
    drawdownData.forEach(row => {
      if(i >= maxRows)
      {
        let rowDualCol: YearTotalDualCol = retVal[i-maxRows];
        rowDualCol.annualIncomeRight = row.annualIncome;
        rowDualCol.remainingFundsRight = row.remainingFunds;
        rowDualCol.yearNumRight = row.yearNum;
      }
      else
      {
        let rowDualCol: YearTotalDualCol = new YearTotalDualCol();
        rowDualCol.annualIncome = row.annualIncome;
        rowDualCol.remainingFunds = row.remainingFunds;
        rowDualCol.yearNum = row.yearNum;
        retVal.push(rowDualCol);
      }
      ++i;
    });

    return retVal;
  }

  ngOnInit(): void {
    this.drawDownDataForm = new FormGroup({
      fundAmount: new FormControl('', [Validators.required, Validators.min(0), Validators.pattern(/^[\-+]?[0-9]*\.?[0-9]+$/)]),
      drawdownAmount: new FormControl('', [Validators.required, Validators.pattern(/^[\-+]?[0-9]*\.?[0-9]+$/)]),
      expectedAnnualFundGrowth: new FormControl('', [Validators.required, Validators.pattern(/^[\-+]?[0-9]*\.?[0-9]+$/)]),
      requiredAnnualIncomeGrowth: new FormControl('', [Validators.required, Validators.pattern(/^[\-+]?[0-9]*\.?[0-9]+$/)])
    });
  }

  ngOnDestroy(): void {
      this.timerSub?.unsubscribe();
  }
}
