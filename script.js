'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Arun Kumar',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2023-06-21T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2023-06-22T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-06-24T23:36:17.929Z',
    '2023-06-26T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Amresh Maurya',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Ojas Saini',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-US',
};

const account4 = {
  owner: 'Manish Soni',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-06-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Display Movements Dates Function
const formatMovementDate = function (date, locale) {
  // number of days pasec between two dates
  const calcDaysPaseced = function (date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const daysPaseced = calcDaysPaseced(new Date(), date);

  if (daysPaseced === 0) return 'Today';
  if (daysPaseced === 1) return 'Yesterday';
  if (daysPaseced <= 7) return `${daysPaseced} days ago`;
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// function used to format currency
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display Movements Function
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // sort movements
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
    <div class ="movements__row">
    <div class ="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class ="movements__date">${displayDate}</div>
    <div class ="movements__value">${formattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display Balance function
const calDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);

  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

// Display Suminary function
const calcDisplaySuminary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(income, acc.locale, acc.currency);

  const outgoing = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(outgoing),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // interest only for greater than 1
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

// Create Username function
const createUserName = function (acc) {
  acc.forEach(acc => {
    acc.username = acc.owner // creating a new property username
      .toLowerCase()
      .split(' ')
      .map(val => val[0])
      .join('');
  });
};
createUserName(accounts);

// Update Ui
const updateUi = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display Balance
  calDisplayBalance(acc);

  // Display Suminary
  calcDisplaySuminary(acc);
};

// Implementing a countdown timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease the time to 1s
    time--;
  };
  // Set time to 5 minutes
  let time = 300; // 60*5 = 300sec
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Event handlers
// Adding Login Functionality => Event Handler
//////////// Login Button Event

let currentUser, timer;

btnLogin.addEventListener('click', e => {
  // Prevent form from submitting
  e.preventDefault();

  // verify username
  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);

  // verify pin
  if (currentUser && currentUser.pin === Number(inputLoginPin.value)) {
    // Display UI and mesecage
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Using INTL
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };

    const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentUser.locale,
      options
    ).format(now);

    // Using the general method
    // const now = new Date();
    // const date = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`; // day/month/year

    // clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // update ui
    updateUi(currentUser);
  }
});

// Transfer Money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  console.log(amount, recieverAcc);

  if (
    amount > 0 &&
    recieverAcc &&
    currentUser.balance >= amount &&
    recieverAcc?.username !== currentUser.username
  ) {
    console.log('Transfer Valid');

    // Doing The Transfer
    currentUser.movements.push(-amount);
    recieverAcc.movements.push(amount);

    // Add transfer date
    currentUser.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());

    // Updating Ui
    updateUi(currentUser);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Request Money
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add Positve movement to current user
      currentUser.movements.push(amount);

      // Add request loan date
      currentUser.movementsDates.push(new Date().toISOString());

      // Update ui
      updateUi(currentUser);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }

  inputLoanAmount.value = '';
});

// Close account
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    currentUser.username === inputCloseUsername.value &&
    currentUser.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentUser.username
    );

    // Delete account for that index
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputCloseUsername.value = '';
  labelWelcome.textContent = 'Log in to get started';
});

// sort button event
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentUser, !sorted);
  sorted = !sorted;
});
