const searchInput = document.getElementById("search-input"),
    searchBtn = document.getElementById("search-btn"),
    randomBtn = document.getElementById("random-btn"),
    resultText = document.getElementById("result-text"),
    mealsContainer = document.querySelector(".meals-container"),
    closeIcon = document.getElementById("close-icon"),
    containerPopup = document.querySelector(".container-popup"),
    mealsDivs = document.querySelectorAll(".meal"),
    containerPopupWrapper = document.querySelector(".container-popup-wrapper");

closeIcon.addEventListener("click", () => {
    containerPopup.style.display = "none";
});

searchBtn.addEventListener("click", () => {
    mealsContainer.innerHTML = "";
    let searchInputValue = searchInput.value;
    // proveravam da li je input prazan
    if (searchInputValue.trim()) {
        fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputValue}`
        )
            .then((data) => data.json())
            .then((meals) => {
                if (meals.meals === null) {
                    resultText.innerHTML = "This search doesn't have results";
                    resultText.classList.add("show");
                } else {
                    resultText.innerHTML = `Results for '${searchInputValue}' are: `;
                    resultText.classList.add("show");
                    console.log(meals);
                    meals.meals.forEach((meal) => {
                        const mealDiv = document.createElement("div");
                        mealDiv.setAttribute("mealId", meal.idMeal);
                        mealDiv.className = "meal";
                        mealDiv.innerHTML = `
                        <img
                        src="${meal.strMealThumb}"
                        class="meal-img"
                    />
                    <p class="meal-title">${meal.strMeal}</p>`;
                        mealsContainer.appendChild(mealDiv);
                        mealDiv.addEventListener("click", mealHandler);
                    });
                }
            });
    } else {
        alert("You must enter something in the search box");
    }
});

mealsDivs.forEach((meal) => {});

function mealHandler() {
    const mealId = this.getAttribute("mealid");

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then((data) => data.json())
        .then((meal) => {
            let mealTitle = meal.meals[0].strMeal || "No title";
            let mealCategory = meal.meals[0].strCategory || "No category";
            let mealOrigin = meal.meals[0].strArea || "Unknown origin";
            let mealInstructions = meal.meals[0].strInstructions || "";
            let ingredientsArray = [];
            let measuresArray = [];
            for (let mealProperty in meal.meals[0]) {
                if (
                    mealProperty.includes("strMeasure") &&
                    meal.meals[0][mealProperty].trim() !== ""
                ) {
                    ingredientsArray.push(meal.meals[0][mealProperty]);
                }

                if (
                    mealProperty.includes("strIngredient") &&
                    meal.meals[0][mealProperty].trim() !== ""
                ) {
                    measuresArray.push(meal.meals[0][mealProperty]);
                }
            }
            containerPopup.style.display = "block";
            containerPopupWrapper.innerHTML = `<img
        src="${meal.meals[0].strMealThumb}"
        class="meal-popup-img" />
    <h2 class="meal-popup-title">${mealTitle}</h2>
    <p class="meal-popup-category">Category: ${mealCategory}</p>
    <p class="meal-popup-country">Origin: ${mealOrigin}</p>
    <p class="meal-popup-instructions">${mealInstructions}</p>
    <h3 class="ingredients-title">Ingredients: </h3>
    `;
            const ul = document.createElement("ul");
            ul.className = "meal-popup-ingredients";
            for(let i = 0; i < ingredientsArray.length;i++){
                const li = document.createElement("li");
                li.className = "meal-popup-ingredient";
                li.innerHTML = `${measuresArray[i]} ${ingredientsArray[i]}`;
                ul.appendChild(li);
            }
            console.log(measuresArray);
            console.log(ingredientsArray);
            containerPopupWrapper.appendChild(ul);
        });
}
