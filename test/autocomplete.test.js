it("Show autocomplete", () => {
  createAutoComplete({
    root: document.querySelector("#target"),
    fetchData() {
      return [
        { Title: "Avengers" },
        { Title: "Justice League" },
        { Title: "A Clockwork Orange" },
      ];
    },
    renderOption(movie) {
      return movie.Title;
    },
  });

  const dropdown = document.querySelector(".dropdown");

  expect(dropdown.className).not.to.include("is-active");
});
