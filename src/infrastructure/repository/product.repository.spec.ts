import { Sequelize } from "sequelize-typescript";
import ProductModel from "../db/sequelize/model/product.model";
import Product from "../../domain/entity/product";
import ProductRepository from "./product.repository";

describe("Product repository unit tests", () => {
    let sequileze: Sequelize;

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequileze.addModels([ProductModel]);
        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it('should create a product', async () => {
        const productRepository = new ProductRepository();

        const product = new Product("1", "Product 1", 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({
            where: {
                id: "1",
            }
        });

        expect(productModel.id).toBe("1");
        expect(productModel.name).toBe("Product 1");
        expect(productModel.price).toBe(100);
    });

    it('should update a product', async () => {
        const productRepository = new ProductRepository();

        const product = new Product("1", "Product 1", 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({
            where: {
                id: "1",
            }
        });

        expect(productModel.id).toBe("1");
        expect(productModel.name).toBe("Product 1");
        expect(productModel.price).toBe(100);

        product.changeName("Product 2");
        product.changePrice(200);

        await productRepository.update(product);

        const productModel2 = await ProductModel.findOne({
            where: {
                id: "1",
            }
        });

        expect(productModel2.id).toBe("1");
        expect(productModel2.name).toBe("Product 2");
        expect(productModel2.price).toBe(200);
    });

    it('should find a product', async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);

        await productRepository.create(product);

        const productModel = await productRepository.find("1");

        expect(productModel.id).toBe("1");
        expect(productModel.name).toBe("Product 1");
        expect(productModel.price).toBe(100);
    });

    it('should find all product', async () => {
        const productRepository = new ProductRepository();
        await productRepository.create(new Product("1", "Product 1", 100));
        await productRepository.create(new Product("2", "Product 2", 100));
        await productRepository.create(new Product("3", "Product 3", 100));

        const productModels = await productRepository.findAll();

        expect(productModels[0].id).toBe("1");
        expect(productModels[0].name).toBe("Product 1");
        expect(productModels[0].price).toBe(100);

        expect(productModels[1].id).toBe("2");
        expect(productModels[1].name).toBe("Product 2");
        expect(productModels[1].price).toBe(100);

        expect(productModels[2].id).toBe("3");
        expect(productModels[2].name).toBe("Product 3");
        expect(productModels[2].price).toBe(100);
    });
});