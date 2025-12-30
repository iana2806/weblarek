import { ensureAllElements, ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Form } from './Form';
import { TPayment } from '../../../types';
import { AppEvents } from '../../../utils/constants';

export class FormOrder extends Form {
	protected paymentButtons: HTMLButtonElement[];
	protected addressInput: HTMLInputElement;

	constructor(protected events: IEvents, container: HTMLElement) {
		super(events, container);

		this.paymentButtons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			this.container
		);

		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);

		this.paymentButtons.forEach(button => {
			button.addEventListener('click', () => {
				const payment = button.getAttribute('name') as TPayment;
				if (!payment) return;

				this.events.emit(AppEvents.FormChanged, {
					field: 'payment',
					value: payment,
				});
			});
		});

		this.addressInput.addEventListener('input', () => {
			this.events.emit(AppEvents.FormChanged, {
				field: 'address',
				value: this.addressInput.value,
			});
		});

		this.container.addEventListener('submit', () => {
			this.events.emit(AppEvents.OrderNext);
		});
	}

	set payment(value: TPayment) {
		this.paymentButtons.forEach(button => {
			button.classList.toggle(
				'button_alt-active',
				button.getAttribute('name') === value
			);
		});
	}

	set address(value: string) {
		this.addressInput.value = value;
	}
}
