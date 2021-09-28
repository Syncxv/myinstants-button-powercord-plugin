var { getModule, React } = require("powercord/webpack");
var { inject, uninject } = require("powercord/injector");
var { findInReactTree } = require("powercord/util");
const { Plugin } = require("powercord/entities");
var { Clickable } = require("powercord/components");
var { getModule, React } = require("powercord/webpack");
class PlayButton extends React.Component {
    constructor(props) {
        super(props);
      }
    render() {
    return /*#__PURE__*/React.createElement("div", {
        className: "powercord-snippet-apply"
    }, /*#__PURE__*/React.createElement(Clickable, {
        onClick: async () => {
            const url = this.props.message.content.match(/https:\/\/www.myinstants.com\/.*/)[0]
            const res = await fetch("https://cors-real-will-work.herokuapp.com/"+url)
            const text = await res.text()
            const doc = window.parser.parseFromString(text, "text/html")
            const name = doc.querySelector("#instant-page-button").attributes.onmousedown.value.replaceAll("play('", "").replace("')", "")
            const audioData = await fetch(`https://cors-real-will-work.herokuapp.com/https://www.myinstants.com${name}`)
            const buffer = await audioData.arrayBuffer()
            window._play(buffer)

        }
    }, "Play"));
    }

}
module.exports = class hehenigga extends Plugin {
  async startPlugin() {
    const audioContext = new AudioContext();
    window._play = (_buffer) => {
        const source = audioContext.createBufferSource();
        source.connect(audioContext.destination);
        audioContext.decodeAudioData(_buffer, function(buffer) {
            source.buffer = buffer;
            source.start(0);
        });
    }
    window.parser = new DOMParser
    const MiniPopover = await getModule(
      (m) => m?.default?.displayName === "MiniPopover"
    );

    inject("button-sound-thingy", MiniPopover, "default", (_, res) => {
      const props = findInReactTree(res, (r) => r?.message);
      if (!props) return res;
      if (props.message.content.includes("https://www.myinstants.com/")) {
        res.props.children.unshift(
          React.createElement(PlayButton, { message: props.message })
        );
      }
      return res;
    });
    MiniPopover.default.displayName = "MiniPopover";
  }

  pluginWillUnload() {
    uninject('button-sound-thingy')
  }
}
