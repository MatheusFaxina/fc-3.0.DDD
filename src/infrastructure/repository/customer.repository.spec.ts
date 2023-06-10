import { Sequelize } from "sequelize-typescript";
import CustomerRepository from "./customer.repository";
import CustomerModel from "../db/sequelize/model/customer.model";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";

describe("Customer repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        await customerRepository.create(
            createCustomer("123", "Customer 1", "Street 1", 1, "12345-123", "City",
                false, 0)
        );

        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

        expect(customerModel.id).toBe("123");
        expect(customerModel.name).toBe("Customer 1");
        expect(customerModel.active).toBe(false);
        expect(customerModel.rewardPoints).toBe(0);
        expect(customerModel.street).toBe("Street 1");
        expect(customerModel.number).toBe(1);
        expect(customerModel.zipcode).toBe("12345-123");
        expect(customerModel.city).toBe("City");
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        let customer = createCustomer("123", "Customer 1", "Street 1", 1, "12345-123", "City",
            false, 0);
        await customerRepository.create(customer);

        customer.changeName("Customer 2");
        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

        expect(customerModel.id).toBe("123");
        expect(customerModel.name).toBe("Customer 2");
        expect(customerModel.active).toBe(false);
        expect(customerModel.rewardPoints).toBe(0);
        expect(customerModel.street).toBe("Street 1");
        expect(customerModel.number).toBe(1);
        expect(customerModel.zipcode).toBe("12345-123");
        expect(customerModel.city).toBe("City");
    });

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        await customerRepository.create(createCustomer("123", "Customer 1", "Street 1", 1, "12345-123", "City",
            false, 0));

        const customerResult = await customerRepository.find("123");

        expect(customerResult.id).toBe("123");
        expect(customerResult.name).toBe("Customer 1");
        expect(customerResult.isActive).toBe(false);
        expect(customerResult.rewardPoints).toBe(0);
        expect(customerResult.address.street).toBe("Street 1");
        expect(customerResult.address.number).toBe(1);
        expect(customerResult.address.zip).toBe("12345-123");
        expect(customerResult.address.city).toBe("City");
    });

    it("should throw an error when customer is not found", async () => {
        const customerRepository = new CustomerRepository();

        await expect(async () => {
            await customerRepository.find("456ABC");
        }).rejects.toThrow("Customer not found");
    });

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();

        await customerRepository.create(createCustomer("123", "Customer 1", "Street 1", 1, "12345-123", "City",
            true, 10));

        await customerRepository.create(createCustomer("456", "Customer 2", "Street 2", 2, "12345-123", "City",
            false, 20));

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);
        expect(customers[0].id).toBe("123");
        expect(customers[0].name).toBe("Customer 1");
        expect(customers[0].isActive).toBe(true);
        expect(customers[0].rewardPoints).toBe(10);
        expect(customers[0].address.street).toBe("Street 1");
        expect(customers[0].address.number).toBe(1);
        expect(customers[0].address.zip).toBe("12345-123");
        expect(customers[0].address.city).toBe("City");
        expect(customers[1].id).toBe("456");
        expect(customers[1].name).toBe("Customer 2");
        expect(customers[1].isActive).toBe(false);
        expect(customers[1].rewardPoints).toBe(20);
        expect(customers[1].address.street).toBe("Street 2");
        expect(customers[1].address.number).toBe(2);
        expect(customers[1].address.zip).toBe("12345-123");
        expect(customers[1].address.city).toBe("City");
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
});