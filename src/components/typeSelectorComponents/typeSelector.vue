<template>
  <div class="page-wrapper">
    <div class="header">
      <h1>ជ្រើសរើសប្រភេទនៃការវាយ</h1>
      <!-- <navBar class="nav" /> -->
    </div>

    <div class="type-wrapper">
      <div class="cards-wrapper">
        <button
          class="card"
          ref="word"
          @click="
            $store.dispatch('wordType1');
            $store.dispatch('choseWord');
            focusWord();
          "
        >
          <svg
            class="check"
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 620.86 620.83"
          >
            <path
              class="cls-1"
              d="M960.55,230.08c171.42,0,310.42,139.09,310.38,310.47S1131.84,851,960.45,850.92,650,711.83,650.07,540.45,789.16,230,960.55,230.08Z"
              transform="translate(-650.07 -230.08)"
            />
            <path
              class="cls-2"
              d="M927.54,624.69c2.07-1.4,3-3.64,4.21-5.56q63.06-96.27,126-192.59c7.47-11.41,19-16.21,30.82-13,18.13,4.95,25.76,25.4,15.3,41.59-14.72,22.79-29.68,45.43-44.53,68.13q-51.95,79.38-103.86,158.77c-7.54,11.55-26.64,16.76-39,5.93-19.57-17.08-38.39-35-57.49-52.63-10.41-9.6-20.9-19.12-31.1-28.94a26.7,26.7,0,0,1-5.75-30.8A27.14,27.14,0,0,1,848.91,560c7.34.48,13.16,4.07,18.44,9q28.71,26.75,57.56,53.32C925.76,623.12,926.64,623.89,927.54,624.69Z"
              transform="translate(-650.07 -230.08)"
            />
          </svg>
          <h2>ពាក្យ</h2>
        </button>
        <button
          class="card"
          ref="article"
          @click="
            $store.dispatch('wordType2');
            $store.dispatch('choseArticle');
            focusArticle();
          "
        >
          <svg
            class="check"
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 620.86 620.83"
          >
            <path
              class="cls-1"
              d="M960.55,230.08c171.42,0,310.42,139.09,310.38,310.47S1131.84,851,960.45,850.92,650,711.83,650.07,540.45,789.16,230,960.55,230.08Z"
              transform="translate(-650.07 -230.08)"
            />
            <path
              class="cls-2"
              d="M927.54,624.69c2.07-1.4,3-3.64,4.21-5.56q63.06-96.27,126-192.59c7.47-11.41,19-16.21,30.82-13,18.13,4.95,25.76,25.4,15.3,41.59-14.72,22.79-29.68,45.43-44.53,68.13q-51.95,79.38-103.86,158.77c-7.54,11.55-26.64,16.76-39,5.93-19.57-17.08-38.39-35-57.49-52.63-10.41-9.6-20.9-19.12-31.1-28.94a26.7,26.7,0,0,1-5.75-30.8A27.14,27.14,0,0,1,848.91,560c7.34.48,13.16,4.07,18.44,9q28.71,26.75,57.56,53.32C925.76,623.12,926.64,623.89,927.54,624.69Z"
              transform="translate(-650.07 -230.08)"
            />
          </svg>
          <h2>ឣត្ថបទ</h2>
        </button>
      </div>
    </div>
    <div class="button-wrapper">
      <button @click="$router.push('/timeSelector')">ត្រឡប់ក្រោយ</button>
      <button
        class="continue"
        :disabled="!isTypeSelected"
        @click="changePage()"
        :class="{ enable: isTypeSelected }"
      >
        ចាប់ផ្តើម
      </button>
    </div>
  </div>
</template>

<script>
import store from "@/store/index";

export default {
  name: "typeSelector",
  components: {
    // navBar,
  },
  // data() {
  //   return {
  //     isTypeSelected: false,
  //   };
  // },

  created() {
    this.$store.dispatch("toggleActivePage2");
    // this.checkFocus();
  },

  computed: {
    isTypeSelected: function () {
      return this.$store.state.typeOfWord;
    },
  },

  mounted() {
    this.set_focus();
    const vm = this;
    const card = document.querySelector(".card");
    window.addEventListener("focusin", function () {
      // vm.isTypeSelected = true;
      vm.$store.dispatch("setType");
      console.log("testing for deployment");
    });
    const moveon = document.querySelector(".continue");
    let isClicked = false;
    moveon.addEventListener("mousedown", function () {
      isClicked = true;
    });
    const page = document.querySelector(".page-wrapper");
    page.addEventListener("focusout", function () {
      if (isClicked === false) {
        // vm.isTypeSelected = false;
        vm.$store.dispatch("unSetType");
      }
    });
  },

  destroyed() {
    this.$store.dispatch("toggleActivePage2");
  },
  methods: {
    // checkFocus() {
    //   setInterval(() => {
    //     if ($(".card").is(":focus")) {
    //       this.isTypeSelected = true;
    //       this.$store.dispatch("setType");
    //     } else {
    //       this.isTypeSelected = false;
    //       this.$store.dispatch("unSetType");
    //     }
    //   }, 500);
    // },
    changePage() {
      if (this.$store.state.wordType === 1) {
        this.$router.push("/typingWord");
      } else {
        this.$router.push("/typingArticle");
      }
    },

    set_focus() {
      if (this.$store.state.isWord === true) {
        this.$refs.word.focus();
      }

      if (this.$store.state.isArticle === true) {
        this.$refs.article.focus();
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Kantumruy:wght@700&display=swap");
@import url(//db.onlinewebfonts.com/c/56f089d4a1aecfe1368a63828e078332?family=Khmer+UI);

/* GLOBAL */
* {
  overflow: visible !important;
}

h1 {
  font-family: "Kantumruy", sans-serif;
  font-size: 3rem;
}

h2 {
  font-family: "Kantumruy", sans-serif;
  font-size: 3rem;
}
/* END OF GLOBAL */

/* CLASS */
.enable {
  background-color: #005bb8;
  color: white;
}

.button-wrapper {
  height: 13rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-wrapper button {
  height: 4rem;
  width: 12rem;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  outline: none;
  font-family: "Kantumruy", sans-serif;
  font-size: 1.5rem;
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  width: 100vw;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 10rem;
}

.nav {
  margin-bottom: 9rem;
}

.type-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 3rem;
  height: 20rem;
}

.cards-wrapper {
  display: grid;
  justify-content: center;
  grid-template-columns: auto auto;
  margin: 1rem;
  width: 60%;
  position: relative;
}

.text-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -3rem;
}

.card-text {
  display: grid;
  justify-content: center;
  grid-template-columns: auto auto auto;
  margin: 1rem;
  width: 60%;
  position: sticky;
}

.card-text h3 {
  margin: 2rem;
  height: 15rem;
  width: 15rem;
  align-items: center;
}

.card {
  margin: 2rem;
  background-color: white;
  transition: 0.6s;
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
    0 15px 40px rgba(166, 173, 201, 0.2);
  border-radius: 50%;
  height: 15rem;
  width: 15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
  outline: none;
  cursor: pointer;
  position: relative;
}

.card:focus {
  border: 6px solid #005bb8;
  height: 20rem;
  width: 20rem;
  transition: 0.6s;
}

.check {
  position: absolute;
  float: right;
  top: 4rem;
  left: 13.5rem;
  height: 2rem;
  visibility: hidden;
}

.card:focus .check {
  visibility: visible;
  left: 17.5rem;
  transition: ease 0.6s;
}

.cls-1 {
  fill: #005bb8;
}

.cls-2 {
  fill: #f6f6f6;
}
/* END OF CLASS */

/* MEDIA QUERIES */
@media screen and (max-width: 920px) and (min-width: 720px) {
  .card {
    height: 12rem;
    width: 12rem;
  }
  .card:focus {
    height: 15rem;
    width: 15rem;
  }
  .check {
    top: 3rem;
    left: 11.2rem;
  }
  .card:focus .check {
    left: 12.8rem;
  }
  .button-wrapper {
    margin-top: -3rem;
  }
}

@media screen and (max-width: 720px) and (min-width: 660px) {
  .card {
    height: 10rem;
    width: 10rem;
    margin-top: -1rem;
  }
  .card:focus {
    height: 12rem;
    width: 12rem;
  }
  .check {
    top: 2.5rem;
    left: 9.2rem;
  }
  .card:focus .check {
    left: 10.2rem;
  }
  .button-wrapper {
    margin-top: -3rem;
  }
}

@media screen and (max-width: 660px) and (min-width: 580px) {
  .card {
    height: 11.5rem;
    width: 11.5rem;
    margin-top: -1rem;
  }
  .card:focus {
    height: 14rem;
    width: 14rem;
  }
  .check {
    top: 1.8rem;
    left: 10.5rem;
  }
  .card:focus .check {
    left: 11.3rem;
  }
  .button-wrapper {
    margin-top: -5rem;
  }
}

@media screen and (max-width: 580px) and (min-width: 492px) {
  .header {
    display: flex;
    align-items: center;
    margin-bottom: -2rem;
  }
  .header > h1 {
    font-size: 2.5rem;
  }
  .card {
    height: 10.5rem;
    width: 10.5rem;
    margin-top: -2rem;
  }
  .card:focus {
    height: 13rem;
    width: 13rem;
  }
  .check {
    height: 1.7rem;
    top: 1.5rem;
    left: 9rem;
  }
  .card:focus .check {
    left: 10.5rem;
  }
  .button-wrapper {
    margin-top: -5rem;
  }
  .type-wrapper {
    margin-top: 1rem;
  }
}
/* END OF MEDIA QUERIES */
</style>
