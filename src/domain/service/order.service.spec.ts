import OrderItem from "../entity/order_item";
import Order from "../entity/order";
import OrderService from "./order.service";
import Customer from "../entity/customer";

describe("Order service unit tests", () => {

    it("should get total of all orders", () => {
        const item1 = new OrderItem("1", "Item 1", 100, "1", 1);
        const order1 = new Order("1", "1", [item1]);

        const item2 = new OrderItem("2", "Item 2", 200, "2", 2);
        const order2 = new Order("1", "1", [item2]);

        const total = OrderService.total([order1, order2]);

        expect(total).toBe(500);
    });

    it("should place an order", () => {
        const customer = new Customer("1", "Customer 1");
        const item1 = new OrderItem("1", "Item 1", 10, "1", 1);

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });

});