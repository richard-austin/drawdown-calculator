export class YearTotal
{
    public constructor(init?:Partial<YearTotal>) {
        Object.assign(this, init);
    }
  
    yearNum!: number;
    remainingFunds!: number;
    annualIncome!: number;

    yearNumRight!: number
    remainingFundsRight!: number;
    annualIncomeRight!: number;
}
