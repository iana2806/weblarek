import { ensureAllElements, ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Form } from './Form';
import { TPayment } from '../../../types';

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

				this.events.emit('form:changed', { field: 'payment', value: payment });
			});
		});

		this.addressInput.addEventListener('input', () => {
			this.events.emit('form:changed', {
				field: 'address',
				value: this.addressInput.value,
			});
		});

		this.container.addEventListener('submit', event => {
			event.preventDefault();
			this.events.emit('order:next');
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
