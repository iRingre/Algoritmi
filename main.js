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

let timeIn = 0;
let timeFin = 0;

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
    algorithms.option('ShakerSort');
    algorithms.option('CycleSort');
    algorithms.option('SelectionSort');
    algorithms.option('GnomeSort');
    algorithms.option('BrickSort');
    algorithms.option('HeapSort');
    algorithms.option('TimSort');
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
    fill(50);
    rect(10, CANVAS_HEIGHT - 650, 300, 20);
    
    let progressColor = color(
        Math.floor(255 * (1 - progress)),
        Math.floor(255 * progress),
        0
    );
    fill(progressColor);
    rect(10, CANVAS_HEIGHT - 650, 300 * progress, 20);
    

    fill(255);
    textSize(14);
    textAlign(LEFT);
    text(`📊 Progresso: ${Math.floor(progress * 100)}%`, 10, CANVAS_HEIGHT - 655);
    text(`🔄 Scambi: ${swaps}`, 10, CANVAS_HEIGHT - 610);
    text(`⚖️ Confronti: ${comparisons}`, 10, CANVAS_HEIGHT - 590);
    
    if( progress >= 1) {
        let elapsed = ((timeFin - timeIn) / 1000).toFixed(2);
        text(`⏱️ Tempo: ${elapsed}s`, 10, CANVAS_HEIGHT - 570);
    }
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
    timeIn = Date.now();
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
        case 'ShakerSort':
            await cocktailShakerSort();
            break;
        case 'CycleSort':
            await cycleSort();
            break;
        case 'SelectionSort':
            await selectionSort();
            break;
        case 'GnomeSort':
            await gnomeSort();
            break;
        case 'BrickSort':
            await oddEvenSort();
            break;
        case 'HeapSort':
            await heapSort();
            break;
        case 'TimSort':
            await timSort();
            break;
        default:
            break;
    }
    timeFin = Date.now();
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

//------------------cocktail shaker sort-----------------------
async function cocktailShakerSort() {
    let swapped = true;
    let start = 0;
    let end = array.length-1;
    
    while (swapped) {
        swapped = false;
        
        // Forward pass
        for (let i = start; i < end; i++) {
            comparisons++;
            if (array[i] > array[i+1]) {
                [array[i], array[i+1]] = [array[i+1], array[i]];
                swaps++;
                swapped = true;
                await sleep(sleepv);
                //draw_array();
            }
        }
        
        if (!swapped) break;
        
        swapped = false;
        end--;
        
        // Backward pass
        for (let i = end-1; i >= start; i--) {
            comparisons++;
            if (array[i] > array[i+1]) {
                [array[i], array[i+1]] = [array[i+1], array[i]];
                swaps++;
                swapped = true;
                await sleep(sleepv);
                //draw_array();
            }
        }
        start++;
        progress = start / array.length;
    }
}


//-------------------cycle sort ------------------------------
async function cycleSort() {
    let n = array.length;
    
    for (let cycleStart = 0; cycleStart < n-1; cycleStart++) {
        let item = array[cycleStart];
        let pos = cycleStart;
        
        // Find position where we put the element
        for (let i = cycleStart+1; i < n; i++) {
            if (array[i] < item) pos++;
            comparisons++;
        }
        
        if (pos === cycleStart) continue;
        
        // Skip duplicates
        while (item === array[pos]) {
            pos++;
            comparisons++;
        }
        
        // Put the item to its correct position
        if (pos !== cycleStart) {
            [array[pos], item] = [item, array[pos]];
            swaps++;
            await sleep(sleepv);
            //draw_array();
        }
        
        // Rotate the rest of the cycle
        while (pos !== cycleStart) {
            pos = cycleStart;
            
            for (let i = cycleStart+1; i < n; i++) {
                if (array[i] < item) pos++;
                comparisons++;
            }
            
            while (item === array[pos]) {
                pos++;
                comparisons++;
            }
            
            if (item !== array[pos]) {
                [array[pos], item] = [item, array[pos]];
                swaps++;
                await sleep(sleepv);
                //draw_array();
            }
        }
        progress = cycleStart / n;
    }
}

//-------------------------------------selection sort------------------------------
async function selectionSort() {
    for (let i = 0; i < array.length-1; i++) {
        let minIdx = i;
        for (let j = i+1; j < array.length; j++) {
            comparisons++;
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            swaps++;
            await sleep(sleepv);
            //draw_array();
        }
        progress = i / array.length;
    }
}

//------------------------------ gnome sort---------------------------------
async function gnomeSort() {
    let i = 1;
    while (i < array.length) {
        comparisons++;
        if (array[i-1] <= array[i]) {
            i++;
            await sleep(sleepv);
        } else {
            [array[i-1], array[i]] = [array[i], array[i-1]];
            swaps++;
            i--;
            if (i === 0) i = 1;
            //draw_array();
        }
        progress = i / array.length;
    }
}


//------------------------------- Brick sort (Odd- Even Sort)------------------------
async function oddEvenSort() {
    let sorted = false;
    let n = array.length;
    
    while (sorted == false) {
        sorted = true;
        
        // Odd phase
        for (let i = 1; i < n-1; i += 2) {
            comparisons++;
            if (array[i] > array[i+1]) {
                [array[i], array[i+1]] = [array[i+1], array[i]];
                swaps++;
                sorted = false;
                await sleep(sleepv);
                //draw_array();
            }
        }
        
        // Even phase
        for (let i = 0; i < n-1; i += 2) {
            comparisons++;
            if (array[i] > array[i+1]) {
                [array[i], array[i+1]] = [array[i+1], array[i]];
                swaps++;
                sorted = false;
                await sleep(sleepv);
                //draw_array();
            }
        }
    }
    progress = 1 - (sorted ? 1 : 0);
    return;
}


//----------------------------------------- heap sort------------------------------------------
async function heapSort() {
    let n = array.length;
    
    // Build heap
    for (let i = Math.floor(n/2)-1; i >= 0; i--) {
        await heapify(n, i);
    }
    
    // Extract elements from heap
    for (let i = n-1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        swaps++;
        await heapify(i, 0);
        progress = (n-i) / n;
        await sleep(sleepv);
        //draw_array();
    }
}

async function heapify(n, i) {
    let largest = i;
    let left = 2*i + 1;
    let right = 2*i + 2;
    
    if (left < n && array[left] > array[largest]) {
        largest = left;
        comparisons++;
    }
    if (right < n && array[right] > array[largest]) {
        largest = right;
        comparisons++;
    }
    
    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        swaps++;
        await heapify(n, largest);
    }
}


//-------------------------------- tim sort------------------------------------
const RUN = 32;

async function timSort() {
    let n = array.length;
    
    // Sort individual runs
    for (let i = 0; i < n; i += RUN) {
        await insertionSortRange(i, Math.min(i+RUN-1, n-1));
    }
    
    // Merge runs
    for (let size = RUN; size < n; size = 2*size) {
        for (let left = 0; left < n; left += 2*size) {
            let mid = left + size - 1;
            let right = Math.min(left + 2*size - 1, n-1);
            if (mid < right) {
                await mergeRange(left, mid, right);
            }
        }
        progress = size / n;
    }
}

async function insertionSortRange(l, r) {
    for (let i = l+1; i <= r; i++) {
        let temp = array[i];
        let j = i-1;
        while (j >= l && array[j] > temp) {
            array[j+1] = array[j];
            swaps++;
            j--;
            comparisons++;
            await sleep(sleepv);
            //draw_array();
        }
        array[j+1] = temp;
    }
}

async function mergeRange(l, m, r) {
    let left = array.slice(l, m+1);
    let right = array.slice(m+1, r+1);
    let i = 0, j = 0, k = l;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            array[k] = left[i++];
        } else {
            array[k] = right[j++];
            swaps++;
        }
        comparisons++;
        await sleep(sleepv);
        //draw_array();
        k++;
    }
    
    while (i < left.length) array[k++] = left[i++];
    while (j < right.length) array[k++] = right[j++];
}