import React from 'react'

let previousHit = false; //This is a state ==> the past state
let start = [-1, -1];
let previous = [-1, -1];
let dir = 0;


async function runMediumAi(arr_a , modifySuccessfulHits , modifyField , arr_field , modifyAlerts){
    
    //Function to select a random number between to values
    let numSelect = (min , max) => {
        let numGen = Math.floor(
            Math.random() * (max - min + 1) + min
        )
    return numGen
    }

    //Function to select an empty space in a 6x12 array
    let selectSquare = () => {
        let row = 0;
        let col = 0;
    
        let times = 0;
    do{
        times++;
        console.log(row, col, times);
        row = numSelect(0 , 5)
        col = numSelect(0 , 11)  
    }
    while(arr_field[row][col] != '')
        
    return [row , col]      
    }

    //Function that checks the storage_A array for the specified row and col if there is something placed in there
    let checkSquares = async (r , c , arr_a) => {
        console.log("Checking at ",r,c);
        let char = ''

        if(arr_a[r][c] == 'C'){
            char = 'C'
            await modifyField(r,c,'X');
            await modifySuccessfulHits(1);
        }
        else if(arr_a[r][c] == 'B'){
            char = 'B'
            await modifyField(r,c,'X');
            await modifySuccessfulHits(1);
        }
        else if(arr_a[r][c] == 'c'){
            char = 'c'
            await modifyField(r,c,'X');
            await modifySuccessfulHits(1);  
        }
        else if(arr_a[r][c] == 'S'){
            char = 'S'
            await modifyField(r,c,'X');
            await modifySuccessfulHits(1);   
        }
        else if(arr_a[r][c] == 'D'){
            char = 'D'
            await modifyField(r,c,'X');
            await modifySuccessfulHits(1);  
        }
        else{
            char = 'O'
        }
    return char
    }

    //Checks all the available directions for the given row and col passed in as parameters
    let eligible_dir = (r , c) => {
        // eligible_dir = [0 , 0 , 0 , 0] ==> [left  right  top  down]
        let dir_num = [0 , 0 , 0 , 0];
    
        if(r == 0){
            if(c == 0){
                dir_num = [0 , 1 , 0 , 1];
            }
            else if(c == 11){
                dir_num = [1 , 0 , 0 , 1]
            }
            else{
                dir_num = [1 , 1 , 0 , 1];
            }
        }
        else if(r == 5){
            if(c == 0){
                dir_num = [0 , 1 , 1 , 0];
            }
            else if(c == 11){
                dir_num = [1 , 0 , 1 , 0]
            }
            else{
                dir_num = [1 , 1 , 1 , 0]
            }
        }
        else{
            if(c == 0){
                dir_num = [0 , 1 , 1 , 1]
            }
            else if(c == 11){
                dir_num = [1 , 0 , 1 , 1]
            }
            else{
                dir_num = [1 , 1 , 1 , 1]
            }
        }
    return dir_num
    }

    let new_dir = -1;
    let returnChar = ''
    while (new_dir==-1) {
          // let r , c = 0
    //If this is player B's first hit or if the previous hit was a missed
    if(previousHit == false){
        let [r , c] = selectSquare()
        console.log("previous Hit == false");
        console.log("r=",r, "c=",c);
        console.log(arr_a)

        //If the previous hit was a miss and this hit found a target
        if(arr_a[r][c] != ''){
            
            previousHit = true;
            start = [r,c];
            previous = [r,c];
            
            //Decide on a direction as to where to check for the next shot
            dir = Math.floor(Math.random() * 4)//Returns a random integer from 0 to 3
            console.log('dir number = ' , dir)
            console.log('Previous hit = ' , previousHit , '||||||' , 'start = ' , start , '||||||'  , 'previous = ' , previous)  

            returnChar = await checkSquares(r , c , arr_a);
        }
        else{
            let msg = 'AI missed'
            await modifyField(r, c, 'O');
            returnChar =  await checkSquares(r , c , arr_a);
        }
    } 
    else{
        let num_of_dir = [];
        let [r,c] = previous;
        num_of_dir = eligible_dir(previous[0] , previous[1])
        console.log('num_of_dir = ' , num_of_dir)
        console.log('Current dir = ' , dir)
        console.log('r = ' , r , 'c = ' , c) 
       // -1 means no direction selected
        // while(num_of_dir[dir] != 1){
        //     dir = (dir + 1) % 4
        // }
        
        //Decide on the next direction for the next player B turn first
        for (let i = 0; i < 4; i++) {
            let next_dir = (dir+i) % 4;
            if (next_dir==0 && num_of_dir[next_dir]==1) {
                if (arr_field[r][c-1]=="") {
                    new_dir = next_dir
                    break;
                }
            } else if (next_dir==1 && num_of_dir[next_dir]==1) {
                if (arr_field[r][c+1]=="") {
                    new_dir = next_dir
                    break;
                }
            } else if (next_dir==2 && num_of_dir[next_dir]==1) {
                if (arr_field[r-1][c]=="") {
                    new_dir = next_dir;
                    break;
                }
            } else if (next_dir==3 && num_of_dir[next_dir]==1) {
                if (arr_field[r+1][c]=="") {
                    new_dir = next_dir
                    break;
                }
            }            
        }

        //If all directions cannot work and previous != starting point
        if (new_dir==-1 && previous[0] != start[0] && previous[1] != start[1]) {
            previous[0] = start[0];
            previous[1] = start[1];
            console.log("Reverting to previous position");
             continue;
        } else if (new_dir==-1) {
            previousHit = false;
            console.log("Back to random")
            continue;
        }
      
        console.log("New direction=", new_dir);
        dir = new_dir;
        if(dir == 0){
            c--
            returnChar = await checkSquares(r , c , arr_a);
            previous = [r , c]
        }
        else if(dir == 1){
            c++
            returnChar = await checkSquares(r , c , arr_a);
            previous = [r , c]
        }
        else if(dir == 2){
            r--
            returnChar = await checkSquares(r , c , arr_a);
            previous = [r , c]
        }
        else{
            r++
            returnChar = await checkSquares(r , c , arr_a);
            previous = [r , c]
        }


        if (returnChar == 'O')
        {
            if (previous[0]==start[0] && previous[1]==start[1]) {
                previousHit=false;
                break;
            }
            else {
                previous[0] = start[0];
                previous[1] = start[1];
                modifyField(r,c,'O')
            }
        }
        // if(returnChar == 'O'){
        //     previousHit = false;
        //     previous[0] = start
        // }
    }
        // code for using the start coordinate and check top, down, left, right direction
        // eligible_dir = [0 , 0 , 0 , 0] ==> [left  right  top  down]
return returnChar
    }
  
}

export default runMediumAi;