let featuredQueryBox = ['paneer', 'chicken', 'pizza', 'fish', 'momo', 'burger', 'noodles', 'mango', 'soup', 'salsa'];

let numFeaturedCard = 8;
let numRecipeCard = 15;

let API_KEY = '40698503668e0bb3897581f4766d77f9'
let API_ID = '900da95e';

let gramLen = 3;
let mgramLen = 6;

let divider1 = ` &blacktriangleright; `;
let divider2 = ` &SmallCircle; `;

let checkOnce = false;


async function recipeAPI(query, num)
{
    let res = await fetch(`https://api.edamam.com/search?app_id=${API_ID}&app_key=${API_KEY}&q=${query}&to=${num}`,
    {
        method : 'GET',
        headers : {
            'Content-type' : 'application/json'
        }
    });

    if(res.status != 200)
    {
        alert("Something went wrong");
        return;
    }

    let response = await res.json();
    // console.log(response.hits);
    return response.hits;
}

function initializeFeaturedCard()
{
    $('.featured-card-main-layer').show();
    $('.featured-card-ingredient-layer').hide();
    $('.featured-card-recipe-layer').hide();
}

function initializeRecipeCard()
{
    $('.recipe-front-layer').show();
    $('.recipe-ingredient-layer').hide();
}

function generateFeaturedCard(list, requiredLen)
{
    for(let i=0; i<requiredLen; i++)
    {
        let recipeLabel = list[i].recipe.label;
        let recipeImg = list[i].recipe.image;

        let ingredientString = "";
        let ingredientLen = list[i].recipe.ingredients.length;

        for(let j=0; j<ingredientLen; j++)
        {
            ingredientString += `
            <li>${list[i].recipe.ingredients[j].food}</li>
            `;
        }

        let recipeString = "";
        let recipeLen = list[i].recipe.ingredientLines.length;

        for(let j=0; j<recipeLen; j++)
        {
            recipeString += `
            <li>${list[i].recipe.ingredientLines[j]}</li>
            `;
        }

        let $featuredCard = $(`

        <div id="featured-${i}" class="featured-card">
            
            <h3 id="featured-main-${i}" class="featured-card-name featured-show">${recipeLabel}</h3>

            <div class="featured-card-main-layer  featured-card-inner-layer">
                
                <img src="${recipeImg}" alt=""  width="280px" height="300px" class="featured-card-img">
        
            </div>

            <div class="featured-card-ingredient-layer  featured-card-inner-layer"> 
            
                ${ingredientString}            
            
            </div>
            
            <div class="featured-card-recipe-layer  featured-card-inner-layer"> 
            
                ${recipeString}
                               
            </div>

            <div class="featured-card-btn-box">
                <button id="featured-ingredient-${i}" class="see-ingredients featured-show">See ingredients</button>
                <button id="featured-recipe-${i}" class="see-recipe featured-show">See Recipe</button>
            </div>

        </div>
        `);

        $($featuredCard).appendTo('.featured-food-container');
    }

}

function generateRecipeCard(list, requiredNum)
{
    for(let i=0; i<requiredNum && i<list.length; i++)
    {
        let healthLabelString = "";
        let healthLabelLen = list[i].recipe.healthLabels.length;

        for(let j=0; j<healthLabelLen; j++)
        { 
            healthLabelString += (` ${divider2} ${list[i].recipe.healthLabels[j]}`)  ;
        }

        let gramString = "";
        
        for(let j=0; j<gramLen; j++)
        {
            let k = Math.floor(list[i].recipe.digest[j].total);
            
            if(list[i].recipe.digest[j].unit == 'g')
            {
                gramString += 
                `<li>
                <p><span class="element-name">${list[i].recipe.digest[j].label}</span><span class="element-quantity">${k} g</span></p>
                </li>`;
            }
        }
        
        let mgramString = "";

        for(let j=3; j<3+mgramLen; j++)
        {
            let k = Math.floor(list[i].recipe.digest[j].total);

            if(list[i].recipe.digest[j].unit == 'mg')
            {
                mgramString += 
                `<li>
                    <p><span class="element-name">${list[i].recipe.digest[j].label}</span><span class="element-quantity">${k} mg</span></p>
                </li>`;
            }
        }

        let ingredientString = "";
        let ingredientLen = list[i].recipe.ingredientLines.length;

        for(let j=0; j<ingredientLen; j++)
        {
            ingredientString += `<li>${list[i].recipe.ingredientLines[j]}</li>`;
        }


        let $recipeCard = $(`
        <div id="recipe-${i}" class="recipe-card">

            <h3 class="recipe-label"> ${list[i].recipe.label} <span id="recipe-swap-${i}" class="swap-layer"><i id="recipe-swap-${i}" class="bi bi-arrow-right"></i></span></h3>

            <div class="recipe-front-layer">
                <div class="recipe-upper">
                    <div class="recipe-img">
                        <img src="${list[i].recipe.image}" alt="" width="100px">
                    </div>
                    <div class="recipe-details">
                        ${healthLabelString}
                    </div>
                </div>

                <div class="recipe-lower">

                    <div class="yield-box">
                        <h4>${list[i].recipe.yield} servings</h4>

                        <h2>${Math.floor(list[i].recipe.totalNutrients.ENERC_KCAL.quantity)} ${list[i].recipe.totalNutrients.ENERC_KCAL.unit}</h2>
                    </div>

                    <div class="gram-box">
                        ${gramString}

                    </div>
                    <div class="mg-box">
                    
                        ${mgramString}

                    </div>
                </div>
            </div>

            <div class="recipe-ingredient-layer">
                <!-- Ingredient list -->
                ${ingredientString}
            </div>  

        </div>`);

        $($recipeCard).appendTo('.recipe-container');
    }
}

function updateFeatureCard(e)
{
    let btnId = e.target.id;
    // console.log(btnId);
    // console.log(btnId);
    // console.log('hi done');
    
    let featuredId = btnId.split('-')[2];
    let featuredSection = btnId.split('-')[1];
    
    $(`#featured-${featuredId}>.featured-card-inner-layer`).hide();
    $(`#featured-${featuredId}>.featured-card-${featuredSection}-layer`).show();
}

function updateRecipeCard(e)
{
    let swapId = e.target.id;
    let id = swapId.split('-')[2];
    // console.log(id);
    $(`#recipe-${id}>.recipe-front-layer`).toggle();
    $(`#recipe-${id}>.recipe-ingredient-layer`).toggle();
}

async function getFeaturedFood()
{
    $('.featured-loader').show();

    let foodList = [];
    for(let i=0; i<numFeaturedCard; i++)
    {
        try
        {
            let food = await recipeAPI(featuredQueryBox[i], 2);
            foodList.push(food[1]);
        }
        catch
        {
            window.location.reload();
        }
    }

    generateFeaturedCard(foodList, numFeaturedCard);
    // console.log(foodList);
    initializeFeaturedCard();
    $('.featured-loader').hide();

    let featuredShow = document.querySelectorAll('.featured-show');  
    featuredShow.forEach((el)=>el.addEventListener('click', e =>{updateFeatureCard(e)}));  
}

async function getSearchedFood(query, num)
{
    $('.recipe-loader').show();
    $('.error-comments').text('');
    
    let recipeList = await recipeAPI(query, num);

    (recipeList.length != 0) ? generateRecipeCard(recipeList, num) : $('.error-comments').text('Invalid Search');

    initializeRecipeCard();
    
    $('.recipe-loader').hide();

    let swapLayer = document.querySelectorAll('.swap-layer');  
    swapLayer.forEach((el)=>el.addEventListener('click', e =>{updateRecipeCard(e)}));
    
}

function startSearching()
{
    $('.not-searched').hide(); 
    let val = $('.search-input').val().trim();

    if(val != '')
    {
        if(checkOnce == true)
        {
            $('.recipe-container').text('');            
        }
        getSearchedFood(val, numRecipeCard);
        checkOnce = true;
    }
    else
    {
        // console.log("empty string", checkOnce);
        if(checkOnce == false)
        {
            $('.not-searched').show();
        } 
    }
    // console.log(val);
}

$(document).ready(()=>{  
    
    // getFeaturedFood();
    $('.recipe-loader').hide();

    let featuredShow = document.querySelectorAll('.featured-show');  
    featuredShow.forEach((el)=>el.addEventListener('click', e =>{updateFeatureCard(e)})); 
    

    $('.search-btn').click(()=>{ startSearching() });
    $(document).keypress((e)=>{if(e.originalEvent.key == "Enter"){startSearching();}});
    
})
