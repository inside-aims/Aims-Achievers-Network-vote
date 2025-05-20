/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/config/server';

// Simple in-memory session store (replace with persistent storage for production)
const ussdSessions: {
  [sessionID: string]: {
    level: number;
    page: number;
    selectedEventId?: number;
    selectedCategoryId?: string;
    selectedNomineeId?: string;
    events?: any[]; // Cache fetched data
    categories?: any[];
    nominees?: any[];
  }[];
} = {};

export async function POST(req: NextRequest) {
  const supabase = await getServerSupabase();

  const {
    sessionID,
    userID,
    newSession,
    msisdn,
    userData,

  } = await req.json();

  let message = '';
  let continueSession = false;

  // Initialize session if new
  if (newSession || !ussdSessions[sessionID]) {
    ussdSessions[sessionID] = [{
      level: 0, // Start at level 0 for main menu
      page: 1,
    }];
  }

  const sessionHistory = ussdSessions[sessionID];
  const currentState = sessionHistory[sessionHistory.length - 1];
  const nextState = { ...currentState }; // State for the next interaction

  try {
    if (newSession) {
      // Level 0: Main Menu
      message = "Welcome to AIMS Achievers Network Voting Portal." +
        "\n1. Events";
      continueSession = true;
      nextState.level = 1; // Move to level 1 after showing main menu
      nextState.page = 1;
    } else {
      // Handle user input based on current level
      switch (currentState.level) {
        case 1: // Events Menu
          if (userData === '1') {
            // Fetch events
            const { data: events, error } = await supabase
              .from('event')
              .select('id, name')
              .order('name', { ascending: true });

            if (error || !events || events.length === 0) {
              message = "No events available. Thank you!";
              continueSession = false;
              // Clear session on error/end
              delete ussdSessions[sessionID];
            } else {
              nextState.events = events;
              const pageSize = 5; // Number of events per page
              const totalPages = Math.ceil(events.length / pageSize);
              const startIndex = (currentState.page - 1) * pageSize;
              const endIndex = startIndex + pageSize;
              const currentEvents = events.slice(startIndex, endIndex);

              message = "Select an event:";
              currentEvents.forEach((event, index) => {
                message += `\n${startIndex + index + 1}. ${event.name}`;
              });

              if (currentState.page < totalPages) {
                message += "\n#. Next Page";
              }
              if (currentState.page > 1) {
                message += "\n*. Go Back";
              }

              continueSession = true;
              nextState.level = 2; // Move to level 2 (Event Selection)
            }
          } else {
            message = "Invalid option. Please select 1 for Events.";
            continueSession = false;
            // Clear session on invalid input at level 1
            delete ussdSessions[sessionID];
          }
          break;

        case 2: // Event Selection
          const events = currentState.events;
          const pageSize = 5;
          const totalPages = Math.ceil((events?.length || 0) / pageSize);

          if (userData === '#') {
            // Next Page
            if (currentState.page < totalPages) {
              nextState.page = currentState.page + 1;
              const startIndex = (nextState.page - 1) * pageSize;
              const endIndex = startIndex + pageSize;
              const currentEvents = events?.slice(startIndex, endIndex);

              message = "Select an event:";
              currentEvents?.forEach((event, index) => {
                message += `\n${startIndex + index + 1}. ${event.name}`;
              });

              if (nextState.page < totalPages) {
                message += "\n#. Next Page";
              }
              message += "\n*. Go Back"; // Always allow going back from subsequent pages

              continueSession = true;
            } else {
              // Already on last page
              message = "No more events. Select an event or Go Back (*).";
              continueSession = true;
            }
          } else if (userData === '*') {
            // Go Back
            if (currentState.page > 1) {
              nextState.page = currentState.page - 1;
              const startIndex = (nextState.page - 1) * pageSize;
              const endIndex = startIndex + pageSize;
              const currentEvents = events?.slice(startIndex, endIndex);

              message = "Select an event:";
              currentEvents?.forEach((event, index) => {
                message += `\n${startIndex + index + 1}. ${event.name}`;
              });

              if (nextState.page < totalPages) {
                message += "\n#. Next Page";
              }
              if (nextState.page > 1) {
                message += "\n*. Go Back";
              }
              continueSession = true;
            } else {
              // Go back to main menu from first page
              message = "Welcome to AIMS Achievers Network Voting Portal." +
                "\n1. Events";
              continueSession = true;
              nextState.level = 1;
              nextState.page = 1;
              delete nextState.events; // Clear cached events
            }
          } else {
            // Select an event
            const selectedIndex = parseInt(userData, 10) - 1;
            const startIndex = (currentState.page - 1) * pageSize;
            const selectedEvent = events?.[startIndex + selectedIndex];

            if (selectedEvent) {
              nextState.selectedEventId = selectedEvent.id;
              nextState.level = 3; // Move to Category Selection
              nextState.page = 1; // Reset page for categories
              delete nextState.events; // Clear cached events

              // Fetch categories for the selected event
              const { data: categories, error } = await supabase
                .from('category')
                .select('id, name')
                .eq('eventID', selectedEvent.id)
                .order('name', { ascending: true });

              if (error || !categories || categories.length === 0) {
                message = `No categories available for ${selectedEvent.name}. Thank you!`;
                continueSession = false;
                // Clear session on error/end
                delete ussdSessions[sessionID];
              } else {
                nextState.categories = categories;
                const categoryPageSize = 5; // Number of categories per page
                const totalCategoryPages = Math.ceil(categories.length / categoryPageSize);
                const currentCategories = categories.slice(0, categoryPageSize);

                message = `Select a category for ${selectedEvent.name}:`;
                currentCategories.forEach((category, index) => {
                  message += `\n${index + 1}. ${category.name}`;
                });

                if (1 < totalCategoryPages) {
                  message += "\n#. Next Page";
                }
                message += "\n*. Go Back"; // Allow going back to events list

                continueSession = true;
              }
            } else {
              message = "Invalid event selection. Please try again.";
              continueSession = true; // Stay on the same level/page
            }
          }
          break;

        case 3: // Category Selection
          const categories = currentState.categories;
          const categoryPageSize = 5;
          const totalCategoryPages = Math.ceil((categories?.length || 0) / categoryPageSize);

          if (userData === '#') {
            // Next Page
            if (currentState.page < totalCategoryPages) {
              nextState.page = currentState.page + 1;
              const startIndex = (nextState.page - 1) * categoryPageSize;
              const endIndex = startIndex + categoryPageSize;
              const currentCategories = categories?.slice(startIndex, endIndex);

              message = "Select a category:";
              currentCategories?.forEach((category, index) => {
                message += `\n${startIndex + index + 1}. ${category.name}`;
              });

              if (nextState.page < totalCategoryPages) {
                message += "\n#. Next Page";
              }
              message += "\n*. Go Back";

              continueSession = true;
            } else {
              message = "No more categories. Select a category or Go Back (*).";
              continueSession = true;
            }
          } else if (userData === '*') {
            // Go Back to Events List
            message = "Select an event:";
            // Re-fetch or use cached events if available (need to re-implement event caching)
            // For now, going back returns to the main menu for simplicity
            message = "Welcome to AIMS Achievers Network Voting Portal." +
              "\n1. Events";
            continueSession = true;
            nextState.level = 1;
            nextState.page = 1;
            delete nextState.categories;
            delete nextState.selectedEventId;
          } else {
            // Select a category
            const selectedIndex = parseInt(userData, 10) - 1;
            const startIndex = (currentState.page - 1) * categoryPageSize;
            const selectedCategory = categories?.[startIndex + selectedIndex];

            if (selectedCategory) {
              nextState.selectedCategoryId = selectedCategory.id;
              nextState.level = 4; // Move to Nominee Selection
              nextState.page = 1; // Reset page for nominees
              delete nextState.categories; // Clear cached categories

              // Fetch nominees for the selected category
              const { data: nominees, error } = await supabase
                .from('nominee')
                .select('id, name')
                .eq('categoryID', selectedCategory.id)
                .order('name', { ascending: true });

              if (error || !nominees || nominees.length === 0) {
                message = `No nominees available for ${selectedCategory.name}. Thank you!`;
                continueSession = false;
                // Clear session on error/end
                delete ussdSessions[sessionID];
              } else {
                nextState.nominees = nominees;
                const nomineePageSize = 5; // Number of nominees per page
                const totalNomineePages = Math.ceil(nominees.length / nomineePageSize);
                const currentNominees = nominees.slice(0, nomineePageSize);

                message = `Select a nominee for ${selectedCategory.name}:`;
                currentNominees.forEach((nominee, index) => {
                  message += `\n${index + 1}. ${nominee.name}`;
                });

                if (1 < totalNomineePages) {
                  message += "\n#. Next Page";
                }
                message += "\n*. Go Back"; // Allow going back to categories list

                continueSession = true;
              }
            } else {
              message = "Invalid category selection. Please try again.";
              continueSession = true; // Stay on the same level/page
            }
          }
          break;

        case 4: // Nominee Selection
          const nominees = currentState.nominees;
          const nomineePageSize = 5;
          const totalNomineePages = Math.ceil((nominees?.length || 0) / nomineePageSize);

          if (userData === '#') {
            // Next Page
            if (currentState.page < totalNomineePages) {
              nextState.page = currentState.page + 1;
              const startIndex = (nextState.page - 1) * nomineePageSize;
              const endIndex = startIndex + nomineePageSize;
              const currentNominees = nominees?.slice(startIndex, endIndex);

              message = "Select a nominee:";
              currentNominees?.forEach((nominee, index) => {
                message += `\n${startIndex + index + 1}. ${nominee.name}`;
              });

              if (nextState.page < totalNomineePages) {
                message += "\n#. Next Page";
              }
              message += "\n*. Go Back";

              continueSession = true;
            } else {
              message = "No more nominees. Select a nominee or Go Back (*).";
              continueSession = true;
            }
          } else if (userData === '*') {
            // Go Back to Categories List
            message = "Select a category:";
            // Re-fetch or use cached categories if available (need to re-implement category caching)
            // For now, going back returns to the main menu for simplicity
            message = "Welcome to AIMS Achievers Network Voting Portal." +
              "\n1. Events";
            continueSession = true;
            nextState.level = 1;
            nextState.page = 1;
            delete nextState.nominees;
            delete nextState.selectedCategoryId;
            delete nextState.selectedEventId;
          } else {
            // Select a nominee
            const selectedIndex = parseInt(userData, 10) - 1;
            const startIndex = (currentState.page - 1) * nomineePageSize;
            const selectedNominee = nominees?.[startIndex + selectedIndex];

            if (selectedNominee) {
              nextState.selectedNomineeId = selectedNominee.id;
              nextState.level = 5; // Move to Confirmation
              nextState.page = 1; // Reset page for confirmation
              delete nextState.nominees; // Clear cached nominees

              // Fetch nominee and category details for confirmation message
              const { data: nomineeDetails, error: nomineeError } = await supabase
                .from('nominee')
                .select('name, category:categoryID(name)')
                .eq('id', selectedNominee.id)
                .single();

              if (nomineeError || !nomineeDetails) {
                message = "Error fetching nominee details. Please try again.";
                continueSession = false;
                delete ussdSessions[sessionID];
              } else {
                message = `Confirm your vote for ${nomineeDetails.name} in the ${nomineeDetails.category[0].name} category.` +
                  "\n1. Yes" +
                  "\n2. No";
                continueSession = true;
              }
            } else {
              message = "Invalid nominee selection. Please try again.";
              continueSession = true; // Stay on the same level/page
            }
          }
          break;

        case 5: // Confirmation
          if (userData === '1') {
            // User confirmed vote (Yes)
            // TODO: Implement payment logic here
            message = "Thank you for confirming! Payment integration is coming soon.";
            continueSession = false;
            // Clear session after successful confirmation (or after payment)
            delete ussdSessions[sessionID];
          } else if (userData === '2') {
            // User cancelled vote (No)
            message = "Vote cancelled. Thank you!";
            continueSession = false;
            // Clear session after cancellation
            delete ussdSessions[sessionID];
          } else {
            message = "Invalid option. Please select 1 for Yes or 2 for No.";
            continueSession = true; // Stay on confirmation level
          }
          break;

        default:
          // Should not happen, but handle unexpected state
          message = "An error occurred. Please try again.";
          continueSession = false;
          delete ussdSessions[sessionID];
          break;
      }
    }

    // Update session history
    if (continueSession) {
      sessionHistory.push(nextState);
      ussdSessions[sessionID] = sessionHistory;
    } else {
      // Clear session if the session is ending
      delete ussdSessions[sessionID];
    }

  } catch (error) {
    console.error("USSD Error:", error);
    message = "An unexpected error occurred. Please try again.";
    continueSession = false;
    // Clear session on error
    delete ussdSessions[sessionID];
  }

  // USSD response format
  const response = {
    userID,
    sessionID,
    message,
    continueSession,
    msisdn,
  };

  return NextResponse.json(response);
}