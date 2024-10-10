# Forkify

Forkify is a web application for searching recipes using the **Forkify** API. Users can search for recipes, add their own, adjust the number of servings, and save favorite dishes.

## Demo

[Live Demo](https://filonenkodima.github.io/Forkify/)  
Here is a link to the live version of the application.
![](demo.gif)

## Technologies

The project is built using the following technologies:

- **HTML** for the page structure.
- **CSS (Sass)** for styling.
- **JavaScript (ES6+)** for logic and user interactions.
- **Parcel** as the build tool.
- **Forkify API** for fetching recipe data.

## Features

- Search recipes by name.
- View detailed information about recipes.
- Add ingredients to a shopping list.
- Adjust the number of servings in a recipe.
- Save favorite recipes in the browser’s local storage.

## Installation

To run the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/FilonenkoDima/Forkify.git
   ```
2. Navigate to the project directory:
   ```
   cd Forkify
   ```
3. Install dependencies:

   ```
   npm install
   ```

4. Start the local server:

   ```
   npm start
   ```

## Project Structure

```
Forkify/
│
├── src/             # Source code of the project
│   ├── img/         # Images
│   ├── js/          # JavaScript files
│   └── scss/        # Styles (Sass)
│
├── .gitignore       # Ignores unnecessary files in Git
├── index.html       # Main HTML file
├── package.json     # Project configuration and dependencies
└── README.md        # Project description
```

## API

The application uses the Forkify API to fetch recipes. API documentation is available at [Forkify API](https://forkify-api.herokuapp.com/v2).
