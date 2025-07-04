"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2025-06-27T23:36:17.929Z",
    "2025-06-29T10:51:36.790Z",
  ],
  currency: 'EUR',
  locale: 'pt-PT'
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  locale:"en-IN",
  currency: 'EUR',
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  locale:"en-US",
  currency:"USD"
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
  ],
  locale:"en-UK",
   currency:"USD"
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
let currentaccount;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let timer;
const logOutTimer=function()
{
  let time=120;
  const countDown=function(){
    let min=String(Math.trunc(time/60)).padStart(2,'0')
    let sec=String(Math.trunc(time%60)).padStart(2,'0');
    labelTimer.textContent=`${min}:${sec}`
    if(time==0)
    {
      clearInterval(timer)
      containerApp.style.opacity=0;
      labelWelcome.textContent="Log in to get started"
    }
    time--;
  }
  countDown();
  const timer=setInterval(countDown,1000);
  return timer;
}
const differenceDate = (a, b) => Math.trunc(Math.abs(a - b) / (1000 * 60 * 60 * 24));


const formatDate=function(date,locale)
  {
    const currdate = new Date(date);
    const status = differenceDate(new Date(), currdate);
    if(status==0)
    return "Today"
    else if(status==1)
    return "Yesterday"
    else if(status<=7)
    return `${status} days ago`
    
    
    // const day = `${currdate.getDate()}`.padStart(2, "0");
    // const month = `${currdate.getMonth() + 1}`.padStart(2, "0");
    // const year = `${currdate.getFullYear()}`.padStart(2, "0");
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(currdate)
  }
const displayMovements = function (arr, sortvar = false) {
  containerMovements.innerHTML = "";
  console.log(arr);
  const combined = arr.movements.map((data, i) => ({
    movements: data,
    movementsDate: arr.movementsDates[i],
  }));
  
  // console.log(combined)
  // const update_arr=sortvar?arr.movements.slice().sort((a,b)=>a-b):arr.movements.slice().sort((a,b)=>b-a);
  if (sortvar) combined.sort((a, b) => a.movements - b.movements);
  combined.forEach(function ({ movements: data, movementsDate }, idx) {
    const displaydate=formatDate(movementsDate,arr.locale);
    const type = data >= 0 ? "deposit" : "withdrawal";
    const res = `
            <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      idx + 1
    } ${type.toUpperCase()}</div>
            <div class="movements__date">${displaydate}</div>
            <div class="movements__value">${new Intl.NumberFormat(currentaccount.locale,{style:"currency",currency:currentaccount.currency}).format(data)}</div>
            </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", res);
  });
};
const calcDisplayBalance = function (currentaccount) {
  currentaccount.balance = currentaccount.movements.reduce(function (
    acc,
    curr
  ) {
    return acc + curr;
  },
  0);
  labelBalance.textContent = new Intl.NumberFormat(currentaccount.locale,{style:"currency",currency:currentaccount.currency}).format(currentaccount.balance);
};

const createUsernames = function (accounts) {
  accounts.forEach((acc) => {
    acc.username = acc.owner
      .split(" ")
      .map((val) => val[0].toLowerCase())
      .join("");
  });
};

createUsernames(accounts);
const deposits = movements.filter(function (data) {
  return data > 0;
});
const calcDisplaySummary = function (currentaccount) {
  const incomes = currentaccount.movements
    .filter((data) => data > 0)
    .reduce((acc, curr) => curr + acc, 0);
  const withdraw =
    currentaccount.movements
      .filter((data) => data < 0)
      .reduce((acc, curr) => curr + acc, 0) * -1;
  const interest = currentaccount.movements
    .filter((data) => data > 0)
    .reduce((acc, curr) => {
      if ((currentaccount.interestRate * curr) / 100 >= 1)
        return acc + (currentaccount.interestRate * curr) / 100;
      return acc;
    }, 0);
  labelSumIn.textContent = new Intl.NumberFormat(currentaccount.locale,{style:"currency",currency:currentaccount.currency}).format(incomes);;
  labelSumOut.textContent = new Intl.NumberFormat(currentaccount.locale,{style:"currency",currency:currentaccount.currency}).format(withdraw)
  labelSumInterest.textContent = new Intl.NumberFormat(currentaccount.locale,{style:"currency",currency:currentaccount.currency}).format(interest);
};

const refreshAccount = function () {
  calcDisplayBalance(currentaccount);
  calcDisplaySummary(currentaccount);
  displayMovements(currentaccount);
};

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentaccount = accounts.find(
    (data) => data.username === inputLoginUsername.value
  );
  if (currentaccount?.pin === Number(inputLoginPin.value)) {
    console.log("login");
    if(timer)clearInterval(timer)
    timer=logOutTimer();
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome ${currentaccount.owner.split(" ")[0]}`;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    const currdate = new Date();
    const locale=navigator.language
    const options={
      hour:'numeric',
      minute:'numeric',
      day:'numeric',
      month:'numeric',
      year:'numeric',
      // weekday:'long'
    }
    // const day = `${currdate.getDate()}`.padStart(2, "0");
    // const month = `${currdate.getMonth() + 1}`.padStart(2, "0");
    // const year = currdate.getFullYear();
    // const hour = currdate.getHours();
    // const minutes = currdate.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;
    labelDate.textContent=new Intl.DateTimeFormat(currentaccount.locale,options).format(currdate)
    refreshAccount();
    refreshAccount(currentaccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const username = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();
  const transferAccount = accounts.find((data) => data.username === username);
  if (
    amount > 0 &&
    amount < currentaccount.balance &&
    transferAccount &&
    transferAccount.username !== currentaccount.username
  ) {
    clearInterval(timer)
      timer=logOutTimer();
    currentaccount.movements.push(-amount);
    transferAccount.movements.push(amount);
    currentaccount.movementsDates.push(new Date().toISOString());
    transferAccount.movementsDates.push(new Date().toISOString());
    refreshAccount(currentaccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  inputLoanAmount.value=''
  inputLoanAmount.blur()
  if (
    amount > 0 &&
    currentaccount.movements.some((data) => data >= 0.1 * amount)
  ) {
   
    setTimeout(()=>{
      currentaccount.movements.push(amount);
      console.log(new Date().toISOString());
      currentaccount.movementsDates.push(new Date().toISOString());
      refreshAccount();
      clearInterval(timer)
      timer=logOutTimer();
    },3000)

  }
});
let sorted = 0;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentaccount, !sorted);
  sorted = !sorted;
});

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  clearInterval(timer)
      timer=logOutTimer();
  const name=inputCloseUsername.value
  const pin=inputClosePin.value
  const res=accounts.findIndex((data)=>data.username===name)
  if(res!=-1 && accounts[res].pin==pin)
  {
    accounts.splice(res,1);
  }
  console.log(accounts)
})