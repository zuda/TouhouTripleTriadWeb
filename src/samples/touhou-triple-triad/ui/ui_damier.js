import { Direction } from "../core/type.ts";
import { Background } from "./ui_background";
import { uiManager } from "../../../lib/ui/ui_manager";
import { SIZE_BOARD } from "../core/gameState.js";
import { UIWall } from "./ui_wall.js";

const path_card = 'samples/touhou-triple-triad/';

class UIDamier
{
    constructor(p_cursor)
    {
        this.cursor = p_cursor
        this.cases = [];
        this.uiCards = [];
        this.uiVertical_walls = [];
        this.uiHorizontal_walls = [];
        this.nb_uiCards = 0;
        this.size_i = 175;
        this.size_j = 130;
        this.offset_i = 15;
        this.offset_j = 475;
        this.scale = 9;
        this.i_selected = 0
        this.j_selected = 0

        this.initCases();

        for (let i = 0; i < SIZE_BOARD; i++)
            this.uiCards[i] = [];
    }

    initCases()
    {
        for (let i = 0; i < SIZE_BOARD; i++) 
        {
            this.cases[i] = [];
            this.uiCards[i] = [];
            for(let j = 0; j < SIZE_BOARD; j++) 
            {
                this.cases[i][j] = new Background();
                this.cases[i][j].node.querySelector('.js-background').src = path_card + 'plateau.png';      
                this.uiCards[i][j] = null   
                uiManager.addWidget(this.cases[i][j], 'position: absolute; top: ' + (i*this.size_i+this.offset_i) + 'px; left: '  
                                                + (j*this.size_j + this.offset_j) + 'px; width: '  
                                                + this.scale + '%;');   
            }
        }
    }

    initWalls(vertical_walls, horizontal_walls){
        
        let j = 0;
        let UIwalls = [this.uiVertical_walls, this.uiHorizontal_walls];
        let walls = [vertical_walls, horizontal_walls];
        for (let i = 0; i<SIZE_BOARD; i+=1){
            for (let j = 0; j<SIZE_BOARD; j+=1){
                //i_axe == 0 => vertical; i_axe == 1 => horizontal
                for(let i_axe = 0; i_axe<2; i_axe+=1){
                    if(walls[i_axe][i][j]){
                        let new_wall = new UIWall(i_axe==0)
                        UIwalls[i_axe].push(new_wall);
                        uiManager.addWidget(new_wall, 'position: absolute; top: ' + (i*this.size_i+this.offset_i) + 'px; left: '  
                                                        + (j*this.size_j + this.offset_j) + 'px; width: '  
                                                        + this.scale + '%;');
                        //si on se trouve sur la première ligne et qu'on est en train de placer un mur horizontal
                        if(i == 0 && i_axe==1){
                            // on créé un visuel de mur horizontal supplémentaire après la derniere ligne
                            let extra_wall = new UIWall(i_axe==0)
                            UIwalls[i_axe].push(extra_wall);
                            uiManager.addWidget(extra_wall, 'position: absolute; top: ' + ((i+SIZE_BOARD)*this.size_i+this.offset_i) + 'px; left: '  
                                                            + (j*this.size_j + this.offset_j) + 'px; width: '  
                                                            + this.scale + '%;');
                        }
                        //si on se trouve sur la première colonne et qu'on est en train de placer un mur vertical
                        else if(j == 0 && i_axe==0){
                            // on créé un visuel de mur vertical supplémentaire après la derniere colonne
                            let extra_wall = new UIWall(i_axe==0)
                            UIwalls[i_axe].push(extra_wall);
                            uiManager.addWidget(extra_wall, 'position: absolute; top: ' + (i*this.size_i+this.offset_i) + 'px; left: '  
                                                            + ((j+SIZE_BOARD)*this.size_j + this.offset_j) + 'px; width: '  
                                                            + this.scale + '%;');
                        }
                    }
                }
            }
        }
    }

    getCase(i_row, i_column){
        return this.cases[i_row][i_column];
    }

    getUICard(i_row, i_column){
        return this.uiCards[i_row][i_column];
    }

    isFull(){
        return this.nb_uiCards == SIZE_BOARD*SIZE_BOARD
    }

    // sélectionne la premiere case vide rencontré dans le damier. 
    selectFirstEmptyCase(i_row, i_column){
        for (let i = 0; i < SIZE_BOARD; i++){
            for(let j = 0; j < SIZE_BOARD; j++){
                if (this.uiCards[i][j] == null){
                    this.i_selected = i
                    this.j_selected = j
                    this.selectCurrentCase()
                    return;
                }
                
            }
        }
    }

     setCardInSelectedCase(card){
        this.uiCards[this.i_selected][this.j_selected] = card;
        card.node.style.top = this.offset_i+this.size_i*this.i_selected + "px";
        card.node.style.left = this.offset_j+this.size_j*this.j_selected + "px";
        card.animate("");
        this.nb_uiCards+=1;
    }

    moveSelectedCase(dir){
        this.unselectCurrentCase()
        let coordonate_neighbour = this.getCoordonnateNeighbourCase(this.i_selected, this.j_selected, dir)
        this.i_selected = coordonate_neighbour[0]
        this.j_selected = coordonate_neighbour[1]
        this.selectCurrentCase()
    }

    getNeighbourCase(i, j, dir){
        let coordonate_neighbour = this.getCoordonnateNeighbourCase(i, j, dir)
        return this.cases[coordonate_neighbour[0]][coordonate_neighbour[1]];
    }

    getCoordonnateNeighbourCase(i, j, dir)
    {
        let i_neighbour = i;
        let j_neighbour = j;
        switch(dir){                
            case Direction.N:
                (i_neighbour==0) ? i_neighbour=SIZE_BOARD-1 : i_neighbour=i_neighbour-1
                break;
            case Direction.E:
                (j_neighbour==SIZE_BOARD-1) ? j_neighbour=0 : j_neighbour=j_neighbour+1
                break;
            case Direction.S:
                (i_neighbour==SIZE_BOARD-1) ? i_neighbour=0 : i_neighbour=i_neighbour+1
                break;
            case Direction.W:
                (j_neighbour==0) ? j_neighbour=SIZE_BOARD-1 : j_neighbour=j_neighbour-1
                break;
        }
        return [i_neighbour,j_neighbour];
    }

    getSelectedCoordinate(){
        return [this.i_selected, this.j_selected]
    }


    selectedCaseIsEmpty(){
        return this.uiCards[this.i_selected][this.j_selected] == null
    }

    selectCurrentCase(){
        this.cases[this.i_selected][this.j_selected].animate("clignoter 1.5s infinite");
        this.cursor.node.style.left = (this.j_selected+0.4)*this.size_j + this.offset_j + "px";
        this.cursor.node.style.top = (this.i_selected+0.4)*this.size_i + this.offset_i+ "px";
    }

    unselectCurrentCase(){
        this.cases[this.i_selected][this.j_selected].animate("");
    }

    removeAllWidjet(){
        for(let i = 0; i < SIZE_BOARD; i++){
            for(let j = 0; j < SIZE_BOARD; j++){
                if (this.uiCards[i][j] != null)
                    uiManager.removeWidget(this.uiCards[i][j]);
            }
        }
    }
}

export { UIDamier};