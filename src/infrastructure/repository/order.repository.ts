import Order from "../../domain/entity/order";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItem from "../../domain/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{model: OrderItemModel}]
            });
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: {
                id: id,
            },
            include: ["items"]
        });

        return new Order(
            orderModel.id, orderModel.customer_id,
            orderModel.items.map(item =>
                new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
            )
        );
    }

    async findAll(): Promise<Order[]> {
        const orders = await OrderModel.findAll({
            include: ["items"]
        });

        return orders.map(order => new Order(
            order.id, order.customer_id,
            order.items.map(item =>
                new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
            )
        ))
    }

    async update(entity: Order): Promise<void> {
        const sequelize = OrderModel.sequelize;
        await sequelize.transaction(async (transaction) => {
            await OrderItemModel.destroy({
                where: { order_id: entity.id },
                transaction,
            });

            await OrderItemModel.bulkCreate(entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id,
            })), { transaction });

            await OrderModel.update(
                {
                    customer_id: entity.customerId,
                    total: entity.total(),
                },
                { where: { id: entity.id }, transaction }
            );
        });
    }

}