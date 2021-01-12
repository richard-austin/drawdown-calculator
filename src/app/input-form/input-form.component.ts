import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent implements OnInit {
  @ViewChild('fundAmount', { read: ElementRef }) fundAmountEl!: ElementRef<HTMLInputElement>;
  @ViewChild('drawdownAmount', { read: ElementRef }) drawdownAmountEl!: ElementRef<HTMLInputElement>;
  fundAmount!: number;
  drawdownAmount!: number;

  constructor() { }

  ngOnInit(): void {
  }

  cancel() {
    //  Console.log("Cancelled");
  }

  formSubmitted() {
    this.fundAmount = parseInt(this.fundAmountEl?.nativeElement.value.toString())
    this.drawdownAmount = parseInt(this.drawdownAmountEl?.nativeElement.value.toString())
  }
}
