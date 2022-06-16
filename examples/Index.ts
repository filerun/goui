import {CardContainer} from "../script/component/CardContainer.js";
import {Box, Component, El} from "../script/component/Component.js";
import {router} from "../script/Router.js";
import {client} from "../script/api/Client.js";
import {Translate} from "../script/Translate.js";
import {root} from "../script/component/Root.js";
import {PlayGround} from "./PlayGround.js";

// Setup Group-Office connection
client.uri = "http://host.docker.internal:6780/api/";

/**
 * Card loader that dynamically loads a module for the card
 *
 * @param cls
 * @param id
 * @param mod
 */
function loadCard(cls: string, id: string, mod = `./${cls}.js` ) : Promise<Component>{
	let index = cards.findItemIndex(id);
	if (index == -1) {

		return import(mod).then((mods:any) => {
			index = cards.getItems().add(mods[cls].create({
				id: id
			}));
			cards.setActiveItem(index);
		}).then(() => {
			return cards.getItems().get(cards.getActiveItem()!)!;
		})
	} else {
		cards.setActiveItem(index);
		return Promise.resolve(cards.getItems().get(cards.getActiveItem()!)!);
	}
}


// Create main card panel for displaying SPA pages
const cards = CardContainer.create({
	cls: "fit"
});

root.setEl(document.getElementById("goui")!);
root.getItems().add(cards);

router.on("change", () => {
	console.warn(`Missing translations`, Translate.missing);
});

// Setup router
// Translate.load("nl").then(() => {
	router
		.add(/^playground$/, () => {
			return loadCard("PlayGround", "playground");
		})

		.add(/playground\/window/, async () => {
			const playground = await loadCard("PlayGround", "playground") as PlayGround;
			playground.showWindow();
		})


.add(() => {

			let index = cards.findItemIndex("notfound");
			if(index == -1) {
				cards.getItems()
					.add(
						Box({
						cls: "pad",
						id: "notfound"
					},
							El({
								html: `
									<h1>Heading 1</h1>
									<h2>Heading 2</h2>
									<h3>Heading 3</h3>
									<h4>Heading 4</h4>
									<h5>Heading 5</h5>
									<h6>Heading 6</h6>
									<p>Paragraph</p>
									
									<p><a href="#playground">Visit play ground</a></p>`,
							}),

							Box({cls: "pad"},
								El({tagName: "h1", text: "Heading 1"}),
								El({tagName: "h2", text: "Heading 2"})
							),

							Box({
									cls: "pad",
									items: [
										El({tagName: "h3", text: "Heading 3"}),
										El({tagName: "h4", text: "Heading 4"})
									]
								},

							)),


					);

				index = cards.getItems().count() - 1;
			}
			cards.setActiveItem(index);
		})

		.start();


// });
