import { Direction, ElementalType } from "./type"

class Card {
    constructor(){
        this.points = new Array(4)
        this.elemental_type = ElementalType.NONE
        this.name = ""
        this.flag_belongToPlayer1 = true
    }

    setCharacterName(n){
        this.name = n;
    }

    flipPlayerOwner(){
        this.flag_belongToPlayer1 = !this.flag_belongToPlayer1
    }

    setPoint(dir, val){
        this.points[dir] = val
    }

    setPoints(W_val, N_val, E_val, S_val){
        this.points[Direction.W] = W_val;
        this.points[Direction.N] = N_val;
        this.points[Direction.E] = E_val;
        this.points[Direction.S] = S_val;
    }
    
    setPointsArray(array_val){
        for (let dir = 0; dir<4; dir++ ){
            this.points[dir] = array_val[dir]
        }
    }

    modifyPoints(array_val_modificator){
        for (let dir = 0; dir<4; dir++ ){
            this.points[dir] += array_val_modificator[dir]
        }
    }

    modifyPoint(val_modificator, dir){
        this.points[dir] += val_modificator
    }
}
export { Card as Card };