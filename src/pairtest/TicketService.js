import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  #ticketPrices = {
    ADULT: 25,
    CHILD: 15,
    INFANT: 0
  };
  #MAX_TiCKETS = 25;
  #seatReservationService = new SeatReservationService();
  #ticketPaymentService = new TicketPaymentService();

  /*#totalTickets = 0; #adultTickets = 0;
  #totalAmount = 0; #totalSeats = 0;

  #makePayment(accountId, totalAmount) {
    const paymentService = new TicketPaymentService();
    paymentService.makePayment(accountId, totalAmount);
  }

  #reserveSeats(accountId, totalSeats){
    if(totalSeats > 0){
      const seatService = new SeatReservationService();
      seatService.reserveSeat(accountId, totalSeats);
    }
  }*/

  #makePayment(accountId, totalAmount) {
    this.#ticketPaymentService.makePayment(accountId, totalAmount)
  }
  
  #reserveSeats(accountId, totalSeats){
    if(totalSeats > 0){
      this.#seatReservationService.reserveSeat(accountId, totalSeats);
    }
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    if(accountId <= 0){
      // throws InvalidPurchaseException
      throw new InvalidPurchaseException("ID");
    }

  let totalTickets = 0, adultTickets = 0, totalAmount = 0, totalSeats = 0;

    for (const request of ticketTypeRequests){
      const type = String(request.getTicketType() || "").toUpperCase();
      const quantity = request.getNoOfTickets();

      totalTickets += quantity;
      totalAmount += this.#ticketPrices[type] * quantity;

      if(type === "ADULT"){
        adultTickets += quantity;
        totalSeats += quantity;
      }else if(type === "CHILD") {
        totalSeats += quantity;
        // console.log(totalSeats);
      }
    }
    console.log(totalSeats);

    if(totalTickets > this.#MAX_TiCKETS) {
      throw new InvalidPurchaseException(`Cannot purchase more than ${this.#MAX_TiCKETS} tickets`);
    }

    if(adultTickets === 0){
      throw new InvalidPurchaseException("At least one adult ticket must be purchased to accompany child or infant tickets");
    }

    this.#makePayment(accountId, totalAmount)
    this.#reserveSeats(accountId, totalSeats)
  }
}

const ticketService = new TicketService();
/*ticketService.purchaseTickets(1,  new TicketTypeRequest("ADULT", 2), 
                                  new TicketTypeRequest("CHILD", 1),
                                  new TicketTypeRequest("INFANT", 1));*/

ticketService.purchaseTickets(2, new TicketTypeRequest("ADULT", 10),
                                 new TicketTypeRequest("CHILD", 10),
                                 new TicketTypeRequest("INFANT", 5));
// ticketService.purchaseTickets(4,new TicketTypeRequest("CHILD", 2));
// ticketService.purchaseTickets( 5, new TicketTypeRequest("INFANT", 1));

// ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 1));
                                
