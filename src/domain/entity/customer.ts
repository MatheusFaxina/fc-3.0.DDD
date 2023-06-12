import Address from "./address";
import CustomerCreatedEvent from "../event/customer/customer-created.event";
import CustomerUpdatedAddressHandler from "../event/customer/handler/customer-updated-address.handler";
import CustomerUpdatedAddressEvent from "../event/customer/customer-updated-address.event";
import CustomerCreatedHandler from "../event/customer/handler/customer-created.handler";

export default class Customer {

    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;

        this.validate();

        const customerCreatedHandler = new CustomerCreatedHandler();
        customerCreatedHandler.handle(new CustomerCreatedEvent({
            customer: this
        }));
    }

    get name(): string {
        return this._name;
    }

    get isActive(): boolean {
        return this._active;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    get id(): string {
        return this._id;
    }

    changeAddress(address: Address) {
        this._address = address;

        const customerUpdatedAddressHandler = new CustomerUpdatedAddressHandler();
        customerUpdatedAddressHandler.handle(new CustomerUpdatedAddressEvent({
            id: this._id,
            name: this._name,
            address: address
        }));
    }

    get address(): Address {
        return this._address;
    }

    public changeName(name: string) {
        this._name = name;

        this.validate();
    }

    public activate() {
        if (this._address === undefined) {
            throw new Error('Address is mandatory to activate a customer');
        }

        this._active = true;
    }

    public deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints = this._rewardPoints + points;
    }

    private validate() {
        if (this._name.length === 0) {
            throw new Error('Name is required');
        }
        if (this._id.length === 0) {
            throw new Error('Id is required');
        }
    }
}