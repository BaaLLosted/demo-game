const gameData = {
    victims: {
        elderly: {
            name: "Пожилой человек",
            defense: "Не сообщайте коды из SMS, не переходите по подозрительным ссылкам и проверяйте информацию через официальный канал."
        },

        teen: {
            name: "Подросток",
            defense: "Бесплатные призы и обещания валюты часто используются для кражи аккаунтов."
        },

        accountant: {
            name: "Бухгалтер",
            defense: "Проверяйте отправителей и расширения файлов. Не открывайте неожиданные вложения."
        }
    },


    components: {

        triggers: [
            { id: "fear", text: "Страх" },
            { id: "greed", text: "Жадность" },
            { id: "curiosity", text: "Любопытство" }
        ],


        styles: [
            { id: "formal", text: "Официальный" },
            { id: "casual", text: "Дружелюбный" },
            { id: "urgent", text: "Настойчивый" }
        ],


        actions: [
            { id: "link", text: "Ссылка" },
            { id: "data", text: "Запрос данных" },
            { id: "zip", text: "ZIP-архив" }
        ]
    },


    // Таблица эффективности комбинаций
    compatibility: {

        elderly: {

            trigger: {
                fear: 20,
                curiosity: 5,
                greed: -20
            },

            style: {
                formal: 15,
                casual: 5,
                urgent: -15
            },

            action: {
                link: 20,
                data: 5,
                zip: -40
            }
        },


        teen: {

            trigger: {
                curiosity: 20,
                greed: 10,
                fear: -20
            },

            style: {
                casual: 15,
                formal: -15,
                urgent: 0
            },

            action: {
                link: 20,
                data: 10,
                zip: -40
            }
        },


        accountant: {

            trigger: {
                fear: 20,
                curiosity: 0,
                greed: -20
            },

            style: {
                formal: 15,
                casual: -15,
                urgent: -20
            },

            action: {
                link: 15,
                data: 0,
                zip: -80
            }
        }
    },

        replies: {

        elderly: {
            fear: "Что случилось? Почему вы звоните?",
            curiosity: "Какие фотографии?",
            greed: "Какой приз?"
        },

        teen: {
            curiosity: "Что там?",
            greed: "А что я получу?",
            fear: "Какая проблема?"
        },

        accountant: {
            fear: "Уточните проблему.",
            curiosity: "Что за информация?",
            greed: "Почему это выгодно?"
        }
    },


    styleReplies: {

        elderly: {
            formal: "Хорошо. Что мне нужно сделать?",
            casual: "Ладно, расскажите подробнее.",
            urgent: "Почему так срочно?"
        },


        teen: {
            casual: "Ну, допустим.",
            formal: "Говорите.",
            urgent: "Почему вы давите?"
        },


        accountant: {
            formal: "Продолжайте.",
            casual: "Это выглядит странно.",
            urgent: "Мне нужно проверить информацию."
        }
    }
};


// Состояние игры

let state = {

    victim: null,

    trigger: null,

    style: null,

    action: null,

    startTime: null,

    endTime: null,

    totalTime: 0

};


const content = document.getElementById("content");


// Старт игры

function start() {

    state.startTime = Date.now();

    content.innerHTML =
        "<div class='system-msg'>ВЫБЕРИТЕ ОБЪЕКТ:</div>";


    Object.entries(gameData.victims).forEach(([id, victim]) => {


        const btn = document.createElement("button");


        btn.innerText = "> " + victim.name;


        btn.onclick = () => {

            state.victim = id;

            renderTrigger();

        };


        content.appendChild(btn);

    });

}



// Универсальный вывод кнопок

function buttonList(items, callback) {


    items.forEach(item => {


        const btn = document.createElement("button");


        btn.innerText = item.text;


        btn.onclick = () => callback(item.id);


        content.appendChild(btn);

    });

}



// Этап 1.
// Первый контакт: выбор психологического приема

function renderTrigger() {


    content.innerHTML =

    `<div class="system-msg">
        ПЕРВЫЙ КОНТАКТ: ВЫБЕРИТЕ ПРИЕМ
    </div>`;


    buttonList(
        gameData.components.triggers,
        chooseTrigger
    );

}



// Игрок выбрал триггер

function chooseTrigger(id) {


    state.trigger = id;


    content.innerHTML =

    `
    <div class="chat-msg victim-msg">
        ОБЪЕКТ:
        ${gameData.replies[state.victim][id]}
    </div>


    <div class="system-msg">
        ТЕПЕРЬ ВЫБЕРИТЕ СТИЛЬ ОБЩЕНИЯ
    </div>
    `;


    buttonList(
        gameData.components.styles,
        chooseStyle
    );

}



// Этап 2.
// Выбор стиля

function chooseStyle(id) {


    state.style = id;


    content.innerHTML =


    `
    <div class="chat-msg victim-msg">

        ОБЪЕКТ:
        ${gameData.styleReplies[state.victim][id]}

    </div>


    <div class="system-msg">

        ВЫБЕРИТЕ ИНСТРУМЕНТ

    </div>
    `;


    buttonList(
        gameData.components.actions,
        chooseAction
    );

}

// Этап 3.
// Выбор инструмента

function chooseAction(id) {


    state.action = id;

    state.endTime = Date.now();

    state.totalTime =
        Math.floor(
            (state.endTime - state.startTime) / 1000
        );

    showFinalResult();

}

function getTimeBonus(){

    let seconds = state.totalTime;

    if(seconds < 10){

        return 10;

    }

    if(seconds > 60){

        return -15;

    }

    return 0;

}

// Расчёт результата

function calculateScore() {


    const table = gameData.compatibility[state.victim];


    let score = 50;


    score += table.trigger[state.trigger];

    score += table.style[state.style];

    score += table.action[state.action];
    
    score += getTimeBonus();


    // ограничение от 0 до 100

    return Math.max(
        0,
        Math.min(
            100,
            score
        )
    );

}



// Финальный результат

function showFinalResult() {


    const finalScore = calculateScore();


    const success = finalScore >= 60;



    content.innerHTML =

    `
    <div class="system-msg">

        АНАЛИЗ ОПЕРАЦИИ ЗАВЕРШЕН

    </div>


    <div class="result-box">


        <h3>

            ${success ? "УСПЕХ" : "ПРОВАЛ"}

            (${finalScore}%)

        </h3>



        <p>

            ${
                success

                ?

                "Выбранная комбинация оказалась убедительной."

                :

                "Объект заметил несоответствия и заподозрил манипуляцию."

            }

        </p>



        <div class="analysis">


            <b>
                АНАЛИЗ ВЫБОРА:
            </b>


            <br><br>


            Жертва:

            ${gameData.victims[state.victim].name}



            <br>


            Триггер:

            ${state.trigger}

            (${gameData.compatibility[state.victim].trigger[state.trigger] >= 0 ? "+" : ""}

            ${gameData.compatibility[state.victim].trigger[state.trigger]})



            <br>


            Стиль:

            ${state.style}

            (${gameData.compatibility[state.victim].style[state.style] >= 0 ? "+" : ""}

            ${gameData.compatibility[state.victim].style[state.style]})



            <br>


            Инструмент:

            ${state.action}

            (${gameData.compatibility[state.victim].action[state.action] >= 0 ? "+" : ""}

            ${gameData.compatibility[state.victim].action[state.action]})



        </div>




        <div class="defense">


            <b>
                🛡️ ЗАЩИТА:
            </b>


            <br>


            ${gameData.victims[state.victim].defense}



        </div>



        <button onclick="location.reload()">

            ПЕРЕЗАПУСК

        </button>


    </div>

    `;

}



// Запуск

start();
