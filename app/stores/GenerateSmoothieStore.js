'use strict';

import Reflux from 'reflux';
import Actions from '../actions/SmoothieActions.js';
import numberGen from './Utils.js';

import ingredients from '../constants.js';


let storeIngredients = {
  ingredients
};

let storeData = {
  cards: []
}

const GenerateSmoothieStore = Reflux.createStore({
  listenables: Actions,

  onTrashGeneratedCard(card) {
    storeData.cards.splice(card, 1);
    this.sendCards();
  },

  onFindIngredients(type, numCards, liquidType) {
    let ingredientsQty = 4;
    type === 'mixed' ? this.multiSelect(numCards, liquidType) : this.singleSelect(type, numCards, ingredientsQty, liquidType);
  },

  onReplaceIngredients(type, amountToReplace, cardIndex, keepThese) {
    let newItems = this.createIngredients(type, amountToReplace);
    // keep keepthese at same index
    newItems = newItems.concat(keepThese);
    storeData.cards[cardIndex].ingredients = newItems;

    this.sendCards();
  },

  replaceIngredients(items) {
    // TODO Stop liquid being added twice. Keep original items order.
  },

  singleSelect(type, numCards, amountOfIngredients, liquidType) {
    let numCardsCopy = numCards;

    while (numCardsCopy > 0) {
      let ingredientsToSend = this.createIngredients(type, amountOfIngredients);

      let recipeCard = {};
      recipeCard.saved = false;
      recipeCard.type = type;
      recipeCard.liquid = liquidType;
      recipeCard.ingredients = ingredientsToSend;

      storeData.cards.push(recipeCard);
      numCardsCopy--;
    }

    this.sendCards();
  },

  multiSelect(numCards, liquidType) {
    let numCardsCopy = numCards;

    while (numCardsCopy > 0) {

      let qty = 2;
      let fruitToSend = this.createIngredients('fruit', qty);
      let vegToSend = this.createIngredients('vegetable', qty);
      let ingredientsToSend = [].concat(fruitToSend, vegToSend);

      let recipeCard = {};
      recipeCard.saved = false;
      recipeCard.type = "mixed";
      recipeCard.liquid = liquidType;
      recipeCard.ingredients = ingredientsToSend;

      storeData.cards.push(recipeCard);
      numCardsCopy--;
    }

    this.sendCards();
  },

  createIngredients(type, amountOfIngredients) {
    let recipe = [];
    let ingredients = storeIngredients.ingredients[type];
    let ingredientsLength = ingredients.length;

    while (recipe.length < amountOfIngredients) {
      let number = numberGen(ingredientsLength - 1);
      let ingredient = ingredients[number];
      recipe.push(ingredient);
    }

    return recipe;
  },

  sendCards() {
    let cardsCopy = JSON.parse(JSON.stringify(storeData.cards));
    this.trigger(cardsCopy);
  }
});

export default GenerateSmoothieStore;
