// Initialize variables to track time, question number, interval for the timer, and submitted answers.
let sec = 0; // Timer seconds
let qNumber = 1; // Current question number
let interval = undefined; // Interval for the timer
let submitDataArray = []; // Array to store submitted answers

// Set the initial values for the timer and question number inputs
$('#txt-time').val('00:00'); // Set the timer to '00:00'
$('#txt-q-number').val('1/5'); // Set the initial question number display to '1/5'

//---------- Q & A --------------

// Answer class to represent a possible answer to a question.
class Answer {
    constructor(id, answer, correctState) {
        this.id = id; // Answer ID
        this.answer = answer; // Text of the answer
        this.correctState = correctState; // Boolean indicating if the answer is correct or not
    }
}

// Question class to represent a question and its possible answers.
class Question {
    constructor(id, question, answers) {
        this.id = id; // Question ID
        this.question = question; // Text of the question
        this.answers = answers; // Array of Answer objects representing possible answers
    }
}

// Initialize an array to store all the questions and answers.
let dataArray = [];

// Creating questions and their possible answers, then adding them to the array.
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

// Add the created questions to the dataArray.
dataArray.push(q1, q2, q3, q4, q5);

//---------- &&&&&&& --------------

// Function to display the array of submitted answers and calculate the result.
const showAnswers = () => {
    let marks = 0; // Initialize marks to 0
    for (let x = 0; x < submitDataArray.length; x++) {
        let selectedQuestion = dataArray[x]; // Get the selected question
        let selectedAnswer = submitDataArray[x]; // Get the submitted answer
        let da = selectedQuestion.answers.find(d => d.id == selectedAnswer?.answer); // Find the answer in the array

        if (da && da.correctState) { // If the selected answer is correct
            marks++; // Increment the score
        }
    }
    $('#txt-marks').val('Result:' + marks + ' /5'); // Display the result
}

// Function to verify the selected answer or mark the question as skipped if no answer is provided.
const verifyAnswer = (state) => {
    clearInterval(interval); // Stop the timer

    if (state === 'skipped') {
        // If the user skips the question, push null as the answer.
        $('#txt-time').val('00:00'); // Reset timer
        submitDataArray.push(null);
    } else {
        // Retrieve the selected answer value from the radio button input.
        let answer = $('input[name=answer]:checked').val();
        // Store the question number and selected answer in the submitDataArray.
        submitDataArray.push({
            qNumber: qNumber,
            answer: answer
        });
    }

    // Check if this is the last question.
    if (qNumber === 5) {
        // Reset for a new game and display the results.
        qNumber = 1; // Reset question number
        $('#txt-q-number').val('1/5'); // Reset question display
        $('#txt-time').val('00:00'); // Reset time
        $('#start-button').prop('disabled', false); // Enable start button
        $('#answer-list').empty(); // Clear answer list
        $('#question').val(''); // Clear question

        showAnswers(); // Show all answers
        return;
    }

    // Move to the next question.
    qNumber++; // Increment question number
    $('#txt-q-number').val(qNumber + '/5'); // Update question number display
    displayQuiz(); // Load the next question
}

// Function to display the current question and its possible answers.
const displayQuiz = () => {
    sec = 0; // Reset the timer

    let selectedQuestion = dataArray[qNumber - 1]; // Get the current question based on qNumber

    $('#question').val(selectedQuestion.question); // Display the question text
    $('#answer-list').empty(); // Clear the previous answers

    // Loop through each answer and create radio buttons for selection.
    $.each(selectedQuestion.answers, function(index, recode) {
        let li = $('<li>').css('font-size', '18px'); // Create a list item for each answer
        let rbtn = $('<input>').attr({
            name: 'answer', // Radio button name
            type: 'radio', // Input type
            value: recode.id, // Value set to the answer id
        });
        let label = $('<label>').text(recode.answer); // Create a label for the answer text

        li.append(rbtn); // Append radio button to the list item
        li.append(label); // Append the label
        $('#answer-list').append(li); // Append the list item to the answer list
    });

    // Start the timer for 30 seconds.
    interval = setInterval(() => {
        if (sec < 10) {
            $('#txt-time').val('00:0' + sec); // Display single-digit seconds with a leading zero
        } else {
            $('#txt-time').val('00:' + sec); // Display double-digit seconds
        }
        sec++;

        if (sec === 30) {
            $('#txt-time').val('00:00'); // Reset the timer
            verifyAnswer('skipped'); // Automatically skip the question if time runs out
        }
    }, 1000);
}

// Function to start the quiz and initialize the first question.
const start = () => {
    $('#start-button').prop('disabled', true); // Disable the start button to prevent restarting mid-game
    submitDataArray = []; // Reset the submitted answers array
    displayQuiz(); // Display the first question
}
