# Pension Drawdown Calculator
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.5.

It is used to calculate the effect of pension drawdown over time on remaining funds and annual income, given 
an initial pension fund value, estimated growth of the fund in its investment, depreciation of the fund due to drawdown, 
and the growth of annual income over the years given an annual percentage increase in that income.
Crucially this will show the number of years before the fund would be depleted given these scenarios.
The results are shown with a graph or table according to the users choice.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

The build script build.sh will run a production build with the base url set to dc and package the application in dc.war for deployment.
## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
