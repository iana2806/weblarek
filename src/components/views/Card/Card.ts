import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';

export class Card extends Component<never> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;

	constructor(protected events: IEvents, container: HTMLElement) {
		super(container);

		this.titleElement = ensureElement<HTMLElement>(
			'.card__title',
			this.container
		);

		this.priceElement = ensureElement<HTMLElement>(
			'.card__price',
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
}
