const showRecipe = async function () {
  try {
    const res = await fetch(
      // "https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886"
      "https://forkify-api.herokuapp.com/api/v2/recipes/664c8f193e7aa067e94e8a12"
    );
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);
  } catch (err) {
    alert(err);
  }
};

showRecipe();
