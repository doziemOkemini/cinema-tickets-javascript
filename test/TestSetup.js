import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

const ticketService = new TicketService();

/*ticketService.purchaseTickets(1,  new TicketTypeRequest("ADULT", 2), 
                                  new TicketTypeRequest("CHILD", 1),
                                  new TicketTypeRequest("INFANT", 1));

ticketService.purchaseTickets(2, new TicketTypeRequest("ADULT", 10),
                                 new TicketTypeRequest("CHILD", 10),
                                 new TicketTypeRequest("INFANT", 5));

ticketService.purchaseTickets(4,new TicketTypeRequest("CHILD", 2));

ticketService.purchaseTickets( 5, new TicketTypeRequest("INFANT", 1));

ticketService.purchaseTickets(-1, new TicketTypeRequest("ADULT", 25));


ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 30));*/