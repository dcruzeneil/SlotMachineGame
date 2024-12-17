/* Package Imports */
const prompt = require("prompt-sync")();

/* Global Variables */
const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = {
    $: 1, 
    B: 2,
    8: 3,
    A: 4,
};
const SYMBOLS_VALUES = {
    $: 4, 
    B: 3,
    8: 2,
    A: 1,
};

/* Function Definitions */
// Step 1: User Deposits some Money
const depositMoney = () => {
    while(true){
        const userDeposit = prompt("Enter Number of Coins to Deposit: ");
        const numberUserDeposit = parseFloat(userDeposit);
        // Checking Validity of User Input
        if(isNaN(numberUserDeposit) || numberUserDeposit <= 0){
            console.log("Invalid Deposit Amount, Try Again!");
        } else{
            return numberUserDeposit;
        }
    }
};

// Step 2: User Determines how Many Lines to bet on
const determineNumberOfLines = () => {
    while(true){
        const lines = prompt("Number of Lines you Want to Bet On (1-3): ");
        const numberLines = parseInt(lines);
        if(isNaN(numberLines) || numberLines <= 0 || numberLines > 3){
            console.log("Invalid Input, the Number of Lines must be between 1 and 3 (inclusive)!");
        } else{
            return numberLines;
        }
    }
};

// Step 3: User Determines a Bet Amount
const userBetAmount = (balance, lines) => {
    while(true){
        const bet = prompt("How Much Bet per Line (if you bet 15 coins, and have selected 2 lines that is a total of 30 coins): ");
        const numberBet = parseInt(bet);
        if(isNaN(numberBet) || numberBet <= 0 || numberBet > (balance / lines)){
            console.log("Invalid Amount, Try Again!");
        } else{
            return numberBet;
        }
    }
};

// Step 4: Spinning the Slot Machine
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for (let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    // List Within Represents Column
    const reels = [];
    for (let i = 0; i < COLS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const randomSymbol = reelSymbols[randomIndex];
            reels[i].push(randomSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const print_reels = (reels) => {
    for (let row = 0; row < ROWS; row++){
        temp = "";
        for(let col = 0; col < COLS; col++){
            temp += reels[col][row];
            if(col != COLS - 1){
                temp += " | "
            }
        }
        console.log(temp);
    }
};

const userWinnings = (bet, lines, reels) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++){
        let isValid = true;
        const symbol = reels[0][row];
        for(let col = 0; col < COLS; col++){
           if(reels[col][row] != reels[0][row]){   
            isValid = false;
            break;
           }
        }
        if(isValid == true){
            winnings += bet * SYMBOLS_VALUES[symbol];
        }
    }
    return winnings;
};

const game = () => {
    let userBalance = depositMoney();
    while(true){
        const numberLines = determineNumberOfLines();
        const numberBet = userBetAmount(userBalance, numberLines);
        userBalance = userBalance - (numberBet * numberLines);
        console.log("Your remaining balance now is: $" + userBalance + "\n");
        const reels = spin();
        print_reels(reels);
        const winning = userWinnings(numberBet, numberLines, reels);
        userBalance += winning;
        if(userBalance <= 0){
            console.log("Unfortunately, you are out of funds!\n");
            break;
        } else{
            console.log("Your net funds are $" + userBalance + "\n");
            const playAgain = prompt("Do you want to play again? (y/n)");
            if(playAgain != "y"){
                break;
            }
        }
    }   
}

game();
