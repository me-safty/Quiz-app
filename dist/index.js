"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const nameInput = document.querySelector("input[type='text']");
const emailInput = document.querySelector("input[type='email']");
const htmlCheck = document.getElementById("HTML");
const cssCheck = document.getElementById("CSS");
const submit = document.querySelector(".info-box button");
const info = document.querySelector(".info-box");
const quzi = document.querySelector(".quzi-box");
const quziHeader = document.querySelector(".quzi-box .header");
const quziTypeP = document.querySelector(".quzi-box .header h1 span");
const timeP = document.querySelector(".quzi-box .header .count p:nth-of-type(2)");
const timeLine = document.querySelector(".quzi-box .header .line");
const qustNum = document.querySelector(".quzi-box .qust h1 span:nth-of-type(1)");
const qustTitle = document.querySelector(".quzi-box .qust h1 span:nth-of-type(2)");
const answers = document.querySelectorAll(".quzi-box .qust .ans p");
const discus = document.querySelector(".quzi-box .dis");
const curentNumOfQustion = document.querySelector(".quzi-box .foot span:nth-of-type(1)");
const numOfQustions = document.querySelector(".quzi-box .foot span:nth-of-type(2)");
const nextBtn = document.querySelector(".quzi-box .foot button");
let quziType;
let time = 30;
let wrongAnswers = 0;
let qIndex = 0;
let countDwon;
let datas;
submit.addEventListener("click", () => {
    if (nameInput.value != "" && emailInput.value != "") {
        if (htmlCheck.checked && cssCheck.checked) {
            console.log("sellect one type");
        }
        else {
            if (htmlCheck.checked || cssCheck.checked) {
                info.classList.add("hid");
                quzi.classList.add("active");
                htmlCheck.checked ? (quziType = "html") : (quziType = "css");
                getData(quziType);
            }
            else {
                console.log("plz check one type");
            }
        }
    }
    else {
        console.log("name and email not found");
    }
});
function getData(quziType) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`../qustions/${quziType}.json`);
        const data = yield res.json();
        setQ(data);
        datas = data;
    });
}
function setQ(data) {
    quziTypeP.innerHTML = `${quziType}`;
    let qustion = data[qIndex];
    qustTitle.innerHTML = `${qustion.q}`;
    qustNum.innerHTML = `${qIndex + 1}`;
    let arr = [
        qustion.ans.f1,
        qustion.ans.f2,
        qustion.ans.f3,
        qustion.ans.t,
    ];
    for (let i = 0; i < 4; i++) {
        const random = Math.floor(Math.random() * arr.length);
        answers[i].innerHTML = `${arr[random]}`;
        let index = arr.indexOf(arr[random]);
        arr.splice(index, 1);
    }
    setNumOfQustions(data.length);
    setTimer(qustion);
    checkAnswers(answers, qustion);
}
function setNumOfQustions(qustionsLength) {
    curentNumOfQustion.innerHTML = `${qIndex + 1}`;
    numOfQustions.innerHTML = `${qustionsLength}`;
}
function checkAnswers(answers, qustion) {
    answers.forEach((e) => {
        e.addEventListener("click", () => {
            openNextBtn();
            if (e.innerHTML == qustion.ans.t) {
                clearInterval(countDwon);
                trueOrFalse(e, "true", "fa-check");
                showDisction(qustion.exp);
                answers.forEach((e) => (e.style.pointerEvents = "none"));
            }
            else {
                clearInterval(countDwon);
                wrongAnswers++;
                trueOrFalse(e, "false", "fa-xmark");
                answers.forEach((e) => {
                    e.style.pointerEvents = "none";
                    if (e.innerHTML == qustion.ans.t) {
                        trueOrFalse(e, "true", "fa-check");
                    }
                });
                showDisction(qustion.exp);
            }
        });
    });
}
function trueOrFalse(btn, state, i) {
    var _a, _b;
    (_a = btn.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add(state);
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", i, state);
    (_b = btn.parentElement) === null || _b === void 0 ? void 0 : _b.appendChild(icon);
}
function openNextBtn() {
    nextBtn.style.pointerEvents = "auto";
    nextBtn.style.opacity = "1";
}
function showDisction(exp) {
    discus.innerHTML = `${exp}`;
    discus.style.display = "block";
}
function setTimer(qustion) {
    countDwon = setInterval(() => {
        time--;
        timeLine.style.width = `${(time / 30) * 100}%`;
        if (time < 10) {
            timeP.innerHTML = `0${time}`;
        }
        else {
            timeP.innerHTML = `${time}`;
        }
        if (time <= 0) {
            wrongAnswers++;
            clearInterval(countDwon);
            openNextBtn();
            answers.forEach((e) => (e.style.pointerEvents = "none"));
            showDisction(qustion.exp);
            answers.forEach((e) => {
                if (e.innerHTML == qustion.ans.t) {
                    trueOrFalse(e, "true", "fa-check");
                }
            });
        }
    }, 1000);
}
function reset() {
    answers.forEach((e) => {
        var _a;
        e.style.pointerEvents = "auto";
        (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove("false", "true");
    });
    const icons = document.querySelectorAll("i");
    icons.forEach(e => e.remove());
    discus.style.display = "none";
    clearInterval(countDwon);
    time = 30;
    timeP.innerHTML = `${time}`;
    timeLine.style.width = "100%";
}
nextBtn.addEventListener("click", () => {
    if (qIndex < +numOfQustions.innerHTML) {
        reset();
        qIndex++;
        setQ(datas);
    }
});