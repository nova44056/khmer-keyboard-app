<template>
  <main>
    <div class="col" v-bind:class="{ transparent2: result }">
      <div class="col1">
        <!-- timerstats -->
        <div class="lottie">
          <lottie-player
            id="lottie"
            src="https://assets10.lottiefiles.com/packages/lf20_AMwwvI.json"
            background="transparent"
            speed="0.8"
            style="width: 100px; height: 110px"
            loop
            autoplay
          ></lottie-player>
          <!-- <span>{{ convertToKhmerNum(seconds) }} វិនាទី​</span> -->
          <countdown
            :time="this.time * 60000"
            @end="endGame"
            ref="countdown"
            :auto-start="false"
          >
            <template slot-scope="props"
              >{{ convertToKhmerNum(props.minutes) }} នាទី
              {{ convertToKhmerNum(props.seconds) }}​​ វិនាទី</template
            >
          </countdown>
        </div>
        <div class="lottie">
          <lottie-player
            id="score-lottie"
            src="https://assets4.lottiefiles.com/packages/lf20_Ex9JsF.json"
            background="transparent"
            speed="1"
            style="width: 100px; height: 120px"
            autoplay
          ></lottie-player>
          <span>{{ convertToKhmerNum(score) }}</span>
        </div>
              <navBar class="nav"/>

      </div>
      <div class="box">
        <div class="wordsWrap">
          <p class="words">
            <span class="spans" v-for="span in spans" :key="span.id">{{
              span
            }}</span>
          </p>
        </div>
        <div class="buffer">
          <span>{{ buffer }}</span>
        </div>
      </div>

      <typingWordKeyboard />
    </div>

    <!-- <keyboardMessage v-bind:class="{ showError: !$store.state.isKhmer }" /> -->
    <result :class="{ showError: result }" class="result" />
  </main>
</template>

<script>
import splitKhmerRunes from "../../JS/split-khmer";
import result from "../../PopUpBoxComponent/Result";
import typingWordKeyboard from "./typingWord_keyboard";
import { wordsList } from "../../JS/words-list";
import khmerWord from "../../JS/mapping.js";
import store from "@/store/index.js";
import navBar from "@/components/navBar.vue";


export default {
  name: "typingWord",
  components: {
    typingWordKeyboard,
    result,
    navBar, 
  },
  data() {
    return {
      list: wordsList,
      score: 0,
      time: 0,
      spans: [],
      buffer: "",
      result: false,
      timerStart: false,
    };
  },
  mounted () {
    this.set_defaultTimer()
  },
  methods: {
    set_defaultTimer (){
      if(this.$store.state.timerMinute === 0) {
        this.time = 1
      } else {
        this.time = this.$store.state.timerMinute
      }
    },
    convertToKhmerNum(num) {
      let numData = {
        0: "០",
        1: "១",
        2: "២",
        3: "៣",
        4: "៤",
        5: "៥",
        6: "៦",
        7: "៧",
        8: "៨",
        9: "៩",
      };

      let khmNum = "";
      for (let i = 0; i < num.toString().length; i++) {
        khmNum += numData[num.toString()[i]];
      }
      return khmNum;
    },

    startGame() {
      this.score = 0;

      // Sets the first word to type
      this.random();
      this.buffer = "";
      // Listen to typing events
      document.onkeypress = this.typing;
      document.onkeydown = this.clear;
      
    },

    isKhmerWord(userWord) {
      if (khmerWord.includes(userWord)) {
        this.$store.dispatch("setKhmer");
      } else {
        this.$store.dispatch("unSetKhmer");
      }
    },
    /**
     * Displays the modal with the scores
     * In case user wants to play again, resets data
     */
    endGame() {
      // Store highest score
      this.$store.dispatch("set_totalWordsTyped", this.score);
      this.result = true
    },
    random() {
      var random = Math.floor(Math.random() * this.list.length);
      const word = this.list[random];
      let graphemes = splitKhmerRunes(word);
      this.spans = []; // resets spans
      for (let i = 0; i < graphemes.length; i++) {
        // building the word with spans around the letters
        this.spans.push(graphemes[i]);
      }
    },
    clear: function (e) {
      switch (e.keyCode) {
        case 8:
          this.buffer = this.buffer.substring(0, this.buffer.length - 1);
          break;
        case 46:
          this.buffer = this.buffer.substring(0, this.buffer.length - 1);
          break;
      }
    },
    typing(e) {
      var vue = this;
      this.isKhmerWord(e.key);
      if(this.$store.state.isKhmer) {
        this.$refs.countdown.start();
        const noChars = [
          "Shift",
          "Control",
          "Alt",
          "Tab",
          "CapsLock",
          "Home",
          "PageUp",
          "PageDown",
          "End",
          "ScrollLock",
          "Pause",
          "Insert",
          "Delete",
          "Enter",
        ];
        let spans = document.getElementsByClassName("spans");
        if (!noChars.includes(e.key)) {
          let typed = e.key;
          this.buffer += typed;
          let graphemes = splitKhmerRunes(this.buffer);
          let lastGrapheme = graphemes[graphemes.length - 1];
          this.buffer = lastGrapheme; // If more than one 'grapheme', it means that the ones before were wrong
          // Check all span elements one by one as each one contains one letter of the word
          for (let i = 0; i < spans.length; i++) {
            // Checks that the letter typed is the one we want
            if (
              spans[i].innerHTML === typed ||
              spans[i].innerHTML === lastGrapheme
            ) {
              if (spans[i].classList.contains("bg")) {
                // if it's alerady highlighted then check the next one
                continue;
                // If it isn't highlighted yet and if the letter before is already highlighted (or if it's the first letter) (this is done to avoid
                // highlighting the letters who are not in order for being checked, for example if you have two "A"s it's to avoid marking both)
              } else if (
                !spans[i].classList.contains("bg") &&
                (spans[i - 1] === undefined ||
                  spans[i - 1].classList.contains("bg"))
              ) {
                spans[i].classList.add("bg");
                break;
              }
            }
          }
          // Check if the player has typed all the letters of the word
          var checker = 0;
          for (var j = 0; j < spans.length; j++) {
            if (spans[j].className === "spans bg") {
              checker++;
            }
            // If all letters are highlighted (meaning correct)
            // and if the last letter typed is the last letter that should be typed
            // (to prevent the player from scoring points during the word 'fading' time)
            // then the word is over, player scores one point and we set a new random word
            if (checker === spans.length && this.buffer === spans[j].innerHTML) {
              const player = document.getElementById('score-lottie')
              const lottie = player.getLottie()
              lottie.stop()
              lottie.play()
              this.score++; // increment score and display it
              document
                .getElementsByClassName("words")[0]
                .classList.add("fadeout"); // make word disappears
              setTimeout(function () {
                vue.buffer = ""; // resets buffers
                // Resets spans class so nothing is highlighted
                for (let k = 0; k < spans.length; k++) {
                  spans[k].classList = "spans";
                }
                vue.random(); // pick another word
                document.getElementsByClassName("words")[0].classList = "words";
              }, 200); // happen when the word has finished disappearing
            }
          }
        }
      }
    },
    zoomKeyboard() {
      var kb = document.getElementById("keyboard-tf");
      if (kb.style.width === "100%") {
        // it's big, make smaller
        kb.style.width = "10%";
        kb.style.height = "auto";
        kb.style.cursor = "zoom-in";
      } else {
        // it's small, make bigger
        kb.style.width = "100%";
        kb.style.height = screen.availHeight - kb.offsetTop + "px";
        kb.style.cursor = "zoom-out";
      }
    },
  },
 
  beforeDestroy() {
    document.onkeypress = null;
    document.onkeydown = null;
  },
  created() {
    this.startGame();
  },
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.transparent2 {
  filter: blur(8px);
}

.transparent {
  opacity: 0.3;
}

.nav{
  margin-bottom: 10rem;
}
* {
  overflow: visible !important;
}
.fadeout {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.2s, opacity 0.2s linear;
}

.buffer-title {
  color: bisque;
  margin-top: 30px;
}

.scoreWrap {
  float: left;
}
.timeWrap {
  float: right;
}

.outerWrap:after {
  font-size: 1em;
  content: "";
  display: block;
  clear: both;
}

.bg {
  background-color: #3f51b5;
}

.scoreWrap p,
.scoreWrap span,
.timeWrap p,
.timeWrap span {
  font-size: 1.5em;
  color: #ffc10a;
  margin-bottom: 1%;
}

.wordsWrap,
.wordsWrap p {
  margin: 0;
}
.box {
  height: 15rem;
  width: 40rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
  border-radius: 1.5rem;
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
    0 15px 40px rgba(166, 173, 201, 0.2);
  margin-bottom: 2rem;
}
.words span {
  font-size: 3em;
  letter-spacing: 1px;
  color: #000;
}

.buffer {
  min-height: 2.5em;
  font-size: 2em;
  letter-spacing: 1px;
  background-color: #ddd;
  color: #3f51b5;
  border-radius: 1.5rem;
  width: 30rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
#keyboardWrap-tf {
  display: flex;
  justify-content: flex-end;
}

#keyboard-tf {
  width: 10%;
  cursor: zoom-in;
}

/* Test.vue css */
#leftHand-vk,
#rightHand-vk {
  display: none;
}
.error-bg {
  animation: errorAnimationBackground 0.5s;
  animation: shake 0.5s;
  animation-iteration-count: 2;
  box-shadow: 1px 1px 18px 2px rgba(255, 0, 0, 1) !important;
}

@keyframes errorAnimationBackground {
  0% {
    background-color: #ddd;
  }
  33% {
    background-color: #ffc10a;
  }
  100% {
    background-color: #ddd;
  }
}

.error {
  animation: errorAnimation 0.5s;
}

@keyframes errorAnimation {
  0% {
    color: #ffc10a;
  }
  33% {
    color: black;
  }
  100% {
    color: #ffc10a;
  }
}

.transparent {
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  /* visibility: hidden; */
}
.col2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* width: 70%; */
  margin-top: 3.5rem;
}
.col1 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  /* width: 100rem; */
  margin-top: 1rem;
  margin-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
  /* width: 20%; */
  /* margin-right: 7rem; */
}
.row {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
h2 {
  font-family: "Kantumruy", sans-serif;
  color: black;
  margin-top: 1rem;
  margin-bottom: -5rem;
}
.key {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 300px;
  margin-left: 6.5rem;
  margin-top: -3rem;
}

#text-div {
  height: 15rem;
  width: 75rem;
  border: 2px solid #1b2448;
  border-radius: 10px;
  margin-top: -2rem;
  padding: 1rem;
  text-align: start;
  background-color: white;
  color: #1b2448;
  font-family: "Kantumruy", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

#text-wrapper {
  font-weight: normal;
  word-break: break-all;
  line-height: 4.8rem;
  font-size: 3em;
  max-height: 15.65rem;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
  color: black;
}

.text-wrapper > span {
  display: inline-block;
  padding-top: 4px;
  width: fit-content;
}

.space {
  font-size: 1rem;
  color: white !important;
}
.area {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.key {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60rem;
  height: 30rem;
}

.showError {
  visibility: visible !important;
}

@media screen and (max-width: 1110px) {
  .key {
    display: none;
  }
}

#text-div {
  height: 15rem;
  width: 75rem;
  border: 2px solid #1b2448;
  border-radius: 10px;
  margin-top: -1rem;
  padding: 1rem;
  text-align: start;
  background-color: white;
  color: #1b2448;
  font-family: "Kantumruy", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -2rem;
}

#keyboard-vk svg {
  width: 100px;
}
@media screen and (max-width: 1620px) and (min-width: 1255px) {
  .col1 {
    width: 70rem;
  }

  #text-wrapper {
    font-size: 2.8em;
  }
}
@media screen and (max-width: 1255px) and (min-width: 1175px) {
  #text-div {
    width: 70rem;
    margin-left: auto;
    margin-right: auto;
  }
  #text-wrapper {
    font-size: 2em;
  }
  .col1 {
    width: 60rem;
  }
}
@media screen and (max-width: 1175px) and (min-width: 1030px) {
  #text-div {
    width: 60rem;
    margin-left: auto;
    margin-right: auto;
  }
  #text-wrapper {
    font-size: 2.6em;
  }
  .col1 {
    width: 50rem;
  }
  #handsAndKeyboardWrap-vk {
    display: none;
  }
}
@media screen and (max-width: 1030px) and (min-width: 961px) {
  #text-div {
    width: 55rem;
    margin-left: auto;
    margin-right: auto;
  }
  #text-wrapper {
    font-size: 2.4em;
  }
  .col1 {
    width: 40rem;
  }
  #keyboard {
    height: 10rem !important;
    width: 10rem !important;
  }
}
@media screen and (max-width: 670px) and (min-width: 600px) {
  .box {
    width: 35rem;
  }
}
@media screen and (max-width: 600px) and (min-width: 540px) {
  .box {
    width: 32rem;
  }
}
@media screen and (max-width: 540px) and (min-width: 492px) {
  .box {
    width: 29rem;
  }
  .buffer {
    width: 25rem;
  }
}
@media screen and (max-width: 961px) and (min-width: 860px) {
  #text-div {
    width: 50rem;
    margin-left: auto;
    margin-right: auto;
  }
  #text-wrapper {
    font-size: 2.2em;
  }
  #handsAndKeyboardWrap-vk {
    display: none;
  }
}
@media screen and (max-width: 860px) and (min-width: 770px) {
  #text-div {
    width: 45rem;
    margin-left: auto;
    margin-right: auto;
  }
  #text-wrapper {
    font-size: 2em;
  }
  #handsAndKeyboardWrap-vk {
    display: none;
  }
}
@media screen and (max-width: 770px) and (min-width: 695px) {
  #text-div {
    width: 40rem;
    margin-left: auto;
    margin-right: auto;
  }
  #text-wrapper {
    font-size: 1.8em;
  }
  #handsAndKeyboardWrap-vk {
    display: none;
  }
}
@media screen and (max-width: 695px) and (min-width: 610px) {
  #text-div {
    width: 35rem;
    margin-left: auto;
    margin-right: auto;
  }
  #text-wrapper {
    font-size: 1.6em;
  }
  #handsAndKeyboardWrap-vk {
    display: none;
  }
}
@media screen and (max-width: 610px) and (min-width: 530px) {
  #text-div {
    width: 30rem;
    margin-left: auto;
    margin-right: auto;
  }
  #text-wrapper {
    font-size: 1.4em;
  }
  #handsAndKeyboardWrap-vk {
    display: none;
  }
}
@media screen and (max-width: 530px) and (min-width: 492px) {
  #text-div {
    width: 27rem;
    margin-left: auto;
    margin-right: auto;
  }
  #text-wrapper {
    font-size: 1.4em;
  }
  #handsAndKeyboardWrap-vk {
    display: none;
  }
}
.text-wrapper {
  font-weight: normal;
  word-break: break-all;
  line-height: 4.6rem;
  font-size: 3em;
  max-height: 15.65rem;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
}

.text-wrapper > span {
  display: inline-block;
  padding-top: 4px;
  width: fit-content;
}

.space {
  font-size: 1rem;
  color: white;
}

.hidden {
  display: none;
}

.current {
  color: #ffc10a;
}

.correct {
  color: #3f51b5;
}

#decomposition-vk,
#text-vk {
  font-weight: normal;
  word-break: break-all;
}

#text-vk {
  line-height: 1.5em;
  font-size: 3em;
  max-height: 3em;
  overflow: hidden;
  margin: 0 auto;
}

#decomposition-vk {
  font-size: 2em;
  margin: 1% auto 3% auto;
}

#textWrap-vk {
  background-color: #ddd;
  border-radius: 5px;
}
.lottie {
  border: 1px solid white;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 10px;
  margin-top: 6rem;
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
    0 15px 40px rgba(166, 173, 201, 0.2);
  background-color: white;
  width: 15rem;
  height: 7rem;
  margin-right: 3rem;
  margin-top: 2rem;
  margin: 1rem;
}

@media screen and (max-width: 845px) and (min-width: 600px) {
  .lottie {
    width: 10rem;
    display: flex;
    flex-direction: column;
    height: 10rem;
    justify-content: center;
    align-items: center;
    /* border-radius: 50%; */
  }
  .text > h3 {
    margin-top: -1rem;
    margin-left: -1.5rem;
  }
}
@media screen and (max-width: 600px) {
  .lottie {
    width: 6rem;
    display: flex;
    flex-direction: column;
    height: 10rem;
    justify-content: center;
    align-items: center;
  }
  .text > h3 {
    margin-top: -1rem;
    margin-left: -1.7rem;
  }
}
.text {
  margin-left: 2rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: "Kantumruy", sans-serif;
  font-size: 1.2rem;
}
.text > h3 {
  display: flex;
  justify-content: center;
  align-items: center;
}
#shaking {
  animation: shake 0.5s;
  animation-iteration-count: 1;
  box-shadow: 1px 1px 18px 2px rgba(255, 0, 0, 1);
}
@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
#popup {
  position: absolute;
  visibility: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  overflow: hidden;
}

.showError {
  visibility: visible;
}

.result {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  visibility: hidden;
}
</style>
