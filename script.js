const API_URL = "https://chatcopa.onrender.com/chat";

const messages = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

let conversation = [];


/* =========================
   ENVIAR MENSAGEM
========================= */

async function sendMessage() {

    const message = input.value.trim();

    if (!message) {
        return;
    }

    addMessage(message, "user");

    input.value = "";

    input.style.height = "auto";

    setLoading(true);

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message,
                history: conversation
            })

        });


        if (!response.ok) {
            throw new Error("Erro na comunicação com o servidor.");
        }


        const data = await response.json();


        if (data.response) {

            addMessage(data.response, "bot");

            conversation.push({
                role: "user",
                content: message
            });

            conversation.push({
                role: "assistant",
                content: data.response
            });

        } else {

            addMessage(
                "Não consegui responder agora. Tente novamente.",
                "bot"
            );

        }

    } catch (error) {

        console.error(error);

        addMessage(
            "Não consegui me conectar ao CopaBot. Verifique se o backend está funcionando.",
            "bot"
        );

    } finally {

        setLoading(false);

    }
}


/* =========================
   SUGESTÕES
========================= */

function sendSuggestion(text) {

    input.value = text;

    sendMessage();

}


/* =========================
   ADICIONAR MENSAGEM
========================= */

function addMessage(text, type) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add(
        "message",
        type === "user"
            ? "user-message"
            : "bot-message"
    );


    const avatar = document.createElement("div");

    avatar.classList.add("avatar");

    avatar.textContent =
        type === "user"
            ? "👤"
            : "⚽";


    const bubble = document.createElement("div");

    bubble.classList.add("bubble");


    const name = document.createElement("strong");

    name.textContent =
        type === "user"
            ? "Você"
            : "CopaBot";


    const paragraph = document.createElement("p");

    paragraph.textContent = text;


    bubble.appendChild(name);

    bubble.appendChild(paragraph);

    messageDiv.appendChild(avatar);

    messageDiv.appendChild(bubble);

    messages.appendChild(messageDiv);


    scrollToBottom();
}


/* =========================
   LOADING
========================= */

function setLoading(loading) {

    sendButton.disabled = loading;

    input.disabled = loading;


    const oldTyping = document.getElementById("typing");

    if (oldTyping) {
        oldTyping.remove();
    }


    if (!loading) {
        return;
    }


    const messageDiv = document.createElement("div");

    messageDiv.id = "typing";

    messageDiv.classList.add(
        "message",
        "bot-message"
    );


    const avatar = document.createElement("div");

    avatar.classList.add("avatar");

    avatar.textContent = "⚽";


    const bubble = document.createElement("div");

    bubble.classList.add("bubble");


    const typing = document.createElement("div");

    typing.classList.add("typing");


    for (let i = 0; i < 3; i++) {

        const dot = document.createElement("span");

        typing.appendChild(dot);

    }


    bubble.appendChild(typing);

    messageDiv.appendChild(avatar);

    messageDiv.appendChild(bubble);

    messages.appendChild(messageDiv);


    scrollToBottom();
}


/* =========================
   ENTER
========================= */

function handleKey(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();

    }

}


/* =========================
   AUTO RESIZE
========================= */

input.addEventListener("input", () => {

    input.style.height = "auto";

    input.style.height =
        Math.min(input.scrollHeight, 100) + "px";

});


/* =========================
   SCROLL
========================= */

function scrollToBottom() {

    const chat = document.querySelector(".chat-container");

    chat.scrollTop = chat.scrollHeight;

}