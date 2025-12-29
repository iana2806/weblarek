import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Card } from './Card';
import { categoryMap } from '../../../utils/constants';

export class CardCatalog extends Card {
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

		this.container.addEventListener('click', () => {
			this.events.emit('card:preview', { id: this.container.dataset.id });
		});
	}

	set category(value: string) {
		this.categoryElement.textContent = value;

		Object.values(categoryMap).forEach(mod =>
			this.categoryElement.classList.remove(mod)
		);

		this.categoryElement.classList.add('card__category');

		const modifier = categoryMap[value as keyof typeof categoryMap];

		if (modifier) {
			this.categoryElement.classList.add(modifier);
		}
	}

	set image({ src, alt }: { src: string; alt?: string }) {
		this.imageElement.src = src;
		if (alt) this.imageElement.alt = alt;
	}
}
