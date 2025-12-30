import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { AppEvents } from '../../utils/constants';

export class Cart {
	private items: IProduct[] = [];

	constructor(private events: IEvents) {}

	getItems(): IProduct[] {
		return this.items;
	}

	addItem(item: IProduct): void {
		this.items.push(item);
		this.events.emit(AppEvents.CartChanged, { item });
	}

	removeItem(item: IProduct): void {
		this.items = this.items.filter(i => i.id !== item.id);
		this.events.emit(AppEvents.CartChanged, { item });
	}

	clearCart(): void {
		this.items = [];
		this.events.emit(AppEvents.CartChanged, { item: null });
	}

	getTotal(): number {
		return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	getCount(): number {
		return this.items.length;
	}

	hasItem(id: string): boolean {
		return this.items.some(i => i.id === id);
	}
}
