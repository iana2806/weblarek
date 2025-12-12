import { IBuyer, TPayment } from '../../types';

export class Buyer {
	private payment: TPayment | null = null;
	private email: string = '';
	private phone: string = '';
	private address: string = '';

	constructor() {}

	setPayment(payment: TPayment): void {
		this.payment = payment;
	}

	setData(key: keyof IBuyer, value: any) {
		(this as any)[key] = value;
	}

	setAddress(address: string): void {
		this.address = address;
	}

	setEmail(email: string): void {
		this.email = email;
	}

	setPhone(phone: string): void {
		this.phone = phone;
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
