import { ensureElement } from '../../../utils/utils';
import { Card } from './Card';
import { IEvents } from '../../base/Events';

export class CardProduct extends Card {
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;

	constructor(protected events: IEvents, container: HTMLElement) {
		super(events, container);

		this.categoryElement = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);

		this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
	}

	set title(value: string) {
		this.titleElement.textContent = value;
	}

	set price(value: number | null) {
		this.priceElement.textContent =
			value !== null ? `${value} синапсов` : 'Бесценно';
	}

	set category(value: string) {
		this.categoryElement.textContent = value;
	}

	set image({ src, alt }: { src: string; alt?: string }) {
		this.setImage(this.imageElement, src, alt);
	}
}
