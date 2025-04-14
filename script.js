let questions = []
let currQuestionIndex = 0
let score = 0


function decodeHTML(html) {
    const txt = document.createElement("textarea")
    txt.innerHTML = html
    return txt.value
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

function showNextQuestion() {
    if (currQuestionIndex >= questions.length) {
        $(".question").empty()
        $(".result").text(`Your score: ${score} out of ${questions.length}`).fadeIn()
        $(".play-again").fadeIn()
        return
    }

    const currQuestion = questions[currQuestionIndex]
    const allAnswers = shuffleArray([currQuestion.correct_answer, ...currQuestion.incorrect_answers])
    const questionNumber = currQuestionIndex + 1
    const totalQuestions = questions.length
    const html = `
        <p><strong>Question: ${questionNumber}/${totalQuestions}</strong></p>
        <p><strong>Category:</strong> ${decodeHTML(currQuestion.category)}</p>
        <p><strong>Difficulty:</strong> ${decodeHTML(currQuestion.difficulty)}</p>
        <div style="display: block">
        <p>${decodeHTML(currQuestion.question)}</p>
            ${allAnswers.map(ans => `
                <button class="answer" data-answer="${decodeHTML(ans)}">${decodeHTML(ans)}</button>
            `).join("")}
        </div>
    `
    $(".question").html(html)

}

function fetchQuestions() {
    $(".result").hide()
    $(".play-again").hide()
    $(".question").html("<p>Loading questions...</p>")

    const amount = $("#amount").val()
    const category = $("#category").val()
    const difficulty = $("#difficulty").val()

    let apiUrl = `https://opentdb.com/api.php?amount=${amount}`
    if (category) apiUrl += `&category=${category}`
    if (difficulty) apiUrl += `&difficulty=${difficulty}`

    $.get(apiUrl, function(data) {
        questions = data.results
        currQuestionIndex = 0
        score = 0
        showNextQuestion()
    })
}

function loadCategories() {
    $.get("https://opentdb.com/api_category.php", function(data) {
        const categories = data.trivia_categories
        categories.forEach(cat => {
            $("#category").append(`<option value="${cat.id}">${cat.name}</option>`)
        })
    })
}

$(document).ready(function() {
    loadCategories()

    $("#start").click(function() {
        fetchQuestions()
    })

    $(".question").on("click", ".answer", function () {
        const selected = $(this).data("answer")
        const correct = decodeHTML(questions[currQuestionIndex].correct_answer)
        if (selected === correct) {
            score++
        }
        currQuestionIndex++
        showNextQuestion()
    })

    $(".play-again").click(function() {
        $(".quiz-settings").show()
        $(".result").hide()
        $(".play-again").hide()
        $(".question").empty()
    })
})