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
```bash
./gradlew buildDebFile
```

## Install from deb file
The deb file installation requires Ubuntu 24.04 and has tomcat10 as a dependency. 

The deb file produced by the build will be at ***[YOUR_HOME_DIR]***/drawdown-calculator/deb-file-creation.
The name will be similar to dc_2.1.0_arm64.deb.
Copy it to your Ubuntu ARM64 machine (i.e. Raspberry pi).

On the Raspberry pi, Install from the .deb file
```bash
sudo apt install ./dc_2.1.0_arm64.deb
```
Tomcat 10 will start 

The Drawdown Calculator can be accessed at http://***[server ip address]***:8080/dc

## Install war.file
To use with other Tomcat versions, just copy the file dc.war 
(at ***[YOUR_HOME_DIR]***/drawdown-calculator/dist) to the tomcat webapps folder.
## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
