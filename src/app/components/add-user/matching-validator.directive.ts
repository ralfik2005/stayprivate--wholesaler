import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
    selector:'[matchingValidator]',
    providers:[{
        provide: NG_VALIDATORS,
        useExisting: MatchingValidatorDirective,
        multi: true
    }]

})
export class MatchingValidatorDirective implements Validator{
    @Input() matchingValidator:string;
    validate(control: AbstractControl):{[key:string]: any} | null{
        const controlToCompare = control.parent.get(this.matchingValidator);
        if(controlToCompare&&controlToCompare.value!==control.value){
            return{'notEqual':true}
        }
        return null;
    }
}