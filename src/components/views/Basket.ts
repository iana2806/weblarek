import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

interface IBasket {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasket> {
	protected listElement: HTMLElement;
	protected totalElement: HTMLElement;
	protected orderButton: HTMLButtonElement;

	constructor(protected events: IEvents, container: HTMLElement) {
		super(container);

		this.listElement = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);

		this.totalElement = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);

		this.orderButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.orderButton.addEventListener('click', () => {
			this.events.emit(AppEvents.OrderOpen);
		});
	}

	set items(elements: HTMLElement[]) {
		this.listElement.replaceChildren(...elements);
	}

	set total(value: number) {
		this.totalElement.textContent = `${value} синапсов`;
	}

	enableOrderButton() {
		this.orderButton.disabled = false;
	}

	disableOrderButton() {
		this.orderButton.disabled = true;
	}
}
