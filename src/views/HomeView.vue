<template>
  <div class="home container">

    <div class="columns">
      <div class="column is-2">
        <div class="menu is-hidden-mobile">
          <router-link :to="{name: 'about'}">
            <div class="logo">
              <img src="favicon.ico" class="logo-image" alt="logo">
              <h1 class="logo-title">
                RPGAdventure.eu
              </h1>
            </div>

          </router-link>
            <router-link :to="{name: 'guide'}" class="m-2">
              <p>First steps guide</p>
            </router-link>

        </div>
      </div>
      <div class="column is-10 scrollable">
          <ArticleBox v-for="article in articles" :key="article.id"
          :date_created="humanDate(article.date_created)"
          :title="article.title"
          :subtitle="article.subtitle"
          :content="article.content"
          :image_url="article.image_url"
          :image_size="article.image_size"
          />


      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ArticleBox from './components/ArticleBox.vue'


// @ is an alias to /src
export default {
  name: 'HomeView',
  components: {
    ArticleBox,
  },
  data() {
    return {
      articles: [],
    }
  },
  beforeCreate() {
    axios({
      method: "GET",
      url: "home/articles/",
    }).then(response => {
      this.articles = response.data.articles;
    }).catch(error => {
      console.log(error);
    })
  },
  methods: {
    md(text) {
      return marked.parse(text)
    },
    humanDate(value){
      let the_date = new Date(value);
      return the_date.toLocaleDateString();
    }
  }
}
</script>

<style scoped>

.logo {
  width: 100%;
  max-width: 100px;
  display: block;
  transform: rotate(-10deg);
}
.logo:hover {
  transform: scale(1.2) rotate(0deg);
  transition: transform 0.2s;}

.logo-title {
  font-size: 1.3em;
  color: rgb(60, 99, 255);
}

.logo-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.menu {
  position: fixed;
}

</style>
