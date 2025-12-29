import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';

interface IForm {
	valid: boolean;
	errors: string;
}

export class Form extends Component<IForm> {
	protected errorsElement: HTMLElement;
	protected submitButton: HTMLButtonElement;

	constructor(protected events: IEvents, container: HTMLElement) {
		super(container);

		this.errorsElement = ensureElement<HTMLElement>(
			'.form__errors',
			this.container
		);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.container
		);

		this.container.addEventListener('input', () => {
			this.events.emit('form:changed', { field: null, value: null });
		});

		this.container.addEventListener('submit', event => {
			event.preventDefault();
			this.events.emit('form:submit');
		});
	}

	enableSubmit() {
		this.submitButton.disabled = false;
	}

	disableSubmit() {
		this.submitButton.disabled = true;
	}

	showErrors(message: string) {
		this.errorsElement.textContent = message;
	}

	clearErrors() {
		this.errorsElement.textContent = '';
	}
}
