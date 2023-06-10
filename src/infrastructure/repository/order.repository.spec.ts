import { Sequelize } from "sequelize-typescript";
import CustomerRepository from "./customer.repository";
import CustomerModel from "../db/sequelize/model/customer.model";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import OrderItem from "../../domain/entity/order_item";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderRepository from "./order.repository";
import Order from "../../domain/entity/order";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([OrderModel, OrderItemModel, CustomerModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a new order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = createCustomer("1", "Customer 1", "Street", 1, "12312-123", "City", true, 0);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = createProduct("1", "Product 1", 100)
        await productRepository.create(product);

        const orderRepository = new OrderRepository();
        await orderRepository.create(
            createOrder("1", product, 2, "1", "1",
                [new OrderItem("1", product.name, product.price, product.id, 2)])
        );

        const orderModel = await OrderModel.findOne({
            where: {
                id: "1",
            },
            include: ["items"],
        });

        expect(orderModel.id).toBe("1");
        expect(orderModel.customer_id).toBe("1");
        expect(orderModel.total).toBe(200);
        expect(orderModel.items[0].id).toBe("1");
        expect(orderModel.items[0].product_id).toBe("1");
        expect(orderModel.items[0].order_id).toBe("1");
        expect(orderModel.items[0].quantity).toBe(2);
        expect(orderModel.items[0].name).toBe("Product 1");
        expect(orderModel.items[0].price).toBe(100);
    });

    it('should update a order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = createCustomer("1", "Customer 1", "Street", 1, "12312-123", "City", true, 0);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = createProduct("1", "Product 1", 100)
        await productRepository.create(product);

        const orderRepository = new OrderRepository();
        const order = createOrder("1", product, 2, "1", "1",
            [new OrderItem("1", product.name, product.price, product.id, 2)]);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: {
                id: "1",
            },
            include: ["items"],
        });

        expect(orderModel.id).toBe("1");
        expect(orderModel.customer_id).toBe("1");
        expect(orderModel.total).toBe(200);
        expect(orderModel.items[0].id).toBe("1");
        expect(orderModel.items[0].product_id).toBe("1");
        expect(orderModel.items[0].order_id).toBe("1");
        expect(orderModel.items[0].quantity).toBe(2);
        expect(orderModel.items[0].name).toBe("Product 1");
        expect(orderModel.items[0].price).toBe(100);

        const product2 = new Product("2", "Product 2", 200);
        await productRepository.create(product2);
        order.addNewItem(new OrderItem("2", product2.name, product2.price, product2.id, 2));
        await orderRepository.update(order);

        const orderModel2 = await OrderModel.findOne({
            where: {
                id: "1",
            },
            include: ["items"],
        });

        expect(orderModel2.id).toBe("1");
        expect(orderModel2.customer_id).toBe("1");
        expect(orderModel2.total).toBe(600);
        expect(orderModel2.items[0].id).toBe("1");
        expect(orderModel2.items[0].product_id).toBe("1");
        expect(orderModel2.items[0].order_id).toBe("1");
        expect(orderModel2.items[0].quantity).toBe(2);
        expect(orderModel2.items[0].name).toBe("Product 1");
        expect(orderModel2.items[0].price).toBe(100);
        expect(orderModel2.items[1].id).toBe("2");
        expect(orderModel2.items[1].product_id).toBe("2");
        expect(orderModel2.items[1].order_id).toBe("1");
        expect(orderModel2.items[1].quantity).toBe(2);
        expect(orderModel2.items[1].name).toBe("Product 2");
        expect(orderModel2.items[1].price).toBe(200);
    });

    it('should find a order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = createCustomer("1", "Customer 1", "Street", 1, "12312-123", "City", true, 0);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = createProduct("1", "Product 1", 100)
        await productRepository.create(product);

        const orderRepository = new OrderRepository();
        const order = createOrder("1", product, 2, "1", "1",
            [new OrderItem("1", product.name, product.price, product.id, 2)]);
        await orderRepository.create(order);

        const orderFound = await orderRepository.find("1");

        expect(orderFound.id).toBe("1");
        expect(orderFound.customerId).toBe("1");
        expect(orderFound.total()).toBe(200);
        expect(orderFound.items[0].id).toBe("1");
        expect(orderFound.items[0].productId).toBe("1");
        expect(orderFound.items[0].quantity).toBe(2);
        expect(orderFound.items[0].name).toBe("Product 1");
        expect(orderFound.items[0].price).toBe(100);
    });

    it('should find all order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = createCustomer("1", "Customer 1", "Street", 1, "12312-123", "City", true, 0);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = createProduct("1", "Product 1", 100)
        await productRepository.create(product);

        const orderRepository = new OrderRepository();
        await orderRepository.create(createOrder("1", product, 2, "1", "1",
            [new OrderItem("1", product.name, product.price, product.id, 2)]));
        await orderRepository.create(createOrder("2", product, 2, "2", "1",
            [new OrderItem("2", product.name, product.price, product.id, 2)]));

        const orderFound = await orderRepository.findAll();

        expect(orderFound[0].id).toBe("1");
        expect(orderFound[0].customerId).toBe("1");
        expect(orderFound[0].total()).toBe(200);
        expect(orderFound[0].items[0].id).toBe("1");
        expect(orderFound[0].items[0].productId).toBe("1");
        expect(orderFound[0].items[0].quantity).toBe(2);
        expect(orderFound[0].items[0].name).toBe("Product 1");
        expect(orderFound[0].items[0].price).toBe(100);

        expect(orderFound[1].id).toBe("2");
        expect(orderFound[1].customerId).toBe("1");
        expect(orderFound[1].total()).toBe(200);
        expect(orderFound[1].items[0].id).toBe("2");
        expect(orderFound[1].items[0].productId).toBe("1");
        expect(orderFound[1].items[0].quantity).toBe(2);
        expect(orderFound[1].items[0].name).toBe("Product 1");
        expect(orderFound[1].items[0].price).toBe(100);
    });

    function createCustomer(id: string, name: string, street: string, number: number, zip: string, city: string, activate: boolean, rewardPoints: number) {
        const customer = new Customer(id, name);
        customer.changeAddress(new Address(street, number, zip, city));

        if (activate) {
            customer.activate();
        }

        if (rewardPoints > 0) {
            customer.addRewardPoints(rewardPoints);
        }

        return customer;
    }

    function createProduct(id: string, name: string, price: number) {
        return new Product(id, name, price);
    }

    function createOrder(orderItemId: string, product: Product, quantity: number, orderId: string, customerId: string, items: OrderItem[]) {
        return new Order(orderId, customerId, items);
    }

});