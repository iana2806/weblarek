import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModal {
	content: HTMLElement;
}

export class Modal extends Component<IModal> {
	protected contentElement: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(protected events: IEvents, container: HTMLElement) {
		super(container);

		this.contentElement = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.container
		);

		this.closeButton.addEventListener('click', () => {
			this.close();
		});
	}

	set content(element: HTMLElement) {
		this.contentElement.replaceChildren(element);
	}

	open() {
		this.container.classList.add('modal_active');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.contentElement.replaceChildren();
		this.events.emit('modal:close');
	}
}
