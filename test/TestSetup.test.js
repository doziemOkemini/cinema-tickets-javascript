import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
// import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
// import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";

//Mock External Services
jest.mock("../src/thirdparty/paymentgateway/TicketPaymentService.js", () => {
    return jest.fn().mockImplementation(() => ({
        makePayment: jest.fn()
    }));
});

jest.mock("../src/thirdparty/seatbooking/SeatReservationService.js", () => {
    return jest.fn().mockImplementation(() => ({
        reserveSeat: jest.fn()
    }));
});

describe("TicketService Tests", () => {
    let ticketService;

    beforeEach( () => {
        ticketService = new TicketService();
    });

    test('should successfully process a valid purchase', () => {
      expect( () => {
        ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 2), new TicketTypeRequest("CHILD", 1));
      }).not.toThrow();
    });

    test("should throw error when purchasing more than max tickets", () => {
        expect(() => {
          ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 26));
        }).toThrow("Cannot purchase more than");
      });
    
    test("should throw error when purchasing child tickets without an adult", () => {
        expect(() => {
          ticketService.purchaseTickets(1, new TicketTypeRequest("CHILD", 2));
        }).toThrow("At least one adult ticket");
    });
    
    test("should throw error when account ID is invalid", () => {
        expect(() => {
          ticketService.purchaseTickets(-1, new TicketTypeRequest("ADULT", 1));
        }).toThrow("Invalid account ID");
    });
    
    test("should throw error when ticket type is invalid", () => {
        expect(() => {
          ticketService.purchaseTickets(1, new TicketTypeRequest("INVALID", 1));
        }).toThrow("Invalid ticket type provided");
    });
    
})