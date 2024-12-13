// API URL
const apiURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

const res = document.getElementById("mealResults");
const block = document.getElementById("block");

res.style.display = "none";
block.style.display = "none";

// Функция отправки запроса при изменении текста в поле ввода
document.getElementById('mealSearch').addEventListener('keydown', async (event) => {
    if(event.key === 'Enter') {
        block.innerHTML = "";
        block.style.display = "none";
        const query = document.getElementById('mealSearch').value;

        if (query) {
            const response = await fetch(apiURL + query);
            if (response.ok) {
                const data = await response.json();
                displayMeals(data.meals);
            } else {
                alert('Ошибка при получении данных. Попробуйте снова.');
            }
        } else {

            var foodCards = document.getElementById('cards');
            foodCards.innerHtml = '';
        }
    }
});

// Функция для отображения карточек еды
function displayMeals(meals) {
    res.style.display = "block";
    const resultsContainer = document.getElementById('cards');
    resultsContainer.innerHTML = ''; // Очищаем результаты перед отображением новых

    if (meals) {
        meals.forEach(meal => {
            const mealCard = `
                <div class="food-card col-md-4" onclick="viewRecipe(${meal.idMeal})">
                    <div class="food-card-img">
                      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    </div>
                    <div class="food-card-content">
                      <div class="food-card-title">
                        <span>${meal.strMeal}</span>
                      </div>
                      <div class="food-card-description">
                        <span>Category: ${meal.strCategory}</span>
                      </div>
                    </div>
                  </div>`;
            resultsContainer.innerHTML += mealCard;
        });
    } else {
        resultsContainer.innerHTML = '<p class="text-center">Рецепты не найдены. Попробуйте другой запрос.</p>';
    }
}

// Функция для отображения подробной информации о рецепте
function viewRecipe(mealId) {
    const apiURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    res.style.display = "none";
    block.style.display = "block";
    document.getElementById('mealSearch').value = '';
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                const meal = data.meals[0];
                const mealDetails = `
                    <h3 class="block-title col-md-12">${meal.strMeal}</h3>
                    <div class="body-container row col-md-12">
                  
                      <div class="left-side col-md-4">
                        <img src="${meal.strMealThumb}" class="photo" alt="${meal.strMeal}">
                      </div>
                
                      <div class="right-side col-md-6">
                        <h3 class="h3 food-ingr-title">Ingredients</h3>
                        <ul class="modern-list">
                            ${getIngredients(meal)}
                          
                        </ul>
                      </div>
                    </div>
                
                    <hr class="hr-line">
                
                    <div class="description col-md-12">
                      <div class="description-title">
                        Описание
                      </div>
                   
                      <div class="description-text">
                        ${meal.strInstructions}
                      </div>
                    </div>`;
           block.innerHTML += mealDetails;
            } else {
                block.innerHTML = '<p class="text-center">Рецепт не найден.</p>';
            }
        })
        .catch(error => {
            block.innerHTML = '<p class="text-center">Ошибка при получении данных.</p>';
        });

}

// Функция для формирования списка ингредиентов
function getIngredients(meal) {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients += `<li class="modern-list-item">${measure} ${ingredient}</li>`;
        }
    }
    return ingredients;
}