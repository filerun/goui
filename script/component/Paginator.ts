import {Toolbar} from "./Toolbar.js";
import {Store} from "../data/Store.js";
import {btn, Button} from "./Button.js";
import {Config} from "./Observable.js";
import {comp} from "./Component.js";

export class Paginator extends Toolbar {

	private prev: Button;
	private next: Button;

	/**
	 * The store it will paginate
	 */
	public store!: Store;

	protected baseCls = "toolbar paginator";

	constructor() {
		super();

		this.items.add(
			this.prev = btn({
				icon: "chevron_left",
				text: "Previous",
				disabled: true,
				handler: async () => {
					await this.store.loadPrevious();
				}
			}),

			comp({
				flex:1
			}),

			this.next = btn({
				icon: "chevron_right",
				text: "Next",
				disabled: true,
				handler: async () => {
					await this.store.loadNext();
				}
			})
		);

		this.store.on("load", () => {
			this.onStoreLoad();
		})
	}

	private onStoreLoad() {
		this.prev.disabled = !this.store.hasPrevious();
		this.next.disabled = !this.store.hasNext();
	}
}

/**
 * Shorthand function to create {@see Paginator}
 *
 * @param config
 */
export const paginator = (config: Config<Paginator>) => Object.assign(new Paginator(), config);