import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Card } from './Card';

export class CardPreview extends Card {
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;
	protected descriptionElement: HTMLElement;
	protected cardButton: HTMLButtonElement;

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

		this.descriptionElement = ensureElement<HTMLElement>(
			'.card__text',
			this.container
		);

		this.cardButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.container
		);

		this.cardButton.addEventListener('click', () => {
			this.events.emit('card:add', { id: this.container.dataset.id });
		});

		this.events.on(
			'cart:item-changed',
			({ id, inCart }: { id: string; inCart: boolean }) => {
				if (this.container.dataset.id !== id) return;
				this.actionLabel = inCart ? 'Удалить из корзины' : 'Купить';
			}
		);
	}

	set category(value: string) {
		this.categoryElement.textContent = value;
	}

	set image({ src, alt }: { src: string; alt?: string }) {
		this.imageElement.src = src;
		if (alt) this.imageElement.alt = alt;
	}

	set description(value: string) {
		this.descriptionElement.textContent = value;
	}

	set price(value: number | null) {
		super.price = value;

		if (value === null) {
			this.cardButton.disabled = true;
			this.cardButton.textContent = 'Недоступно';
		} else {
			this.cardButton.disabled = false;
			this.cardButton.textContent = 'Купить';
		}
	}

	set actionLabel(value: string) {
		this.cardButton.textContent = value;
	}
}
