const autoCompleteConfig = (side) => ({
  root: document.querySelector(`#${side}-autocomplete`),
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

    return `
      <img src="${imgSrc}" / >
      ${movie.Title}
      (${movie.Year})
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    const summary = document.querySelector(`#${side}-summary`);
    onMovieSelect(movie, summary, side);
  },
  async fetchData(searchTerm) {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: "c2637a66",
        s: searchTerm.trim(),
      },
    });

    if (response.data.Error) {
      console.log("Not found any movie");
      return [
        {
          Title: "Nenhum filme correspondente encontrado",
          Poster: "N/A",
        },
      ];
    }

    return response.data.Search;
  },
});

createAutoComplete(autoCompleteConfig("left"));
createAutoComplete(autoCompleteConfig("right"));

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "c2637a66",
      i: movie.imdbID,
    },
  });

  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    const leftStatValue = parseInt(leftStat.dataset.value);
    const rightStatValue = parseInt(rightStat.dataset.value);
    console.log(leftStatValue, rightStatValue);

    if (rightStatValue > leftStatValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

const parseNumber = (num) => {
  if (num) {
    numString = num.replace(/[^\d.]/g, "");
  } else {
    return 0;
  }

  if (numString % 1 === 0) {
    if (numString) return parseInt(numString);

    return 0;
  }

  return parseFloat(numString);
};

const movieTemplate = (movieData) => {
  const boxOffice = parseNumber(movieData.BoxOffice);
  const metascore = parseNumber(movieData.Metascore);
  const imdbRating = parseNumber(movieData.imdbRating);
  const awards = movieData.Awards.split(" ").reduce((prev, word) => {
    let value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    }
    return prev + value;
  }, 0);

  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieData.Poster}" />
      </p>
    </figure>

    <div class=""media-content>
      <div class="content">
        <h1>${movieData.Title}</h1>
        <h4>${movieData.Genre}</h4>
        <p>${movieData.Plot}</p>
      </div>
    </div>
  </article>

  <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieData.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article data-value=${boxOffice} class="notification is-primary">
    <p class="title">${movieData.BoxOffice}</p>
    <p class="subtitle">BoxOffice</p>
  </article>
  <article data-value=${metascore} class="notification is-primary">
    <p class="title">${movieData.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieData.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  `;
};
