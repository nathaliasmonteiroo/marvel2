const publicKey = '15cea5f8a59b71e7d636187219977051';
const ts = '1';
const hash = '62eb37bec60ace73acd483210bc3fc51';
const endpoint = 'https://gateway.marvel.com/v1/public/characters';
const heroLimit = 20;

new Vue({
  el: '#app',
  data: {
    heroes: [] 
  },
  created() { //é o que faz quando a instância do Vue é criada
    this.fetchHeroes();
  },
  methods: { //define os métodos que a instância do Vue pode usar
    async fetchHeroes() {
      const url = `${endpoint}?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${heroLimit}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erro ao buscar dados dos heróis');
        }

        const data = await response.json(); //não entendi
        this.heroes = data.data.results.map(hero => ({
          id: hero.id,
          name: hero.name,
          image: `${hero.thumbnail.path}.${hero.thumbnail.extension}`
        })); 
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }
  }
});
