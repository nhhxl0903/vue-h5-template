<!-- home -->
<template>
  <div>
    <div id="liffAppContent" v-if="liffAppState">
      <!-- ACTION BUTTONS -->
      <div class="buttonGroup">
          <div class="buttonRow">
              <button id="openWindowButton">Open External Window</button>
              <button id="closeWindowButton">Close LIFF App</button>
          </div>
          <div class="buttonRow">
              <button id="scanQrCodeButton">Open QR Code Reader</button>
              <button id="sendMessageButton">Send Message</button>
          </div>
          <div class="buttonRow">
              <button id="getAccessToken">Get Access Token</button>
              <button id="getProfileButton">Get Profile</button>
          </div>
          <div class="buttonRow">
              <button v-if="isInClient" id="shareTargetPicker">Open Share Target Picker</button>
          </div>
      </div>
      <div id="shareTargetPickerMessage"></div>
      <!-- ACCESS TOKEN DATA -->
      <div id="accessTokenData" class="hidden textLeft">
          <h2>Access Token</h2>
          <a href="#" onclick="toggleAccessToken()">Close Access Token</a>
          <table>
              <tr>
                  <th>accessToken</th>
                  <td id="accessTokenField"></td>
              </tr>
          </table>
      </div>
      <!-- SCAN QR RESULT -->
      <div id="scanQr" class="hidden textLeft">
          <h2>QR Code reader</h2>
          <a href="#" onclick="toggleQrCodeReader()">Close QR Code Reader Result</a>
          <table>
              <tr>
                  <th>scanCode Result</th>
                  <td id="scanQrField"></td>
              </tr>
          </table>
      </div>
      <!-- PROFILE INFO -->
      <div id="profileInfo" class="hidden textLeft">
          <h2>Profile</h2>
          <a href="#" onclick="toggleProfileData()">Close Profile</a>
          <div id="profilePictureDiv">
          </div>
          <table>
              <tr>
                  <th>userId</th>
                  <td id="userIdProfileField"></td>
              </tr>
              <tr>
                  <th>displayName</th>
                  <td id="displayNameField"></td>
              </tr>
              <tr>
                  <th>statusMessage</th>
                  <td id="statusMessageField"></td>
              </tr>
          </table>
      </div>
      <!-- LIFF DATA -->
      <div id="liffData">
          <h2 id="liffDataHeader" class="textLeft">LIFF Data</h2>
          <table>
              <tr>
                  <th>OS</th>
                  <td id="deviceOS" class="textLeft">{{deviceOS}}</td>
              </tr>
              <tr>
                  <th>Language</th>
                  <td id="browserLanguage" class="textLeft">{{browserLanguage}}</td>
              </tr>
              <tr>
                  <th>LIFF SDK Version</th>
                  <td id="sdkVersion" class="textLeft">{{sdkVersion}}</td>
              </tr>
              <tr>
                  <th>LINE Version</th>
                  <td id="lineVersion" class="textLeft">{{lineVersion}}</td>
              </tr>
              <tr>
                  <th>isInClient</th>
                  <td id="isInClient" class="textLeft">{{isInClient}}</td>
              </tr>
              <tr>
                  <th>isLoggedIn</th>
                  <td id="isLoggedIn" class="textLeft">{{isLoggedIn}}</td>
              </tr>
          </table>
      </div>
      <!-- LOGIN LOGOUT BUTTONS -->
      <div class="buttonGroup">
          <button id="liffLoginButton" v-if="!isLogin && !isInClient">Log in</button>
          <button id="liffLogoutButton" v-if="isLogin && !isInClient">Log out</button>
      </div>
      <div id="statusMessage">
          <div id="isInClientMessage">{{isInClientMessage}}</div>
          <div id="apiReferenceMessage">
              <p>Available LIFF methods vary depending on the browser you use to open the LIFF app.</p>
              <p>Please refer to the <a href="https://developers.line.biz/en/reference/liff/#initialize-liff-app">API reference page</a> for more information.</p>
          </div>
      </div>
  </div>
  <!-- LIFF ID ERROR -->
  <div id="liffIdErrorMessage" v-if="liffIdError">
      <p>You have not assigned any value for LIFF ID.</p>
      <p>If you are running the app using Node.js, please set the LIFF ID as an environment variable in your Heroku account follwing the below steps: </p>
      <code id="code-block">
          <ol>
              <li>Go to `Dashboard` in your Heroku account.</li>
              <li>Click on the app you just created.</li>
              <li>Click on `Settings` and toggle `Reveal Config Vars`.</li>
              <li>Set `MY_LIFF_ID` as the key and the LIFF ID as the value.</li>
              <li>Your app should be up and running. Enter the URL of your app in a web browser.</li>
          </ol>
      </code>
      <p>If you are using any other platform, please add your LIFF ID in the <code>index.html</code> file.</p>
      <p>For more information about how to add your LIFF ID, see <a href="https://developers.line.biz/en/reference/liff/#initialize-liff-app">Initializing the LIFF app</a>.</p>
    </div>
    <!-- LIFF INIT ERROR -->
    <div id="liffInitErrorMessage" v-if="liffInitError">
        <p>Something went wrong with LIFF initialization.</p>
        <p>LIFF initialization can fail if a user clicks "Cancel" on the "Grant permission" screen, or if an error occurs in the process of <code>liff.init()</code>.</p>
    </div>
    <!-- NODE.JS LIFF ID ERROR -->
    <div id="nodeLiffIdErrorMessage" v-if="nodeLiffIdError">
        <p>Unable to receive the LIFF ID as an environment variable.</p>
    </div>
  </div>
</template>

<script>
import { LiffID } from '@/api/home.js'
export default {
  data() {
    return {
      liffAppState: true,
      liffIdError: false,
      liffInitError: false,
      nodeLiffIdError: false,
      deviceOS: '',
      isLoggedIn: '',
      isInClient: '',
      lineVersion: '',
      sdkVersion: '',
      browserLanguage: '',
      isLogin: false,
      isInClientMessage: ''
    }
  },

  computed: {},

  mounted() {
    LiffID().then((res) => {
      this.liffId = res.id
      this.initializeLiffOrDie(this.liffId)
    }).catch(() => {
      this.liffAppState = false
      this.nodeLiffIdError = true
    })
  },

  methods: {
    initializeLiffOrDie(myLiffId) {
      if (!myLiffId) {
        this.liffAppState = false
        this.liffIdError = true
      } else {
        this.initializeLiff(myLiffId)
      }
    },
    initializeLiff(myLiffId) {
      this.$liff.init({
        liffId: myLiffId
      }).then(() => {
        // start to use LIFF's api
        this.initializeApp()
      }).catch(() => {
        this.liffAppState = false
        this.liffInitError = true
      })
    },
    initializeApp() {
      this.displayLiffData()
      this.displayIsInClientInfo()
      // check if the user is logged in/out, and disable inappropriate button
      console.log(1111, this.$liff.isLoggedIn())
      this.isLogin = this.$liff.isLoggedIn()
    },
    displayLiffData() {
      this.browserLanguage = this.$liff.getLanguage()
      this.sdkVersion = this.$liff.getVersion()
      this.lineVersion = this.$liff.getLineVersion()
      this.isInClient = this.$liff.isInClient()
      this.isLoggedIn = this.$liff.isLoggedIn()
      this.deviceOS = this.$liff.getOS()
    },
    displayIsInClientInfo() {
      this.isInClient = this.$liff.isInClient()
      if (this.isInClient) {
        this.isInClientMessage = 'You are opening the app in the in-app browser of LINE.'
      } else {
        this.isInClientMessage = 'You are opening the app in an external browser.'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  table {
    width: 100%;
    table-layout: fixed;
    word-break: break-all;
  }

  div {
    max-width: 100%;
    text-align: center;
  }

  th {
    text-align: center;
  }

  table, th, td {
    border: 1px solid black;
  }

  img {
    max-width: 25%;
    height: auto;
  }

  button {
    margin: 4px;
  }

  #code-block {
    background-color: #eee;
    border: 1px solid #999;
    display: block;
    padding: 20px;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    overflow-x: auto;
    white-space: nowrap;
  }

  #profilePictureDiv {
    text-align: center;
  }

  #profileImageDiv {
    height: 100px;
    width: 100px;
  }

  #statusMessage {
    position: relative;
    top: 40px;
  }

  .textLeft {
    text-align: left;
  }

  .buttonGroup {
    padding-top: 20px;
  }

  .hidden {
    display: none;
  }
</style>
