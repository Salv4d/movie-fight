it('Show autocomplete', () => {
    createAutoComplete({
        root: document.querySelector('#target'),
        fetchData() {
            return [
                { Title: 'Avengers' },
                { Title: 'Batman' },
                { Title: 'Justice League' }
            ]
        }
    }), 
    renderOption(movie) {
        return movie.Title
    }
})