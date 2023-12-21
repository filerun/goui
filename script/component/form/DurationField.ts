import {TextField, TextFieldType} from "./TextField";
import {Config} from "../Observable";
import {Field, FieldEventMap} from "./Field";
import {createComponent} from "../Component";
import {E, Format} from "../../util";
import {DateInterval} from "../../util/DateInterval";

export class DurationField extends Field {



	private hoursInput?: HTMLInputElement;
	private minutesInput?: HTMLInputElement;


	inMinutes: boolean = true;

	min = "0:00";

	max = "100:00";


    // protected validate() {
    //     super.validate();
    //     const v = Format.minutes(super.value);
    //     if (v && isNaN(v)) {
    //         this.setInvalid("Incorrect number format");
    //     }
    //     if (this.max !== undefined && v > this.max) {
    //         this.setInvalid("Number is too big");
    //     }
    //     if (this.min !== undefined && v < this.min) {
    //         this.setInvalid("Number is too small");
    //     }
    // }


	public getValueAsDateInterval() {
		const di = new DateInterval();
		di.hours = parseInt(this.hoursInput!.value);
		di.minutes = parseInt(this.minutesInput!.value);

		return di;
	}

	protected createControl(): HTMLElement | undefined {
		const ctrl = E("div").cls("goui hbox");


		const onBlur = function(this:any) {
			if(!this.value) {
				return;
			}
			this.value = this.value.padStart(2, "0")
			return true;
		}

		const onFocus = function(this:any) {
			this.setSelectionRange(0, this.value.length);
		};

		const onKeyDown = (ev:KeyboardEvent) => {
			switch(ev.key) {
				case "Tab":
				case "Enter":
				case "Backspace":
				case "Delete":
					return true;

				case ':':
					this.minutesInput!.focus();
					ev.preventDefault();
					break;

				default:
					if(!/^[0-9]$/i.test(ev.key)) {
						//only allow numbers
						ev.preventDefault();
					}
			}
		};


		this.hoursInput = document.createElement("input");
		this.hoursInput.classList.add("text");
		this.hoursInput.classList.add("hour");
		this.hoursInput.type = "text";
		this.hoursInput.pattern = "[0-9]+";
		this.hoursInput.maxLength = 2;
		this.hoursInput.onblur = onBlur;
		this.hoursInput.onfocus = onFocus;
		this.hoursInput.placeholder = "--";
		this.hoursInput.autocomplete = "off";
		this.hoursInput.onkeydown = onKeyDown;

		this.minutesInput = document.createElement("input");
		this.minutesInput.classList.add("text");
		this.minutesInput.classList.add("minute");
		this.minutesInput.type = "text";
		this.minutesInput.pattern = "[0-9]+";
		this.minutesInput.maxLength = 2;
		const hoursInput = this.hoursInput!;
		this.minutesInput.onblur = function(this:any) {
			onBlur.call(this);
			if(!this.value && hoursInput.value) {
				this.value = "00";
			}
		};
		this.minutesInput.onfocus = onFocus;

		this.hoursInput.onkeydown = onKeyDown;
		this.minutesInput.oninput = ev => {

			if(parseInt(this.minutesInput!.value) > 59) {
				this.minutesInput!.value = "59";
			}

		}
		this.minutesInput.placeholder = "--";
		this.minutesInput.autocomplete = "off";

		ctrl.append(this.hoursInput, ":", this.minutesInput);

		return ctrl;
	}

	protected internalSetValue(v?: any) {

		if(v && this.hoursInput && this.minutesInput) {
			const parts = v.split(":");
			this.hoursInput.value = parts[0].padStart(2, "0");
			if (parts[1]) {
				this.minutesInput.value = parts[1].padStart(2, "0");
			} else {
				this.minutesInput.value = "00";
			}
		}
	}

	set value(v: any) {
		super.value = v;
	}

	get value(): any {
		if(this.hoursInput && this.minutesInput) {

			if(!this.hoursInput.value) {
				return undefined;
			}

			let hours = parseInt(this.hoursInput.value);

			return hours + ":" + (this.minutesInput.value ?? "0").padStart(2, "0");
		} else {
			return super.value;
		}
	}
}

export const durationfield = (config?: Config<DurationField, FieldEventMap<DurationField>>) => createComponent(new DurationField(), config);