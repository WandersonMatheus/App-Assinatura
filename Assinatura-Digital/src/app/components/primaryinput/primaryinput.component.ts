import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

type InputTypes = "text" | "email" | "password"

@Component({
  selector: 'app-primaryinput',
  imports: [ReactiveFormsModule],
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=>PrimaryinputComponent),
      multi:true
    }
  ],
  templateUrl: './primaryinput.component.html',
  styleUrl: './primaryinput.component.scss'
})
export class PrimaryinputComponent implements ControlValueAccessor{
  @Input() type:InputTypes = "text";
  @Input() placeholder:string ="";
  @Input() label:string ="";
  @Input() inputName:string ="";
  value: string =  ""
  onChange:any = ( )=>{}
  onTouched:any = ( )=>{}
  
  onInput(event:Event){
    const value = (event.target as HTMLInputElement).value
    this.onChange(value)
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  writeValue(obj: any): void {
      this.value = this.value
  }
  registerOnChange(fn: any): void {
      this.onChange = fn
  }
  setDisabledState(isDisabled: boolean): void {}
}
