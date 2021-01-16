export class YearTotalSingle
{

  constructor(yearNum: number, remainingFunds: number, annualIncome: number) {
    this.yearNum=yearNum;
    this.remainingFunds=remainingFunds;
    this.annualIncome=annualIncome;
  }

  yearNum!: number;
  remainingFunds!: number;
  annualIncome!: number;
}
