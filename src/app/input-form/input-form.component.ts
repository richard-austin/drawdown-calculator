
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { YearTotal } from '../classes/YearTotal';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent implements OnInit {
  @ViewChild('fundAmount', { read: ElementRef }) fundAmountEl!: ElementRef<HTMLInputElement>;
  @ViewChild('drawdownAmount', { read: ElementRef }) drawdownAmountEl!: ElementRef<HTMLInputElement>;
  @ViewChild('expectedAnnualFundGrowth', { read: ElementRef }) expectedAnnualFundGrowthEL!: ElementRef<HTMLInputElement>;

  fundAmount!: number;
  drawdownAmount!: number;
  expectedAnnualFundGrowth!: number;

  drawdownData: YearTotal[] = [];

  constructor() { }

  cancel() {
    //  Console.log("Cancelled");
  }

  formSubmitted() {
    this.fundAmount = parseInt(this.fundAmountEl?.nativeElement.value.toString())
    this.drawdownAmount = parseInt(this.drawdownAmountEl?.nativeElement.value.toString())
    this.expectedAnnualFundGrowth = parseInt(this.expectedAnnualFundGrowthEL?.nativeElement.value.toString())
    this.calculateDrawdown();
  }

  /**
   * calculateDrawdown: Calculate the the balance for each year, starting from the initial fund
   */
  calculateDrawdown() {
    this.drawdownData = [];

    for (let i = 0; i < 40; ++i) {
      if (this.fundAmount > 0)
        this.drawdownData.push(new YearTotal({ yearNum: i, remainingFunds: this.fundAmount }));
      else
        this.drawdownData.push(new YearTotal({ yearNum: i, remainingFunds: 0 }));

      this.depreciateOneYear();
    }

    let x = 0;
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

  ngOnInit(): void {
  }

}
