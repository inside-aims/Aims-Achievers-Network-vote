/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/config/server';

// Define the structure for our session state
interface UssdSessionState {
  level: number;
  nomineeId?: string;
  nomineeName?: string;
  categoryName?: string;
}

// Simple in-memory session store (replace with persistent storage for production)
const ussdSessions: {
  [sessionID: string]: UssdSessionState[];
} = {};

export async function POST(req: NextRequest) {
  const supabase = await getServerSupabase();

  const {
    sessionID,
    userID,
    newSession,
    msisdn,
    userData, // This is the user's input from the USSD menu
  } = await req.json();

  let message = '';
  let continueSession = true; // Default to true, set to false to end session

  // Initialize session if new or not found
  if (newSession || !ussdSessions[sessionID]) {
    ussdSessions[sessionID] = [{
      level: 0, // Start at level 0 for main menu
    }];
  }

  const sessionHistory = ussdSessions[sessionID];
  const currentState = sessionHistory[sessionHistory.length - 1];
  // Create a new state object for the next interaction, copying current state
  // This ensures that if we don't explicitly change a property, it persists
  const nextState: UssdSessionState = { ...currentState };

  try {
    if (newSession) {
      // Level 0: Main Menu (Initial interaction)
      message = "Welcome to AIMS Achievers Network Services Portal.\n1. E-Voting";
      nextState.level = 1; // Move to level 1 (awaiting E-Voting selection)
    } else {
      // Handle user input based on current level
      switch (currentState.level) {
        case 1: // E-Voting Menu
          if (userData === '1') { // User selected "E-Voting"
            message = "Enter Nominee Code:";
            nextState.level = 2; // Move to level 2 (awaiting nominee code)
          } else {
            message = "Invalid option. Please dial 1 for E-Voting.";
            // Keep the user at the same level to retry or end session
            // For simplicity, let's end the session if invalid option at this stage.
            continueSession = false;
          }
          break;

        case 2: // Awaiting Nominee Code
          const nomineeCode = userData.trim().toUpperCase(); // Sanitize and capitalize

          if (!nomineeCode) {
            message = "Nominee Code cannot be empty. Please try again:";
            // Stay on the same level
            nextState.level = 2;
          } else {
            // Fetch nominee and their category from the database
            const { data: nomineeDetails, error: nomineeError } = await supabase
              .from('nominee')
              .select(`
                id,
                name,
                category:categoryID (name)
              `)
              .eq('shortcode', nomineeCode)
              .single(); // Expecting a single nominee for a unique shortcode

            if (nomineeError || !nomineeDetails) {
              console.error('Error fetching nominee or nominee not found:', nomineeError?.message);
              message = "Invalid Nominee Code. Please check the code and try again. To restart, please redial the USSD code.";
              continueSession = false; // End session
            } else {
              // Type guard to ensure category is not an array and has a name
              const category = nomineeDetails.category as unknown as { name: string } | null;

              if (category && typeof category.name === 'string') {
                nextState.nomineeId = nomineeDetails.id;
                nextState.nomineeName = nomineeDetails.name;
                nextState.categoryName = category.name;

                message = `Confirm your vote for ${nextState.nomineeName} in the ${nextState.categoryName} category.\n1. Yes\n2. No`;
                nextState.level = 3; // Move to level 3 (Confirmation)
              } else {
                console.error('Nominee found but category details are missing or invalid:', nomineeDetails);
                message = "Error retrieving nominee details. Please try again later. To restart, please redial the USSD code.";
                continueSession = false; // End session
              }
            }
          }
          break;

        case 3: // Confirmation
          if (userData === '1') { // User confirmed "Yes"
            // TODO: Implement payment logic here in the future
            // For now, just acknowledge and end
            message = `Thank you for voting for ${currentState.nomineeName}! Payment integration is coming soon.`;
            continueSession = false; // End session
          } else if (userData === '2') { // User selected "No"
            message = "Vote cancelled. Thank you!";
            continueSession = false; // End session
          } else {
            message = `Invalid option. Confirm for ${currentState.nomineeName}?\n1. Yes\n2. No`;
            // Stay on the same level for re-entry
            nextState.level = 3;
          }
          break;

        default:
          // Should not happen, but handle unexpected state
          message = "An error occurred. Please try again by redialing the USSD code.";
          continueSession = false;
          break;
      }
    }

    // Update session history
    if (continueSession) {
      // If we are moving to a new state, push it.
      // If we are re-prompting on the same state (e.g. invalid input),
      // we might not need to push if nextState is identical to currentState,
      // but for simplicity and to ensure state changes are captured, we push.
      // However, if level hasn't changed and it's just a re-prompt, we might replace last state.
      // For this flow, pushing nextState is generally fine.
      // If the level is the same but other data in nextState changed (e.g. error message context), push.
      // If it's a simple re-prompt with the exact same message and state, no push needed.
      // Let's refine: only push if the state *meaningfully* changes or progresses.
      // If nextState.level is different from currentState.level, or if critical data like nomineeId is set, push.
      // If it's just a re-prompt on the same level due to invalid input, the message changes but the core state might not.
      // For simplicity in this example, we'll push the nextState.
      // A more robust system might differentiate between progressing and re-prompting.

      // If the level changed or if it's the initial session setup
      if (nextState.level !== currentState.level || sessionHistory.length === 1 && newSession) {
         sessionHistory.push(nextState);
      } else {
        // If staying on the same level (e.g. invalid input, re-prompting), update the last state
        sessionHistory[sessionHistory.length - 1] = nextState;
      }
      ussdSessions[sessionID] = sessionHistory;

    } else {
      // Clear session if the session is ending
      delete ussdSessions[sessionID];
    }

  } catch (error: any) {
    console.error("USSD V2 Error:", error);
    message = "An unexpected error occurred. Please try again by redialing the USSD code.";
    continueSession = false;
    // Clear session on error
    if (ussdSessions[sessionID]) {
      delete ussdSessions[sessionID];
    }
  }

  // USSD response format
  const response = {
    userID, // Echo back the userID
    sessionID, // Echo back the sessionID
    message,
    continueSession,
    msisdn, // Echo back the msisdn
  };

  return NextResponse.json(response);
}