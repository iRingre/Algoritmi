CANVAS_HEIGHT = 700;
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

function setup() {
    createCanvas(CANVAS_WIDTH,CANVAS_HEIGHT);
    

    //input textbox for number of values in the array
    textbox = createInput('','number');
    textbox.position(10,20);
    textbox.size(100,15);
    textbox.value(100);

    //input per millisecondi di delay per ogni iterazione
    delay = createInput('delay','number');
    delay.position(10,40);
    delay.size(100,15);
    delay.value(0);
    sleepv = delay.value();


    //button to create the random array
    buttonCreateArray = createButton('crea array');
    buttonCreateArray.position(120,20);
    buttonCreateArray.size(80,20);
    buttonCreateArray.mousePressed(createRandomArray);

    //bottone di prova per chiamare l'insertion sort
    insertionSortButton = createButton('ordina');
    insertionSortButton.position(120,40);
    insertionSortButton.size(80,20);
    insertionSortButton.mousePressed(insertionSort);

    //dropdown menu to chose type of algorithm to sort the array
    algorithms = createSelect();
    algorithms.position(10,60);
    algorithms.size(108,20);
    algorithms.option('insertionSort');
    algorithms.option('quickSort');
    algorithms.option('MergeSort');
    algorithms.option('PartitionSort');
}

function draw() {
    background(0);
    arrayL = textbox.value();
    sleepv = delay.value();
    draw_array();
}

function draw_array(){
    spessore_val = (CANVAS_WIDTH/array.length);
    for (let i = 0; i < array.length; i++) {
        altezza_val = array[i]*(CANVAS_HEIGHT/max(array));
        fill(255);
        rect(i * spessore_val, CANVAS_HEIGHT - altezza_val, spessore_val, altezza_val);
    }
}

function createRandomArray(){
    if(arrayL>(CANVAS_WIDTH/2)){
        alert('porco dio la lunghezza massima è '+CANVAS_WIDTH/2);
        return;
    }else if(arrayL<10){
        alert("che hai l'array corto? la lunghezza minima è 10");
        return;
    }
    array=[];
    for (let i = 0; i < arrayL; i++) {
        array[i] = random(1,arrayL);   
    }
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
            //draw_array();
            //await sleep(sleepv);
            array[y+1] = array[y];
            //draw_array();
            y --;
        }
        await sleep(sleepv);
        array[y+1]=x;
        await draw_array();
    }
}


//------------- partition sort ------------------------

function partition(A,f,l){
    let x = A[l];
    let p = f-1;
    for (let j = f; j < l-1; j++) {
        if(A[j]<=x){
            p++;
            let app = A[p];
            A[p]=A[j];
            A[j]=app;
        }
    }
    let app1 = A[p+1];
    A[p+1]= A[l];
    A[l]=app1;
    return p+1;
}

function quickSort(A, f,l){
    if (f<l){
        let q = partition(A,f,l);
        quickSort(A,f,q-1);
        quickSort(A, q+1, l);
    }
}

// ----------------- merge sort -------------------

function mergeSort(A, f,l){
    if (f<l) {
        let q = (p+r)/2;
        mergeSort(A,f,q);
        mergeSort(A,q+1,l);
        merge(A,f,q,l);
    }
}

function merge(A,f,q,l){
    
}