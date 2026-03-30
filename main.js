CANVAS_HEIGHT = 670;
CANVAS_WIDTH = 1400;
let spessore_val = 0;
let altezza_val = 0;


let textbox;
let buttonCreateArray;
let insertionSortButton;
let delay;
let algorithms;
let sleepv = 0;

let array = [];
let arrayL = 0;
let maxValA = 0;

// Variabili per statistiche
let swaps = 0;
let comparisons = 0;
let progress = 0;

function setup() {
    createCanvas(CANVAS_WIDTH,CANVAS_HEIGHT);
    

    //input textbox for number of values in the array
    textbox = createInput('','number');
    textbox.position(10,20);
    textbox.size(100,15);
    textbox.value(300);

    //input per millisecondi di delay per ogni iterazione
    delay = createInput('delay','number');
    delay.position(10,40);
    delay.size(100,15);
    delay.value(0);
    sleepv = delay.value(0);


    //button to create the random array
    buttonCreateArray = createButton('crea array');
    buttonCreateArray.position(120,20);
    buttonCreateArray.size(80,20);
    buttonCreateArray.mousePressed(createRandomArray);

    //bottone di prova per chiamare l'insertion sort
    insertionSortButton = createButton('ordina');
    insertionSortButton.position(120,40);
    insertionSortButton.size(80,20);
    insertionSortButton.mousePressed(choise);

    //dropdown menu to chose type of algorithm to sort the array
    algorithms = createSelect();
    algorithms.position(10,60);
    algorithms.size(108,20);
    algorithms.option('InsertionSort');
    algorithms.option('QuickSort');
    algorithms.option('MergeSort');
    algorithms.option('CountingSort');
    algorithms.option('RadixSort');
    algorithms.option('StalinSort');
    algorithms.option('EpsteinSort');
}

function draw() {
    background(0);
    arrayL = textbox.value();
    sleepv = delay.value();
    draw_array();
    drawProgressBar();
}

function draw_array(){
    spessore_val = (CANVAS_WIDTH/array.length);
    for (let i = 0; i < array.length; i++) {
        altezza_val = array[i]*(CANVAS_HEIGHT/maxValA);
        fill(255);
        rect(i * spessore_val, CANVAS_HEIGHT - altezza_val, spessore_val, altezza_val);
    }
}

function drawProgressBar() {
    // Sfondo della progress bar
    fill(50);
    rect(10, CANVAS_HEIGHT - 640, 300, 20);
    
    // Progresso
    fill(0, 255, 0);
    rect(10, CANVAS_HEIGHT - 640, 300 * progress, 20);
    
    // Testo percentuale
    fill(255);
    textSize(14);
    textAlign(LEFT);
    text(`Progresso: ${Math.floor(progress * 100)}%`, 10, CANVAS_HEIGHT - 650);
    
    // Numero di scambi e confronti
    text(`Scambi: ${swaps}`, 10, CANVAS_HEIGHT - 600);
    text(`Confronti: ${comparisons}`, 10, CANVAS_HEIGHT - 580);
}

function createRandomArray(){
    if(arrayL>(CANVAS_WIDTH/2)){
        alert('porco dio la lunghezza massima è '+CANVAS_WIDTH/2);
        return;
    }
    if(arrayL<10){
        alert("che hai l'array corto? la lunghezza minima è 10");
        return;
    }
    array=[];
    for (let i = 0; i < arrayL; i++) {
        array[i] = i+1;   
    }
     array = shuffle(array);
     maxValA = max(array);
     resetStats();
}

function resetStats() {
    swaps = 0;
    comparisons = 0;
    progress = 0;
}

async function choise(){
    let val = algorithms.value();
    resetStats();
    switch (val) {
        case 'InsertionSort':
            await insertionSort();
            break;
        case 'QuickSort':
            await quickSort(array,0,array.length-1);
            break;
        case 'MergeSort':
            await mergeSort(array,0,array.length);
            break;
        case 'CountingSort':
            await CountingSort(array, max(array));
            break;
        case 'RadixSort':
            await radixSort(array);
            break;
        case 'StalinSort':
            await stalinSort();
            break;
        case 'EpsteinSort':
            await epsteinSort();
            break;
        default:
            break;
    }
    progress = 1;
}

//funzione custom per sleep
function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}

//--------------- insertion sort ----------------------
async function insertionSort(){
    for (let i = 1; i < array.length; i++) {
        let y = i-1;
        let x = array[i];
        while(y>=0 && array[y]>x){
            comparisons++;
            //draw_array();
            //await sleep(sleepv);
            array[y+1] = array[y];
            swaps++;
            //draw_array();
            y --;
        }
        comparisons++; // per l'ultimo confronto che esce dal while
        await sleep(sleepv);
        array[y+1]=x;
        if(array[y+1] != x) swaps++;
        
        progress = i / array.length;
        //draw_array();
    }
}


//------------- quick sort ------------------------

async function partition(A,f,l){
    let x = A[l];
    let p = f-1;
    for (let j = f; j < l; j++) {
        comparisons++;
        if(A[j]<=x){
            p++;
            let app = A[p];
            A[p]=A[j];
            A[j]=app;
            swaps++;
        }
        await sleep(sleepv);
        //draw_array();
    }
    let app1 = A[p+1];
    A[p+1]= A[l];
    A[l]=app1;
    swaps++;
    return p+1;
}

async function quickSort(A, f,l){
    if (f<l){
        let q = await partition(A,f,l);
        await quickSort(A,f,q-1);
        await quickSort(A, q+1, l);
    }
    if(f === 0 && l === A.length-1) progress = 1;
}

// ----------------- merge sort -------------------

async function mergeSort(A, f,l){
    if (l-f>1) {
        let q = Math.floor((f+l)/2);
        await mergeSort(A,f,q);
        await mergeSort(A,q,l);
        await merge(A,f,q,l);
    }
    if(f === 0 && l === A.length) progress = 1;
}

async function merge(arr, start, mid, end) {
    let left = start;
    let right = mid;
    let temp = [];

    while (left < mid && right < end) {
        comparisons++;
        if (arr[left] < arr[right]) {
            temp.push(arr[left++]);
        } else {
            temp.push(arr[right++]);
        }
    }

    while (left < mid) temp.push(arr[left++]);
    while (right < end) temp.push(arr[right++]);

    for (let i = 0; i < temp.length; i++) {
        if(arr[start + i] != temp[i]) swaps++;
        arr[start + i] = temp[i];
        await sleep(sleepv);
        //draw_array();
        
        progress = (start + i) / arr.length;
    }
}

//-------------------- counting sort ------------------

async function CountingSort(arr, maxVal){
  let count = Array(maxVal + 1).fill(0);

  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
    comparisons++;
  }

  let sorted = [];

  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      sorted.push(i);
      count[i]--;
      swaps++;
    }
  }

  for (let i = 0; i < arr.length; i++) {
    if(arr[i] != sorted[i]) swaps++;
    arr[i] = sorted[i];
    //draw_array();
    await sleep(sleepv);
    
    progress = i / arr.length;
  }
}

//-------------------------Radix sort---------------------

async function radixSort(arr) {
  let maxNum = max(arr);
  let digit = 1;
  let iteration = 0;
  let totalIterations = Math.floor(Math.log10(maxNum)) + 1;

  while (Math.floor(maxNum / digit) > 0) {
    await countingSortByDigit(arr, digit);
    digit *= 10;
    iteration++;
    progress = iteration / totalIterations;
  }

  return arr;
}

async function countingSortByDigit(arr, digit) {
  let output = new Array(arr.length).fill(0);
  let count = new Array(10).fill(0);

  for (let i = 0; i < arr.length; i++) {
    let digitValue = Math.floor(arr[i] / digit) % 10;
    count[digitValue]++;
    comparisons++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    let digitValue = Math.floor(arr[i] / digit) % 10;
    output[count[digitValue] - 1] = arr[i];
    count[digitValue]--;
    swaps++;
  }

  for (let i = 0; i < arr.length; i++) {
    if(arr[i] != output[i]) swaps++;
    arr[i] = output[i];
    await sleep(sleepv);
  }
}

//-----------------stalin sort-------------------------
async function stalinSort(){
    if (array.length <= 1) return;

    let result = [];
    result.push(array[0]);

    for (let i = 1; i < array.length; i++) {
        await sleep(sleepv);
        comparisons++;
        
        if (array[i] >= result[result.length - 1]) {
            result.push(array[i]);
        } else {
            swaps++;
            array[i] = 0;
        }
        
        progress = i / array.length;
    }

    array = result;
}

//-------------------epstein sort----------------------
async function epsteinSort(){
    if (array.length <= 1) return;

    let result = [];

    for (let i = 0; i < array.length; i++) {
        await sleep(sleepv);
        comparisons++;
        
        if (array[i] < 18) {
            result.push(array[i]);
        } else {
            swaps++;
            array[i] = 0;
        }
        
        progress = i / array.length;
    }

    array = sort(result,result.length);
}

// Funzione shuffle esistente (da mantenere)
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}