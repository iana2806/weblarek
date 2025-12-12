import { IApi, IProduct, IOrder, IOrderResponse } from '../types';

export class ApiService {
	private api: IApi;

	constructor(api: IApi) {
		this.api = api;
	}

	async getProducts(): Promise<IProduct[]> {
		const data = await this.api.get<{ items: IProduct[] }>('/product');

		return data.items;
	}

	async postOrder(order: IOrder): Promise<IOrderResponse> {
		return this.api.post('/order', order);
	}
}
