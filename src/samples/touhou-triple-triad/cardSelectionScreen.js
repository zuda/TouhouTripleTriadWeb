import {UIMenuListView} from "../../lib/ui_menu_list_view/ui_menu_list_view.ts";
import {Screen} from "../../lib/screen/screen.ts";
import {MenuAxis, MenuFocus, UIMenu} from "../../lib/ui_menu/ui_menu.ts";
import {uiManager} from "../../lib/ui/ui_manager.ts";
import {UIDescriptionList} from "../../lib/ui_description_list/ui_description_list.ts";
import {UIMenuText} from "../../lib/ui_menu_text/ui_menu_text.ts";
import {coreManager, SizeMode} from "../../lib/core/core_manager.ts";
import {UICardHand} from "./ui/ui_card_hand.js";
import {UIWidget} from "../../lib/ui/ui_widget";
import {eventManager} from "../../lib/core/event_manager";
import {SIZE_HAND} from "./core/gameState";
import {Card} from "./core/card";
import {UIMessage} from "../../lib/ui_message/ui_message";

class UIPlayerHand {
    constructor() {
        this.size_i = 50;
        this.size_j = 130;
        this.offset_i = 35;
        this.offset_j = [30,1330];
        this.offset_select = 30;
        this.scale = 9;
        this.nb_uiCards_in_hand = [0,0];
        this.player_hands = new Array(2)
        this.i_selected = 0;
        for (let i = 0; i < 2; i++)
        {
            this.player_hands[i] = new Array(SIZE_HAND);
        }
    }

    addCard(player_num, card)
    {
        if (this.nb_uiCards_in_hand[player_num] < SIZE_HAND)
        {
            this.player_hands[player_num][this.nb_uiCards_in_hand[player_num]] = card;
            this.nb_uiCards_in_hand[player_num] += 1;
            uiManager.addWidget(this.player_hands[player_num][this.nb_uiCards_in_hand[player_num]-1], 'position: absolute; top: ' + ((this.nb_uiCards_in_hand[player_num]-1)*this.size_i+this.offset_i) + 'px; left: '  + this.offset_j[player_num] + 'px; width: '  + this.scale + '%;');
        }
    }

    setIndexSelectedFromCard(ui_cardhand)
    {
        let player_num = 0;
        let new_i_selected = this.player_hands[player_num].findIndex((card) => card.getCharacter() == ui_cardhand.getCharacter());

        console.log(new_i_selected);
        if(new_i_selected != -1)
            this.i_selected = new_i_selected;
    }

    get_i_selected(){
        return this.i_selected;
    }

    set_i_selected(val){
        this.i_selected = val;
    }

    // supprime la derniere cartes dans la main de #player_num
    removeLastCard(player_num)
    {
        if (this.nb_uiCards_in_hand[player_num] > 0)
        {
            console.log(this.player_hands[player_num][this.nb_uiCards_in_hand[player_num]-1]);
            uiManager.removeWidget(this.player_hands[player_num][this.nb_uiCards_in_hand[player_num]-1]);
            this.player_hands[player_num].pop();
            this.nb_uiCards_in_hand[player_num] -= 1;
        }
    }

    // supprime la derniere cartes dans la main de #player_num
    removeCurCardAndRearrangeHand(player_num)
    {
        for(let i = this.i_selected; i < this.nb_uiCards_in_hand[player_num]-1; i++){
            this.player_hands[player_num][i] = this.player_hands[player_num][i+1]
            this.player_hands[player_num][i].node.style.top = this.size_i*i+this.offset_i + "px";
        }
        this.nb_uiCards_in_hand[player_num] -= 1;
    }

    addAllWidgetsCards(){
        for(let i = 0; i < 2; i++){
            for(let j = 0; j < SIZE_HAND; j++){
                uiManager.addWidget(this.player_hands[i][j], 'position: absolute; top: ' + (j*this.size_i+this.offset_i) + 'px; left: '  + this.offset_j[i] + 'px; width: '  + this.scale + '%;');
            }
        }
    }

    getCard(player_num, i_card){
        return this.player_hands[player_num][i_card];
    }

    getSelectedCard(player_num){
        return this.player_hands[player_num][this.i_selected];
    }

    getIndexNeighbourCard(player_num, flag_get_next_card)
    {
        let i_neighbour = this.i_selected
        if (flag_get_next_card)
            i_neighbour = (i_neighbour+1) % this.nb_uiCards_in_hand[player_num]
        else
            i_neighbour = (i_neighbour+this.nb_uiCards_in_hand[player_num]-1) % this.nb_uiCards_in_hand[player_num]
        return i_neighbour;
    }

    // sélectionne la carte suivante ou précédente selon #flag_get_next_card, et déselectionne la carte courante sélectionnée
    selectNeighbourCard(player_num, flag_get_next_card){
        let new_i_selected = this.getIndexNeighbourCard(player_num, flag_get_next_card)
        this.unselectCard(player_num)
        this.i_selected = new_i_selected
        this.selectCard(player_num)
    }

    selectCard(player_num){
        let card = this.player_hands[player_num][this.i_selected]
        card.node.style.left = this.offset_select+this.offset_j[player_num] + "px";
        card.animate("clignoter 1.5s infinite");
    }

    unselectCard(player_num){
        let card = this.player_hands[player_num][this.i_selected]
        card.node.style.left = this.offset_j[player_num] + "px";
        card.animate("");
    }

    stopAnimation(player_num){
        this.player_hands[player_num][this.i_selected].animate("");
    }

    removeAllWidgets(){
        for(let i = 0; i < 2; i++)
        {
            for(let j = 0; j < this.nb_uiCards_in_hand[i]; j++)
            {
                uiManager.removeWidget(this.player_hands[i][j]);
            }
        }
    }
}

class CardListViewItem extends UIWidget
{
    constructor(name, quantity)
    {
        super({
            className: "CardListViewItem",
            template: `
                <div class="CardListViewItem name">${name}</div>
                <div class="CardListViewItem quantity">${quantity}</div>
            `
        });
        this.name = name;
        this.quantity = quantity;
    }

    setName(new_name)
    {
        this.node.querySelector('.name').textContent = new_name;
        this.name = name;
    }

    setQuantity(new_quantity)
    {
        this.node.querySelector('.quantity').textContent = new_quantity;
        this.quantity = new_quantity;
    }


}

class CardListView extends UIWidget
{
    constructor(item_id)
    {
        super({
            className: "CardListView",
            template: `<div class="ListTitle u-disabled">
            <div class="ListTitle-item cardname">Nom</div>
            <div class="ListTitle-item quantity">Quantité</div>
        </div>
        <div class="ListView u-focused"></div>`,
            id: item_id
        });
        this.items = [];
        this.focusedItem = null;
    }

    focus(focusIndex = MenuFocus.AUTO)
    {
        if (this.items.length > 0 && focusIndex == MenuFocus.AUTO)
        {
            const focusedIndex = this.focusedItem ? this.items.indexOf(this.focusedItem) : 0;
            this.focusItem(focusedIndex);
        }

        super.focus();
    }

    focusItem(index, emit = true)
    {
        const item = this.items[index];

        if (!item) {
          throw new Error('UIMenu::selectWidget(): widget not found !');
        }

        if(item.isFocused())
        {
            return;
        }

        this.items.forEach(i => i.unfocus());
        item.focus();
        this.focusedItem = item;

        if (emit)
        {
          eventManager.emit(this, 'E_ITEM_FOCUSED', { id: item.getId(), index: index });
        }
    }


    addItem(name, quantity)
    {
        let item = new CardListViewItem(name, quantity, this.items.length);

        this.node.querySelector(".ListView").appendChild(item.getNode());
        this.items.push(item);
    }

    selectItem(index, emit = true)
    {
        const item = this.items[index];
        if (!item) {
          throw new Error('UIMenu::selectWidget(): widget not found !');
        }

        if(item.quantity <= 0)
        {
            return;
        }

        this.items.forEach(i => i.node.classList.remove("selectcard"));
        this.items.forEach(i => i.node.classList.remove("deselectcard"));
        this.items.forEach(i => void i.node.offsetWidth);
        item.setSelected(true);
        item.node.classList.add("selectcard");
        item.setQuantity(item.quantity - 1);

        console.log(index);
        if (emit) {
          eventManager.emit(this, 'E_ITEM_SELECTED', { id: item.getId(), index: index });
        }
    }

    deselectItem(index, emit = true)
    {
        const item = this.items[index];
        if (!item) {
            throw new Error('UIMenu::selectWidget(): widget not found !');
        }

        this.items.forEach(i => i.node.classList.remove("selectcard"));
        this.items.forEach(i => i.node.classList.remove("deselectcard"));
        this.items.forEach(i => void i.node.offsetWidth);
        item.setSelected(false);
        item.node.classList.add("deselectcard");

        if (emit) {
          eventManager.emit(this, 'E_ITEM_DESELECTED', { id: item.getId(), index: index });
        }
    }

    getFocusedItemIndex()
    {
        return this.items.indexOf(this.focusedItem);
    }

    onAction(actionId)
    {
        if (actionId == 'BACKSPACE') {
          console.log(actionId);
          const focusedIndex = this.getFocusedItemIndex();
          this.deselectItem(focusedIndex);
        }
        else if (actionId == 'OK') {
          const focusedIndex = this.getFocusedItemIndex();
          console.log("OK ", focusedIndex);
          this.selectItem(focusedIndex);
        }
        else if (actionId == 'UP') {
          const focusedIndex = this.getFocusedItemIndex();
          console.log("UP ", focusedIndex);
          const prevIndex = (focusedIndex - 1) ? focusedIndex - 1 : 0;
          console.log("UP ", prevIndex);
          this.focusItem(prevIndex);
        }
        else if (actionId == 'DOWN') {
          const focusedIndex = this.getFocusedItemIndex();
          console.log("DOWN ", focusedIndex);
          const nextIndex = (focusedIndex + 1 > this.items.length - 1) ? this.items.length - 1 : focusedIndex + 1;
          console.log("DOWN ", nextIndex);
          this.focusItem(nextIndex);
        }
    }
}

class CardSelectionMenu extends UIMenu
{
    constructor()
    {
        super({axis: MenuAxis.X});
    }

    onAction(actionId)
    {

    }
}

class CardSelectionScreen extends Screen
{
    constructor(nb_cards_to_choose)
    {
        super();
        this.CardListView = new CardListView();
        this.ui_menu = new CardSelectionMenu();
        this.player_hand_preview = new UIWidget();
        this.player_hand = new UIPlayerHand();
        this.cards_selected = [];
        this.cards_database = [];
        this.nb_cards_to_choose = nb_cards_to_choose;
        this.initCardsDatabase();
    }

    async onEnter()
    {
        this.player_hand_preview.appendStyles("width: 20%");
        this.CardListView.appendStyles("width: 30%");
        this.initCardListView();

        /*
        let test_card = new UICardHand();
        test_card.setCharacter(player_cards_name[0]);
        test_card.setPlayerOwner(true);
        test_card.setPoints(Math.floor(Math.random() * 10  + 1), Math.floor(Math.random() * 10  + 1), Math.floor(Math.random() * 10  + 1), Math.floor(Math.random() * 10  + 1));
        */
        /*
        for (let i = 0; i < this.card_database.length; i++)
        {
            this.ui_menu_text.add(i.toString(), `${this.card_database[i].name} ${this.card_database[i].quantity}`);
        }*/

        this.ui_menu.addWidget(this.player_hand_preview);
        this.ui_menu.addWidget(this.CardListView);
        uiManager.addWidget(this.ui_menu, "position: absolute; top:0; left:0; right:0; width: 100%; height: 100%");
        eventManager.subscribe(this.CardListView, 'E_ITEM_SELECTED', this, this.handleCardSelected);
        eventManager.subscribe(this.CardListView, 'E_ITEM_DESELECTED', this, this.handleCardDeselected)
        // uiManager.addWidget(test_card, "position: absolute; top: 50px; left: 80px; width: 10%;");

        uiManager.focus(this.ui_menu);
        coreManager.setSize(1400, 730, SizeMode.FULL);
    }

    onExit()
    {
        for (let i = 0; i < this.ui_menu.getWidgets().length; i++)
        {
            this.ui_menu.removeWidget(i);
        }
    }

    getCardsFromDatabase()
    {
        // A faire
    }

    initCardsDatabase()
    {
        const player_cards_name = ["Alice","Patchouli","Cirno", "Reimu", "Sakuya", "Remilia", "Meiling", "Reisen", "Mokou","Iku", "Kisume", "Kogasa", "Komachi", "Marisa", "Konngara", "Momiji"];

        for(let i = 0; i < player_cards_name.length; i++)
        {
            let card = new Card();
            card.setPoints(Math.floor(Math.random() * 10  + 1), Math.floor(Math.random() * 10  + 1), Math.floor(Math.random() * 10  + 1), Math.floor(Math.random() * 10  + 1));
            card.setCharacterName(player_cards_name[i]);
            this.cards_database.push(card);
        }
    }

    initCardListView()
    {
        for (let i = 0; i < this.cards_database.length; i++)
        {
            this.CardListView.addItem(this.cards_database[i].name, "10");
        }
    }

    handleCardSelected(data)
    {
        if(this.cards_selected.length < this.nb_cards_to_choose)
        {
            let ui_card = new UICardHand();
            console.log(this.cards_database);
            console.log(data);
            console.log(this.cards_database[data.index]);
            ui_card.setFromCard(this.cards_database[data.index]);
            this.player_hand.addCard(0, ui_card);
            this.cards_selected.push(this.cards_database[data.index]);
        }

        else
        {
            window.alert("Nombre max de cartes à choisir déjà atteint");
        }
    }

    handleCardDeselected(data)
    {
        const f_card_found = this.cards_selected.findIndex((card) => card.name == this.CardListView.items[data.index].name);

        console.log(f_card_found);
        if(f_card_found != -1)
        {
            let ui_card = new UICardHand();
            ui_card.setFromCard(this.cards_database[data.index]);
            this.player_hand.setIndexSelectedFromCard(ui_card);
            for (let i = 0; i < this.cards_selected.length; i++)
            {
                this.player_hand.removeLastCard(0);
            }
            this.cards_selected.slice(0, f_card_found);
            for (let i = 0; i < this.cards_selected.length; i++)
            {
                let ui_card = new UICardHand();
                ui_card.setFromCard(this.cards_selected[i]);
                this.player_hand.addCard(0, ui_card);
            }
        }
    }
}

export { CardSelectionScreen };