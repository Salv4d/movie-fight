const waitFor = (selector) => {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        resolve();
      }
    }, 100);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      reject();
    }, 2000);
  });
};

beforeEach(() => {
  document.querySelector("#target").innerHTML = "";

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
});

it("Dropdown starts closed", () => {
  const dropdown = document.querySelector(".dropdown");

  expect(dropdown.className).not.to.include("is-active");
});

it("After searching, dropdown open up", async () => {
  const input = document.querySelector("input");

  input.value = "Justice League";

  input.dispatchEvent(new Event("input"));

  await waitFor(".dropdown-item");

  const dropdown = document.querySelector(".dropdown");
  expect(dropdown.className).to.include("is-active");
});

it("After searching, displays results", async () => {
  const input = document.querySelector("input");

  input.value = "Justice League";

  input.dispatchEvent(new Event("input"));

  await waitFor(".dropdown-item");

  const items = document.querySelectorAll(".dropdown-item");

  expect(items.length).to.equal(3);
});
