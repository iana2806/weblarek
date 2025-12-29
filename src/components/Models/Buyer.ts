import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
	private payment: TPayment | null = null;
	private email: string = '';
	private phone: string = '';
	private address: string = '';

	constructor(private events: IEvents) {}

	setPayment(payment: TPayment): void {
		this.payment = payment;
		this.events.emit('buyer:changed', { field: 'payment', value: payment });
	}

	setData(key: keyof IBuyer, value: any) {
		(this as any)[key] = value;
		this.events.emit('buyer:changed', { field: key, value });
	}

	setAddress(address: string): void {
		this.address = address;
		this.events.emit('buyer:changed', { field: 'address', value: address });
	}

	setEmail(email: string): void {
		this.email = email;
		this.events.emit('buyer:changed', { field: 'email', value: email });
	}

	setPhone(phone: string): void {
		this.phone = phone;
		this.events.emit('buyer:changed', { field: 'phone', value: phone });
	}

	getData(): IBuyer {
		return {
			payment: this.payment as TPayment,
			email: this.email,
			phone: this.phone,
			address: this.address,
		};
	}

	clearData(): void {
		this.payment = null;
		this.email = '';
		this.phone = '';
		this.address = '';
		this.events.emit('buyer:changed', { field: 'all', value: null });
	}

	validate(): { [key: string]: string } {
		const errors: { [key: string]: string } = {};

		if (!this.payment) {
			errors.payment = 'Не выбран вид оплаты';
		}

		if (!this.email.trim()) {
			errors.email = 'Укажите email';
		}

		if (!this.phone.trim()) {
			errors.phone = 'Укажите телефон';
		}

		if (!this.address.trim()) {
			errors.address = 'Укажите адрес';
		}

		return errors;
	}
}
