import axios from "axios";

axios.defaults.baseURL = 'https://pixabay.com/api/'

export default class FetchApi {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    
    async fetchImages() {
        
        console.log(this)

        const params = {
            key: '28536674-04bfab5710134f09834b1ff38',
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: 40
    }
        // const response = await axios.get(`?key=${params.key}&q=${params.q}&image_type=${params.image_type}&orientation=${params.orientation}&safesearch=${params.safesearch}&page=${params.page}&per_page=${params.per_page}`)
const response = await axios.get('/',{params})
        return response.data;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
    
    get currentPage() {
        return this.page;
    }
    set currentPage(newPage) {
        this.page = newPage;
    }
}
