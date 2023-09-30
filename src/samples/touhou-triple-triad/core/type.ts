enum Direction {
	W,
	N,
	E,
    S
}

enum ElementalType {
	NONE = 0,
	FIRE = 1,
	ICE = 2,
    EARTH = 3,
    THUNDER = 4,
    YIN = 5,
    YANG = 6
}

enum typeEffect {
    PreBattle,
    InBattle,
    PostBattle
};

enum priorityEffect {
    Plus,
    Identique,
    Normal
};


export {Direction}
export {ElementalType}
export {typeEffect, priorityEffect}