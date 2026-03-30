const imageArr = [
  {
    src: "./Images/Animal-1-ray-hennessy.jpg",
    class: "animal",
    alt: "Animal-image",
  },
  { src: "./Images/Animal-2-Lion.jpg", class: "animal", alt: "Animal-image" },
  { src: "./Images/Animal-3-Dear.jpg", class: "animal", alt: "Animal-image" },
  { src: "./Images/Animal-4.jpg", class: "animal", alt: "Animal-image" },
  { src: "./Images/Bird-1.jpg", class: "bird", alt: "bird-image" },
  { src: "./Images/Bird-2.jpg", class: "bird", alt: "bird-image" },
  { src: "./Images/Bird-3.jpg", class: "bird", alt: "bird-image" },
  { src: "./Images/Bird-4.jpg", class: "bird", alt: "bird-image" },
  { src: "./Images/Nature-1.jpg", class: "nature", alt: "Nature-Image" },
  { src: "./Images/Nature-2.jpg", class: "nature", alt: "Nature-Image" },
  { src: "./Images/Nature-3.jpg", class: "nature", alt: "Nature-Image" },
];

const imageGallery = document.querySelector(".image-gallery");

function renderGallery(imageArr) {
  for (let object of imageArr) {
    let image = document.createElement("img");
    image.setAttribute("src", `${object.src}`);
    image.setAttribute("class", `${object.class}`);
    image.setAttribute("alt", `${object.alt}`);

    imageGallery.append(image);
  }
}

renderGallery(imageArr);

const listFilter = document.querySelector("ul");

listFilter.addEventListener("click", (event) => {
  imageGallery.innerHTML = "";

  let filteredArr = imageArr.filter((value, index) => {
    return value.class == event.target.className;
  });

  if (event.target.className == "all") {
    renderGallery(imageArr);
  } else if (event.target) {
    renderGallery(filteredArr);
  }
});
