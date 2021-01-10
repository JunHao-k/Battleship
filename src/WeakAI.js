import React from 'react'

//function runWeakAi(arr_a , successHits , field_arr){
    async function runWeakAi (arr_a, modifySuccessfulHits, modifyField , arr_field) {

    let numSelect = (min , max) => {
        let numGen = Math.floor(
            Math.random() * (max - min + 1) + min
        )
    return numGen
    }

    let selectSquare = () => {
        let row = 0;
        let col = 0;
    
        let times = 0;
    do{
        //times++;
        //console.log(row, col, times);
        row = numSelect(0 , 5)
        col = numSelect(0 , 11)  
    }
    while(arr_field[row][col] != '')
        
    return [row , col]      
    }
    
    let [r , c] = selectSquare();

    let char = '';
    
    //console.log(">>>>>>> row=",r,"col=",c);
    if(arr_a[r][c] == ''){
        //field_arr[r][c] = 'O';
        await modifyField(r, c, 'O');
    }
    else if(arr_a[r][c] == 'C'){
        char = 'C'
        // field_arr[r][c] = 'X'
        await modifyField(r,c,'X');
        // successHits++
        await modifySuccessfulHits(1);
        
    }
    else if(arr_a[r][c] == 'B'){
        char = 'B'
        await modifyField(r , c , 'X')
        //successHits++
        await modifySuccessfulHits(1);

        
    }
    else if(arr_a[r][c] == 'c'){
        char = 'c'
        await modifyField(r , c , 'X')
        await modifySuccessfulHits(1);

        
    }
    else if(arr_a[r][c] == 'S'){
        char = 'S'
        await modifyField(r , c , 'X')
        await modifySuccessfulHits(1);

        
    }
    else if(arr_a[r][c] == 'D'){
        char = 'D'  
        await modifyField(r , c , 'X')
        await modifySuccessfulHits(1);

        
    } else {
        alert("Space already shot at");
    }
    
return char
}


export default runWeakAi;
