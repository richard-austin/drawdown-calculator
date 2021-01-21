
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { YearTotal } from '../classes/YearTotal';
import {GraphingComponent} from "../graphing/graphing.component";
import {tap} from "rxjs/operators";
import {Subscription, timer} from "rxjs";

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

  drawdownData: YearTotal[] = [];
  displayedColumns: string[] = ['yearNum', 'remainingFunds', 'annualIncome', 'yearNumRight', 'remainingFundsRight', 'annualIncomeRight'];

  drawDownDataForm!: FormGroup;
  timerSub:Subscription | null= null;
  bIsGraph: boolean = false;
  constructor() { }

 cancel() {
    this.drawdownData = [];
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
    this.drawdownData = [];
    const totalYears: number = 40;
    const maxRows: number = totalYears / 2;

    for (let i = 0; i < 40; ++i) {
      if (this.fundAmount > 0) {
        if (i >= maxRows) {
          let thisRow: YearTotal = this.drawdownData[i - maxRows];
          thisRow.remainingFundsRight = this.fundAmount;
          thisRow.yearNumRight = i;
          thisRow.annualIncomeRight = this.drawdownAmount > this.fundAmount ? this.fundAmount : this.drawdownAmount;
        }
        else
          this.drawdownData.push(new YearTotal({ yearNum: i, remainingFunds: this.fundAmount, annualIncome: this.drawdownAmount > this.fundAmount ? this.fundAmount : this.drawdownAmount }));
      }
      else {
        if (i >= maxRows) {
          let thisRow: YearTotal = this.drawdownData[i - maxRows];
          thisRow.remainingFundsRight = 0;
          thisRow.yearNumRight = i;
          thisRow.annualIncomeRight = 0;
        }
        else
          this.drawdownData.push(new YearTotal({ yearNum: i, remainingFunds: 0, annualIncome: 0 }));
      }

      this.depreciateOneYear();

      this.drawdownAmount += this.drawdownAmount * this.requiredAnnualIncomeGrowth / 100;

    }

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
  }

  hasError = (controlName: string, errorName: string):boolean =>{
    return this.drawDownDataForm.controls[controlName].hasError(errorName);
  }

  setIsGraph(checked: boolean):void {
    this.bIsGraph = checked;
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
