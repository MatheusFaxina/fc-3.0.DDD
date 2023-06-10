import Address from "./address";

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