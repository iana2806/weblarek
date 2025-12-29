import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Form } from './Form';

export class FormContacts extends Form {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(protected events: IEvents, container: HTMLElement) {
		super(events, container);

		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.container
		);

		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.container
		);

		this.emailInput.addEventListener('input', () => {
			this.events.emit('form:changed', {
				field: 'email',
				value: this.emailInput.value,
			});
		});

		this.phoneInput.addEventListener('input', () => {
			this.events.emit('form:changed', {
				field: 'phone',
				value: this.phoneInput.value,
			});
		});

		this.container.addEventListener('submit', event => {
			event.preventDefault();
			this.events.emit('contacts:submit');
		});
	}

	set email(value: string) {
		this.emailInput.value = value;
	}

	set phone(value: string) {
		this.phoneInput.value = value;
	}
}
