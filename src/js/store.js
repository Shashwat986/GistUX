import GitHub from 'github-api';

var store = {
  state: {
    githubKey: null,
    gh: new GitHub(),
    gistUXData: null,
    ghUser: null,
    showSpinner: false,
    spinnerMessage: null,
    error: null,
    success: null,
  },
  setGithubKey (key) {
    this.state.githubKey = key;
    this.state.gh = new GitHub({token: key});
    this.state.ghUser = this.state.gh.getUser();
    this.loadGistUXData();
  },
  destroySession () {
    this.state.githubKey = null;
    this.state.gh = null;
    this.state.ghUser = null;
  },
  showSpinner (message = "") {
    this.state.spinnerMessage = message;
    this.state.showSpinner = true;
  },
  hideSpinner () {
    this.state.showSpinner = false;
  },
  setSuccess (message = null) {
    this.state.success = message;
    that = this;

    setTimeout(function () {
      that.state.success = null;
    }, 3000);
  },
  setError (message = null) {
    this.state.error = message;
    let that = this;

    setTimeout(function () {
      that.state.error = null;
    }, 3000);
  },
  loadGistUXData () {
    this.showSpinner("Fetching Data");

    if (!this.state.ghUser) {
      if (!this.state.gh) return;
      this.state.ghUser = this.state.gh.getUser();
    }

    // This is a hack to get all gists
    let url = this.state.ghUser.__getScopedUrl('gists');

    let that = this;
    this.state.ghUser._requestAllPages(url).then(function (resp) {
      that.state.gistUXData = resp.data;
      that.hideSpinner();
    }).catch(function (e) {
      that.setError("Invalid Authentication Key");
      that.destroySession();
      that.hideSpinner();
    });
  }
}

export default store;
