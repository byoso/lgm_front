<template>

  <div v-if="collection !== null" class="rating-widget" :class="{'can-vote': !collection.voted}">
    <span>collection by {{charLimit(collection.author)}}</span>
    <br>
    <span v-for="star in starList" :key="star.id">
      <fa
        :icon="star.icon"
        class="star"
        :class="{'star-full': star.on, 'hoverable': !collection.voted}"
        @click="vote(star.id)"
      />
    </span>
    <span>{{ collection.rating }}({{ collection.votes_count }})</span>
    <span v-if="!collection.voted" class="ml-5">please rate it</span>

  </div>


</template>

<script>
import axios from 'axios'
import {toast} from 'bulma-toast';

export default {
  name: 'RatingWidget',
  data(){
    return {
      keys_base: 0,
      rating: 0,
      starList: [],
    }
  },
  props: [
    'collection',
  ],
  computed: {
    new_key () {
      this.keys_base += 1
      return this.keys_base
    },
  },
  beforeMount(){
    console.log('collection rating: ', this.collection.rating)
    console.log(this.collection)
    this.rating = Number(this.collection.rating)
    console.log(typeof(this.rating))
    this.get_stars()
  },
  methods: {
    charLimit(text) {
      if (!text){
        text = ''
      }
      if (text === 'undefined' | text === null){
        return ''
      }
      if (text.length <= 25) {
        return text;
      }
      return text.slice(0, 22) + '...';
    },
    get_stars () {
      console.log('rating: ', this.rating)
      for (var i=1;i<=5; i++){
        if (i <= this.rating) {
          console.log('i: ', i, 'rating :', this.rating)
          this.starList.push({icon:"star", id: i, on: true})
        } else if (i <= this.rating + 0.25){
          console.log('i: ', i, 'rating :', this.rating)
          this.starList.push({icon: "star", id: i, on: true})
        } else if (i <= this.rating + 0.75){
          console.log('i: ', i, 'rating :', this.rating)
          this.starList.push({icon: "star-half-stroke", id: i, on: true})
        } else {
          console.log('i: ', i, 'rating :', this.rating)
          this.starList.push({icon: "star", id: i, on: false})
        }
      }
      console.log(
        'rating: ', this.collection.rating,
        'starList: ', this.starList,

        )
    },
    vote(rate){
      if (this.collection.voted){
        return
      }
      axios({
        method: 'put',
        url: 'campains/ratings/',
        headers: {
          'Authorization': `Token ${this.$store.state.token}`
        },
        data: {
          rate: rate,
          collection_id: this.collection.id,
        }
      }).then(response => {
        let new_collection = response.data
        toast({
          message: 'Thank you for voting :)',
          type: 'is-success',
          position: 'bottom-right',
          dismissible: true,
          pauseOnHover: true,
          duration: 3000,

        })
        this.$emit('newCollection', new_collection)

      }).catch(error => {
        console.log(error)
      })
      console.log(this.starList)

    }
  }

}

</script>

<style scoped>

.rating-widget {
  padding: 2px;
  margin: 4px;
}

.star {
  color: grey;
}

.hoverable:hover {
  cursor: pointer;
  color: lightseagreen;
}


.star-full {
  color: rgb(255, 179, 0);
}


.can-vote {
  border: 2px solid lightseagreen;
  border-radius: 3px;
}

</style>