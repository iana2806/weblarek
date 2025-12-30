import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

interface IModal {
	content: HTMLElement;
}

export class Modal extends Component<IModal> {
	protected contentElement: HTMLElement;
	protected closeButton: HTMLButtonElement;

	_handleEscape = (evt: KeyboardEvent) => {
		if (evt.key === 'Escape') {
			this.close();
		}
	};

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

		this.container.addEventListener('click', event => {
			if (event.target === this.container) {
				this.close();
			}
		});
	}

	set content(element: HTMLElement) {
		this.contentElement.replaceChildren(element);
	}

	open() {
		this.container.classList.add('modal_active');
		document.addEventListener('keydown', this._handleEscape);
	}

	close() {
		this.container.classList.remove('modal_active');
		this.contentElement.replaceChildren();
		this.events.emit(AppEvents.ModalClose);
		document.removeEventListener('keydown', this._handleEscape);
	}
}
