const inputSlider = document.querySelector("[data-lengthSlider]");
const passLength = document.querySelector("[data-len]"); 
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercasecheck = document.querySelector('#Uppercase');
const lowercasecheck = document.querySelector('#Lowercase');
const numberscheck = document.querySelector('#Numbers');
const symbolscheck = document.querySelector('#Symbols');
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";

let passwordLength = 10;

let checkCount = 0;

setIndicator("#ccc");

handleSlider();
function handleSlider()
{
    inputSlider.value = passwordLength;
    passLength.innerText = passwordLength; 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min , max)
{
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRndNumber()
{
    return getRndInteger(0,9);
}

function generateLowercase()
{
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase()
{
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() 
{
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercasecheck.checked) hasUpper = true;
    if (lowercasecheck.checked) hasLower = true;
    if (numberscheck.checked) hasNum = true;
    if (symbolscheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}


function handleCheckBoxChange()
{
    checkCount=0;
    allCheckBox.forEach((checkbox) =>
    {
        if(checkbox.checked)
        checkCount++;
    });

    // if(passwordLength < checkCount)
    // {
    //     passwordLength =  checkCount;
    //     handleSlider();
    // }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input' , (e) =>
{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click' , function()
{
    if(passwordDisplay.value)
    copyContent(); 
})

function shufflePassword(array)
{
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
generateBtn.addEventListener('click' , function ()
{
    if(checkCount==0)
    return;

    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }


    password = "";

    let funcArr = [];

    if(uppercasecheck.checked)
    {
        funcArr.push(generateUppercase);
    }

    if(lowercasecheck.checked)
    {
        funcArr.push(generateLowercase);
    }

    if(numberscheck.checked)
    {
        funcArr.push(generateRndNumber);
    }

    if(symbolscheck.checked)
    {
        funcArr.push(generateSymbol);
    }

    for(let  i  = 0 ; i<funcArr.length;i++)
    {
        password += funcArr[i]();
    }

    for(let i = 0 ; i<passwordLength-funcArr.length;i++)
    {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password =  shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();
});

