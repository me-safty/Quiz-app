type qust = {
  q: string;
  ans: {
    f1: string;
    f2: string;
    f3: string;
    t: string;
  };
  exp: string;
};

const nameInput = document.querySelector(
  "input[type='text']"
) as HTMLInputElement;
const emailInput = document.querySelector(
  "input[type='email']"
) as HTMLInputElement;
const htmlCheck = document.getElementById("HTML") as HTMLInputElement;
const cssCheck = document.getElementById("CSS") as HTMLInputElement;
const submit = document.querySelector(".info-box button") as HTMLButtonElement;

const info = document.querySelector(".info-box") as HTMLDivElement;
const quzi = document.querySelector(".quzi-box") as HTMLDivElement;

const quziHeader = document.querySelector(
  ".quzi-box .header"
) as HTMLDivElement;
const quziTypeP = document.querySelector(
  ".quzi-box .header h1 span"
) as HTMLSpanElement;
const timeP = document.querySelector(
  ".quzi-box .header .count p:nth-of-type(2)"
) as HTMLParagraphElement;
const timeLine = document.querySelector(
  ".quzi-box .header .line"
) as HTMLDivElement;

const qustNum = document.querySelector(
  ".quzi-box .qust h1 span:nth-of-type(1)"
) as HTMLSpanElement;
const qustTitle = document.querySelector(
  ".quzi-box .qust h1 span:nth-of-type(2)"
) as HTMLSpanElement;

const answers = document.querySelectorAll(
  ".quzi-box .qust .ans p"
) as NodeListOf<HTMLParagraphElement>;
const discus = document.querySelector(".quzi-box .dis") as HTMLParagraphElement;

const curentNumOfQustion = document.querySelector(
  ".quzi-box .foot span:nth-of-type(1)"
) as HTMLSpanElement;
const numOfQustions = document.querySelector(
  ".quzi-box .foot span:nth-of-type(2)"
) as HTMLSpanElement;
const nextBtn = document.querySelector(
  ".quzi-box .foot button"
) as HTMLButtonElement;

let quziType: string;
let time: number = 30;
let wrongAnswers: number = 0;
let qIndex = 0;
let countDwon: number;
let datas: qust[];

submit.addEventListener("click", () => {
  if (nameInput.value != "" && emailInput.value != "") {
    if (htmlCheck.checked && cssCheck.checked) {
      console.log("sellect one type");
    } else {
      if (htmlCheck.checked || cssCheck.checked) {
        info.classList.add("hid");
        quzi.classList.add("active");
        htmlCheck.checked ? (quziType = "html") : (quziType = "css");
        getData(quziType);
      } else {
        console.log("plz check one type");
      }
    }
  } else {
    console.log("name and email not found");
  }
});

async function getData(quziType: string): Promise<void> {
  const res = await fetch(`../qustions/${quziType}.json`);
  const data = await res.json();
  setQ(data);
  datas = data;
}

function setQ(data: qust[]) {
  quziTypeP.innerHTML = `${quziType}`;

  let qustion: qust = data[qIndex];
  qustTitle.innerHTML = `${qustion.q}`;
  qustNum.innerHTML = `${qIndex + 1}`;

  let arr: string[] = [
    qustion.ans.f1,
    qustion.ans.f2,
    qustion.ans.f3,
    qustion.ans.t,
  ];
  for (let i = 0; i < 4; i++) {
    const random: number = Math.floor(Math.random() * arr.length);
    answers[i].innerHTML = `${arr[random]}`;
    let index = arr.indexOf(arr[random]);
    arr.splice(index, 1);
  }

  setNumOfQustions(data.length);

  setTimer(qustion);

  checkAnswers(answers, qustion);
}

function setNumOfQustions(qustionsLength: number): void {
  curentNumOfQustion.innerHTML = `${qIndex + 1}`;
  numOfQustions.innerHTML = `${qustionsLength}`;
}

function checkAnswers(
  answers: NodeListOf<HTMLParagraphElement>,
  qustion: qust
) {
  answers.forEach((e) => {
    e.addEventListener("click", () => {
      openNextBtn();
      if (e.innerHTML == qustion.ans.t) {
        clearInterval(countDwon);
        trueOrFalse(e, "true", "fa-check");
        showDisction(qustion.exp);
        answers.forEach((e) => (e.style.pointerEvents = "none"));
      } else {
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

function trueOrFalse(
  btn: HTMLParagraphElement,
  state: string,
  i: string
): void {
  btn.parentElement?.classList.add(state);
  const icon = document.createElement("i");
  icon.classList.add("fa-solid",i, state);
  btn.parentElement?.appendChild(icon)
}

function openNextBtn(): void {
  nextBtn.style.pointerEvents = "auto";
  nextBtn.style.opacity = "1";
}

function showDisction(exp: string): void {
  discus.innerHTML = `${exp}`;
  discus.style.display = "block";
}

function setTimer(qustion: qust): void {
  countDwon = setInterval(() => {
    time--;
    timeLine.style.width = `${(time / 30) * 100}%`;
    if (time < 10) {
      timeP.innerHTML = `0${time}`;
    } else {
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

function reset(): void {
  answers.forEach((e) => {
    e.style.pointerEvents = "auto";
    e.parentElement?.classList.remove("false", "true");
  });
  const icons = document.querySelectorAll("i")
  icons.forEach(e => e.remove())
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



// function chackIfSame(ans2: string, ans: string): boolean {
//   let arr: string[] = ans.split("");
//   if (arr.includes("&") && arr.includes("#") && arr.includes(";")) {
//     let newArr = arr
//       .filter(
//         (e) =>
//           e != "&" && e != "#" && e != "6" && e != "0" && e != ";" && e != "2"
//       )
//       .join("");
//       console.log(newArr);
      
//       let arr2: string[] = ans2.split("");
//       let newArr2 = arr2.filter((e) => e != ">" && e != "<").join("");
//       let result: boolean = newArr == newArr2;
//       console.log(newArr2);
//     return result;
//   } else {
//     let result = ans == ans2
//     return result;
//   }
// }
