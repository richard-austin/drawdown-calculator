export class YearTotal
{

  constructor(init?:Partial<YearTotal>) {
    Object.assign(this, init);
  }

  yearNum!: number;
  remainingFunds!: number;
  annualIncome!: number;
}
