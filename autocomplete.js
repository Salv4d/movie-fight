const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" type="text" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
  `;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (event) => {
    const searchTerm = event.target.value;

    if (!searchTerm) {
      dropdown.classList.remove("is-active");
      return;
    }

    const items = await fetchData(searchTerm);

    resultsWrapper.innerHTML = "";

    items.forEach((item) => {
      const option = document.createElement("a");
      option.innerHTML = "";
      option.classList.add("dropdown-item");

      option.innerHTML = renderOption(item);

      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);

        onOptionSelect(item);
      });

      resultsWrapper.append(option);
    });

    dropdown.classList.add("is-active");
  };

  input.addEventListener("input", debounce(onInput, 700));

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
