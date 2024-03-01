/**
 * @license https://github.com/Intermesh/goui/blob/main/LICENSE MIT License
 * @copyright Copyright 2023 Intermesh BV
 * @author Merijn Schering <mschering@intermesh.nl>
 */

import {FieldConfig, FieldEventMap} from "./Field.js";
import {createComponent} from "../Component.js";
import {Config} from "../Observable";
import {InputField} from "./InputField";


export type TextFieldType = ("text" | "password" | "email" | "url" | "tel" | "search" );

export interface TextField {
	get input(): HTMLInputElement
}

/**
 * TextField component
 *
 * @see Form
 */
export class TextField extends InputField {

	protected baseCls = 'goui-form-field text';

	constructor() {
		super();

		this.type = "text";
	}

	/**
	 * The input type
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
	 * @param type
	 */
	public set type(type:TextFieldType) {
		super.type = type;
	}

	get type(): TextFieldType {
		return super.type as TextFieldType;
	}

	/**
	 * Pattern regex for validation
	 *
	 * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern
	 *
	 * @param pattern
	 */
	set pattern(pattern: HTMLInputElement["pattern"]) {
		this.input!.pattern = pattern;
	}

	get pattern() {
		return this.input!.pattern
	}
}

/**
 * Shorthand function to create {@see TextField}
 *
 * @param config
 */
export const textfield = (config?: FieldConfig<TextField, FieldEventMap<TextField>>) => createComponent(new TextField(), config);


const c: FieldConfig<TextField, FieldEventMap<TextField>> = {

}