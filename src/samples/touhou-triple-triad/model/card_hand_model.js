const Direction = {
    Top : 0,
    Right : 1,
    Bottom : 2,
    Left : 3
}

class CardHandModel
{
    constructor(player_owner)
    {
        this.points = [];
        this.name = "";
        this.player_owner = player_owner;
    }

    setPoints(top, right, bottom, left)
    {
        this.points[Direction.Top] = top;
        this.points[Direction.Right] = right;
        this.points[Direction.Bottom] = bottom;
        this.points[Direction.Left] = left;
    }

    setPoint(direction, value)
    {
        this.points[direction] = value;
    }

    setCharacter(name)
    {
        this.name = name;
    }

    setPlayerOwner(player_owner)
    {
        this.player_owner = player_owner;
    }

    generateRandomPoints(min = 1, max = 10)
    {
        for(let i = 0; i < 4; i++)
        {
            this.points[i] = Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
}

export { CardHandModel, Direction };