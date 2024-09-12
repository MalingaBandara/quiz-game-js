// Initialize variables to track time, question number, interval for the timer, and submitted answers.
let sec = 0; // Timer seconds
let qNumber = 1; // Current question number
let interval = undefined; // Interval for the timer
let submitDataArray = []; // Array to store submitted answers
let score = 0; // Variable to track the user's score

// Set initial values for the timer, question number, and score
$('#txt-time').val('00:00'); // Set the timer to '00:00'
$('#txt-q-number').val('1/5'); // Set the initial question number display to '1/5'
$('#txt-marks').val('0'); // Set initial score to 0

//---------- Q & A --------------

// Answer class to represent a possible answer to a question.
class Answer {
    constructor(id, answer, correctState) {
        this.id = id; // Answer ID
        this.answer = answer; // Text of the answer
        this.correctState = correctState; // Boolean indicating if the answer is correct
    }
}

// Question class to represent a question with its possible answers.
class Question {
    constructor(id, question, answers) {
        this.id = id; // Question ID
        this.question = question; // Text of the question
        this.answers = answers; // Array of Answer objects representing possible answers
    }
}

// Initialize an array to store all the questions and answers.
let dataArray = [];

// Create and add questions and their possible answers into the dataArray.
let q1 = new Question(1, 'What is the capital of France?', [
    new Answer(1, 'Berlin', false),
    new Answer(2, 'Madrid', false),
    new Answer(3, 'Paris', true), // Correct answer
    new Answer(4, 'Rome', false)
]);

let q2 = new Question(2, 'What is the chemical symbol for water?', [
    new Answer(1, 'O2', false),
    new Answer(2, 'H2O', true), // Correct answer
    new Answer(3, 'CO2', false),
    new Answer(4, 'N2', false)
]);

let q3 = new Question(3, 'Which planet is known as the Red Planet?', [
    new Answer(1, 'Earth', false),
    new Answer(2, 'Mars', true), // Correct answer
    new Answer(3, 'Jupiter', false),
    new Answer(4, 'Saturn', false)
]);

let q4 = new Question(4, 'Who wrote "To Kill a Mockingbird"?', [
    new Answer(1, 'Harper Lee', true), // Correct answer
    new Answer(2, 'J.K. Rowling', false),
    new Answer(3, 'George Orwell', false),
    new Answer(4, 'F. Scott Fitzgerald', false)
]);

let q5 = new Question(5, 'What is the speed of light?', [
    new Answer(1, '300,000 km/s', true), // Correct answer
    new Answer(2, '150,000 km/s', false),
    new Answer(3, '500,000 km/s', false),
    new Answer(4, '100,000 km/s', false)
]);

// Add all questions to the dataArray
dataArray.push(q1, q2, q3, q4, q5);

//---------- &&&&&&& --------------

// Function to display the array of submitted answers.
const showAnswers = () => {
    console.log(submitDataArray); // Log all submitted answers
}

// Function to verify the user's answer or handle skipped questions.
const verifyAnswer = (state) => {
    clearInterval(interval); // Stop the timer

    let selectedQuestion = dataArray[qNumber - 1]; // Get the current question

    if (state === 'skipped') {
        // If the question was skipped
        $('#txt-time').val('00:00'); // Reset timer
        submitDataArray.push(null); // Record skipped question

        // Highlight the correct answer in case of skip
        selectedQuestion.answers.forEach((ans) => {
            if (ans.correctState) {
                $('input[name=answer][value="' + ans.id + '"]').parent().addClass('correct-answer');
            }
        });

        showFeedbackMessage('Skipped!', 'info'); // Display skipped feedback
    } else {
        // If the user selected an answer
        let answer = $('input[name=answer]:checked').val(); // Get selected answer
        submitDataArray.push({ qNumber: qNumber, answer: answer }); // Store the answer

        // Highlight the correct and incorrect answers
        selectedQuestion.answers.forEach((ans) => {
            if (ans.correctState) {
                $('input[name=answer][value="' + ans.id + '"]').parent().addClass('correct-answer'); // Highlight correct
            } else if (ans.id == answer) {
                $('input[name=answer][value="' + ans.id + '"]').parent().addClass('incorrect-answer'); // Highlight incorrect
            }
        });

        // Increment score if the answer is correct
        if (selectedQuestion.answers.find(ans => ans.id == answer && ans.correctState)) {
            score++; // Increment score
            $('#txt-marks').val(score); // Update score display
            showFeedbackMessage('Correct! Super', 'success'); // Display success message
        } else {
            showFeedbackMessage('Incorrect! Try again', 'error'); // Display error message
        }
    }

    // Move to the next question or restart the quiz
    setTimeout(() => {
        if (qNumber == 5) {
            qNumber = 1; // Reset to the first question
            $('#txt-q-number').val('1/5'); // Reset question number display
            $('#txt-time').val('00:00'); // Reset timer
            $('#start-button').prop('disabled', false); // Enable start button
            $('#answer-list').empty(); // Clear answers
            $('#question').val(''); // Clear question text
            showAnswers(); // Display all submitted answers
        } else {
            qNumber++; // Move to the next question
            $('#txt-q-number').val(qNumber + '/5'); // Update question number display
            displayQuiz(); // Load the next question
        }
    }, 3000);
};

// Function to display feedback messages after each answer.
const showFeedbackMessage = (message, type) => {
    let messageBox = $('#feedback-message'); // Get the feedback message element

    // Display message based on the result type
    if (type === 'success') {
        messageBox.text(message).css('color', 'green'); // Success message in green
    } else if (type === 'error') {
        messageBox.text(message).css('color', 'red'); // Error message in red
    } else {
        messageBox.text(message).css('color', 'blue'); // Info message in blue
    }

    // Fade out message after 2 seconds
    messageBox.fadeIn().delay(2000).fadeOut();
};

// Function to display the quiz question and possible answers.
const displayQuiz = () => {
    sec = 0; // Reset timer

    let selectedQuestion = dataArray[qNumber - 1]; // Get the current question based on qNumber

    $('#question').val(selectedQuestion.question); // Display the question text
    $('#answer-list').empty(); // Clear previous answers

    // Create radio buttons for each answer option
    $.each(selectedQuestion.answers, function(index, recode) {
        let li = $('<li>').css('font-size', '18px'); // List item for each answer
        let rbtn = $('<input>').attr({
            name: 'answer', // Set radio button name
            type: 'radio', // Set type to radio
            value: recode.id, // Assign answer ID as value
        });
        let label = $('<label>').text(recode.answer); // Label for answer text

        li.append(rbtn); // Append radio button to list item
        li.append(label); // Append label to list item
        $('#answer-list').append(li); // Add list item to the answer list
    });

    // Start 30-second timer for the current question
    interval = setInterval(() => {
        if (sec < 10) {
            $('#txt-time').val('00:0' + sec); // Display seconds with leading zero for single digits
        } else {
            $('#txt-time').val('00:' + sec); // Display normal seconds format for double digits
        }
        sec++;

        // Automatically skip the question if time runs out
        if (sec == 30) {
            $('#txt-time').val('00:00'); // Reset timer
            verifyAnswer('skipped'); // Skip the question
        }
    }, 1000);
};

// Function to start the quiz and load the first question.
const start = () => {
    $('#start-button').prop('disabled', true); // Disable the start button during the quiz
    submitDataArray = []; // Reset submitted answers array
    score = 0; // Reset score
    $('#txt-marks').val(score); // Reset score display
    displayQuiz(); // Display the first question
};
