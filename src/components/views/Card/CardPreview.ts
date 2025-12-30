import { AppEvents } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { CardProduct } from './CardProduct';

export class CardPreview extends CardProduct {
	protected descriptionElement: HTMLElement;
	protected cardButton: HTMLButtonElement;

	constructor(protected events: IEvents, container: HTMLElement) {
		super(events, container);

		this.descriptionElement = ensureElement<HTMLElement>(
			'.card__text',
			this.container
		);

		this.cardButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.container
		);

		this.cardButton.addEventListener('click', () => {
			this.events.emit(AppEvents.CardAdd, { id: this.container.dataset.id });
		});

		this.events.on(
			AppEvents.CartItemChanged,
			({ id, inCart }: { id: string; inCart: boolean }) => {
				if (this.container.dataset.id !== id) return;
				this.actionLabel = inCart ? 'Удалить из корзины' : 'Купить';
			}
		);
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
