// Reset the state of the application back to the start
export function clear() {
    
    // Clearing
    data = {
        users: [],
        quizzes: [],
    }

    return {
        // Returns empty object
    };
}