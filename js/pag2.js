const publicKey = '15cea5f8a59b71e7d636187219977051';
const ts = '1';
const hash = '62eb37bec60ace73acd483210bc3fc51';
const endpoint = 'https://gateway.marvel.com/v1/public/characters';

const urlParams = new URLSearchParams(window.location.search);
const heroi = urlParams.get('id');
const heroUrl = `${endpoint}?id=${heroi}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;

new Vue({
    el: '#app',
    data: {
        heroName: 'Nome do Herói',
        heroDescription: 'Descrição do herói',
        heroImage: '',
        accordions: {},
        activeAccordion: null
    },
    created() {
        this.fetchHeroData();
    },
    methods: {
        fetchHeroData() {
            fetch(heroUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro ao buscar dados para ${heroi}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const heroData = data.data.results[0];
                    if (heroData) {
                        this.heroImage = `${heroData.thumbnail.path}.${heroData.thumbnail.extension}`;
                        this.heroName = heroData.name;
                        this.heroDescription = heroData.description || "Descrição não disponível.";
                        this.populateAccordions(heroData);
                    }
                })
                .catch(error => console.error(`Erro ao buscar os dados da Marvel para ${heroi}:`, error));
        },
    
        populateAccordions(heroData) {
            if (heroData.comics.available > 0) {
                this.$set(this.accordions, 'Comics', heroData.comics.items.map(item => item.name).join('<br>'));
            }
    
            if (heroData.events.available > 0) {
                this.$set(this.accordions, 'Events', heroData.events.items.map(item => item.name).join('<br>'));
            }
    
            if (heroData.series.available > 0) {
                this.$set(this.accordions, 'Series', heroData.series.items.map(item => item.name).join('<br>'));
            }
    
            if (heroData.stories.available > 0) {
                this.$set(this.accordions, 'Stories', heroData.stories.items.map(item => item.name).join('<br>'));
            }
        },
    
        toggleAccordion(title) {
            if (this.activeAccordion === title) {
                this.activeAccordion = null;
            } else {
                this.activeAccordion = title;
            }
        }
    }
    
});
