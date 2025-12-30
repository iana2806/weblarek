import { IEvents } from '../../base/Events';
import { AppEvents, categoryMap } from '../../../utils/constants';
import { CardProduct } from './CardProduct';

export class CardCatalog extends CardProduct {
	constructor(protected events: IEvents, container: HTMLElement) {
		super(events, container);

		this.container.addEventListener('click', () => {
			this.events.emit(AppEvents.CardPreview, {
				id: this.container.dataset.id,
			});
		});
	}

	set category(value: string) {
		super.category = value;

		Object.values(categoryMap).forEach(mod =>
			this.categoryElement.classList.remove(mod)
		);

		const modifier = categoryMap[value as keyof typeof categoryMap];

		if (modifier) {
			this.categoryElement.classList.add(modifier);
		}
	}
}
