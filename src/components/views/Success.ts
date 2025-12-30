import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

interface ISuccess {
	total: number;
}

export class Success extends Component<ISuccess> {
	protected totalElement: HTMLElement;
	protected successButton: HTMLButtonElement;

	constructor(protected events: IEvents, container: HTMLElement) {
		super(container);

		this.totalElement = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		this.successButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		this.successButton.addEventListener('click', () => {
			this.events.emit(AppEvents.SuccessClose);
		});
	}

	set total(value: number) {
		this.totalElement.textContent = `Списано ${value} синапсов`;
	}
}
