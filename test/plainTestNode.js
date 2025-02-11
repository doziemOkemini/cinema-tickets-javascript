import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

function runTests() {
  const ticketService = new TicketService();

  try {
    console.log("✅ Test 1: Valid Purchase (2 Adults, 1 Child)");
    ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 2), new TicketTypeRequest("CHILD", 1));
    console.log("✅ Passed!\n");
  } catch (error) {
    console.error("❌ Failed:", error.message);
  }

  try {
    console.log("✅ Test 2: Exceed Max Tickets (26 Adults)");
    ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 26));
    console.error("❌ Failed: Should have thrown an error!\n");
  } catch (error) {
    console.log("✅ Passed:", error.message, "\n");
  }

  try {
    console.log("✅ Test 3: No Adult Ticket (2 Children)");
    ticketService.purchaseTickets(1, new TicketTypeRequest("CHILD", 2));
    console.error("❌ Failed: Should have thrown an error!\n");
  } catch (error) {
    console.log("✅ Passed:", error.message, "\n");
  }

  try {
    console.log("✅ Test 4: Invalid Account ID (-1)");
    ticketService.purchaseTickets(-1, new TicketTypeRequest("ADULT", 1));
    console.error("❌ Failed: Should have thrown an error!\n");
  } catch (error) {
    console.log("✅ Passed:", error.message, "\n");
  }

  try {
    console.log("✅ Test 5: Invalid Ticket Type (DOG)");
    ticketService.purchaseTickets(1, new TicketTypeRequest("DOG", 1));
    console.error("❌ Failed: Should have thrown an error!\n");
  } catch (error) {
    console.log("✅ Passed:", error.message, "\n");
  }
}

runTests();
