import { IApi, IBuyer, IProduct } from '../../../types';

export class ApiService {
	private api: IApi;

	constructor(api: IApi) {
		this.api = api;
	}

	async getProducts(): Promise<IProduct[]> {
		const data = await this.api.get<{ items: IProduct[] }>('/product');

		return data.items;
	}

	async postOrder(buyer: IBuyer, items: IProduct[]): Promise<object> {
		const orderData = { buyer, items };

		return this.api.post('/order', orderData);
	}
}
