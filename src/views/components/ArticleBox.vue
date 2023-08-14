<template>
<div class="box">

  <div class="columns">
    <div class="column is-9" id="right-col">
    <p class="is-pulled-right">{{ date_created }}</p>
    <h1 class="title">{{ title }}</h1>
    <h2 class="subtitle">{{ subtitle }}</h2>
      <div class="content" v-html="render">
      </div>
    </div>
    <div class="column is-3">
      <img v-if="image_url != ''" :src="image_url" id="image" alt="article-image" class="article-image">
      <img v-else src="img/article-dflt-img.jpg" alt="article-noimage" class="article-noimage is-pulled-right is-hidden-mobile">
    </div>
  </div>
</div>


</template>

<script>

export default {
  name: 'ArticleBox',
  props: [
    'date_created',
    'title',
    'subtitle',
    'content',
    'image_url',
    'image_size',
  ],
  computed: {
    render() {
      return marked.parse(this.content)
    },
  },
  mounted() {
    let image = document.getElementById('image')
    if (image) {
      image.style.height = this.image_size + '%'
    }
  },
}
</script>

<style>
.content {
  word-break: keep-all !important;
  text-align: justify;
}

.subtitle {
  color: #7a7a7a;
  font-weight: bold;
}

.article-img {
  max-height: 200px;
  object-fit: contains;
}

.article-noimage {
  height: 100px;
  object-fit: contains;
}
.article-box {
  margin-bottom: 20px;
  background-color: white;
  border-radius: 10px;
}

</style>