import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';
import { Form } from './Form';
import { AppEvents } from '../../../utils/constants';

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
			this.events.emit(AppEvents.FormChanged, {
				field: 'email',
				value: this.emailInput.value,
			});
		});

		this.phoneInput.addEventListener('input', () => {
			this.events.emit(AppEvents.FormChanged, {
				field: 'phone',
				value: this.phoneInput.value,
			});
		});

		this.container.addEventListener('submit', () => {
			this.events.emit(AppEvents.ContactsSubmit);
		});
	}

	set email(value: string) {
		this.emailInput.value = value;
	}

	set phone(value: string) {
		this.phoneInput.value = value;
	}
}
