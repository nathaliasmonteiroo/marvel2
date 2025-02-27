const publicKey = '15cea5f8a59b71e7d636187219977051';
    const ts = '1';
    const hash = '62eb37bec60ace73acd483210bc3fc51';
    const endpoint = 'https://gateway.marvel.com/v1/public/characters';
    const heroLimit = 20;
    const visiblePages = 5;

    new Vue({
      el: '#app',
      data: {
        heroes: [],
        searchQuery: '',
        page: 0,
        totalPages: 0,
        errorMessage: '',
        loading: false
      },
      async created() {
        await this.fetchTotalHeroes();
        this.fetchHeroes();
      },
      methods: {
        async fetchTotalHeroes() {
          try {
            const url = `${endpoint}?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=1&offset=0`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao buscar o total de heróis');
            const data = await response.json();
            this.totalPages = Math.ceil(data.data.total / heroLimit);
          } catch (error) {
            console.error(error);
          }
        },
        async fetchHeroes() {
          this.errorMessage = '';
          this.loading = true;
          const offset = this.page * heroLimit;
          const query = this.searchQuery.trim();
          let url = `${endpoint}?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${heroLimit}&offset=${offset}`;
          
          if (query) {
            url += `&nameStartsWith=${encodeURIComponent(query)}`;
          }
          
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao buscar os heróis');
            const data = await response.json();
            
            if (data.data.results.length > 0) {
              this.heroes = data.data.results.map(hero => ({
                id: hero.id,
                name: hero.name,
                image: `${hero.thumbnail.path}.${hero.thumbnail.extension}`
              }));
            } else {
              this.heroes = [];
              this.errorMessage = 'Herói não encontrado';
            }
           
          } catch (error) {
            console.error(error);
            this.heroes = [];
            this.errorMessage = 'Erro ao buscar os heróis';
          } finally {
            this.loading = false;
          }
        },
        nextPage() {
          if (this.page < this.totalPages - 1) {
            this.page++;
            this.fetchHeroes();
          }
        },
        prevPage() {
          if (this.page > 0) {
            this.page--;
            this.fetchHeroes();
          }
        },
        goToPage(p) {
          this.page = p;
          this.fetchHeroes();
        }
      },
      computed: {
        visiblePageNumbers() {
          let start = Math.max(0, this.page - Math.floor(visiblePages / 2));
          let end = Math.min(this.totalPages, start + visiblePages);
          return Array.from({ length: end - start }, (_, i) => start + i);
        }
      }
    });