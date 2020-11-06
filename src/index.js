let addToy = false;
const toyList = document.querySelector("#toy-collection")
const toyEndpoint = "http://localhost:3000/toys"
const addToyForm = document.querySelector(".add-toy-form")


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  fetchToys()
  newToy()
  likeButtonIncrease()
});

function fetchToys () {
  fetch(toyEndpoint)
  .then(resp => resp.json())
  .then(toys => renderToy(toys))
}

function renderToy (toyData) {
  toyList.innerHTML = ''
  toyData.forEach( toy => {
    const toyCard = document.createElement('div')
    const toyName = document.createElement('h2')
    const toyImg = document.createElement('img')
    const toyLikes = document.createElement('p')
    const toyBtn = document.createElement('button')

    toyCard.setAttribute("class", "card")

    toyName.innerText = toy.name

    toyImg.setAttribute("class", "toy-avatar")
    toyImg.src = toy.image

    toyLikes.innerText = `${toy.likes} Likes`

    toyBtn.setAttribute("class", "like-btn")
    toyBtn.setAttribute("data-id",`${toy.id}`)
    toyBtn.innerText = "Like ♥"

    toyCard.append(toyName, toyImg, toyLikes, toyBtn)
    toyList.append(toyCard)

  })
}

function newToy () {
  addToyForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const newToyName = e.target[0].value
    const newToyImg = e.target[1].value

    const reqObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: newToyName,
        image: newToyImg,
        likes: 0
      })
    }

    fetch(toyEndpoint, reqObj)
    .then(resp => resp.json())
    .then(newToy => fetchToys())


  })
}

function likeButtonIncrease () {
  toyList.addEventListener("click", (e) => {
    if (e.target.className === "like-btn") {
      const currentLikes = e.target.previousSibling.innerText.split(' ')
      const toyID = e.target.dataset.id
      const updatedLikes = parseInt(currentLikes) + 1

      const editObj = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          id: toyID,
          likes: updatedLikes
        })
      }

      fetch(toyEndpoint + `/${toyID}`, editObj)
      .then(resp => resp.json)
      .then(updatedToy => fetchToys())
    }
  })
}

