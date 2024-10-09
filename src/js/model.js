import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Fetches recipe data from the API based on a given recipe ID.
 *
 * @async
 * @function loadRecipe
 * @param {string} id - The recipe ID used to fetch the data.
 * @throws Will throw an error if the recipe cannot be fetched.
 * @returns {Promise<void>} A promise that resolves when the recipe data is successfully loaded.
 */
export const laodRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches a list of recipes based on a search query.
 *
 * @async
 * @function searchRecipes
 * @param {string} query - The search term to look for recipes.
 * @throws Will throw an error if no recipes are found or there is an API issue.
 * @returns {Promise<void>} A promise that resolves when the search results are successfully loaded.
 */
export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    console.log(state.search.results);
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

/**
 * Updates the number of servings for the currently loaded recipe.
 *
 * @function updateServings
 * @param {number} newServings - The new number of servings to set.
 * @throws Will throw an error if the new servings value is invalid.
 * @returns {void}
 */

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ingredients) => {
    ingredients.quantity =
      (ingredients.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

/**
 * Saves the current list of bookmarked recipes to localStorage.
 *
 * @function persistBookmarks
 * @returns {void}
 */
const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

/**
 * Adds a recipe to the list of bookmarks.
 *
 * @function addBookmark
 * @param {Object} recipe - The recipe object to be bookmarked.
 * @throws Will throw an error if the recipe is invalid or already bookmarked.
 * @returns {void}
 */
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

/**
 * Removes a recipe from the list of bookmarks.
 *
 * @function deleteBookmark
 * @param {string} id - The ID of the recipe to be removed from bookmarks.
 * @throws Will throw an error if the recipe is not found in bookmarks.
 * @returns {void}
 */
export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please use the correct format :)"
          );
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
