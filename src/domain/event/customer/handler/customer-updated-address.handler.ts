import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerUpdatedAddressEvent from "../customer-updated-address.event";

export default class CustomerUpdatedAddressHandler implements EventHandlerInterface<CustomerUpdatedAddressEvent> {

    handle(event: CustomerUpdatedAddressEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}`);
    }

}