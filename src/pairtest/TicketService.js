import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  /*
   * Constructs a TicketService instance and initializes payment and reservation services
  */
 constructor(){
  this.#seatReservationService = new SeatReservationService();
  this.#ticketPaymentService = new TicketPaymentService();
 }

 //Ticket prices based on type
  #ticketPrices = {
    ADULT: 25,
    CHILD: 15,
    INFANT: 0
  }; 

  //Maximum tickets per purchase
  #MAX_TiCKETS = 25;

  #seatReservationService;
  #ticketPaymentService;
 
   /**
   * Processes the payment for the ticket purchase.
   * @param {number} accountId - ID of the account making the purchase.
   * @param {number} totalAmount - Total amount to be charged.
   */
  #makePayment(accountId, totalAmount) {
    this.#ticketPaymentService.makePayment(accountId, totalAmount)
  }
  
  /**
   * Reserves seats for the ticket purchase.
   * @param {number} accountId - ID of the account making the reservation.
   * @param {number} totalSeats - Number of seats to be reserved.
   */
  #reserveSeats(accountId, totalSeats){
    if(totalSeats > 0){
      this.#seatReservationService.reserveSeat(accountId, totalSeats);
    }
  }

  /**
   * Validates the ticket purchase request.
   * Ensures account ID is valid, total tickets do not exceed the limit,
   * and at least one adult ticket is purchased if child or infant tickets are present.
   * @param {number} accountId - The ID of the purchasing account.
   * @param {number} totalTickets - The total number of tickets requested.
   * @param {number} adultTickets - The number of adult tickets requested.
   */

  #validateTickets(accountId, totalTickets, adultTickets){
    if(accountId <= 0){
      throw new InvalidPurchaseException("Invalid account ID: Account ID must be a positive integer");
    }

    if(totalTickets > this.#MAX_TiCKETS) {
      throw new InvalidPurchaseException(`Cannot purchase more than ${this.#MAX_TiCKETS} tickets`);
    }

    if(adultTickets === 0){
      throw new InvalidPurchaseException("At least one adult ticket must be purchased to accompany child or infant tickets");
    }

  }

  /**
   * Calculates the total number of tickets, amount to be paid, and seat reservations.
   * @param {TicketTypeRequest[]} ticketTypeRequests - Array of ticket type requests.
   * @returns {Object} An object containing totalTickets, adultTickets, totalAmount, and totalSeats.
   */
  #calculateTickets(ticketTypeRequests) {
    let totalTickets = 0, adultTickets = 0, totalAmount = 0, totalSeats = 0;

    for (const request of ticketTypeRequests){
      const type = String(request.getTicketType() || "").toUpperCase();
      const quantity = request.getNoOfTickets();
      console.log(type)

      if(type !== "INFANT"){
         totalTickets += quantity;
      }
      totalAmount += this.#ticketPrices[type] * quantity;

      if(type === "ADULT"){
        adultTickets += quantity;
        totalSeats += quantity;
      }else if(type === "CHILD") {
        totalSeats += quantity;
      }
    }
    console.log(totalSeats);

    return { totalTickets, adultTickets, totalAmount, totalSeats }
  }

  /**
   * Main method for purchasing tickets. It validates the request, processes payment,
   * and reserves the required seats.
   * @param {number} accountId - The ID of the purchasing account.
   * @param {...TicketTypeRequest} ticketTypeRequests - List of requested tickets.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    const { totalTickets, adultTickets, totalAmount, totalSeats} = this.#calculateTickets(ticketTypeRequests);
    this.#validateTickets(accountId, totalTickets, adultTickets);
    this.#makePayment(accountId, totalAmount)
    this.#reserveSeats(accountId, totalSeats)
  }
}
                              